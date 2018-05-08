import { observable, computed, autorun } from 'mobx';
import { asyncAction } from 'mobx-utils';
import { Status } from './types';
import { IErrorProcessor, OnlineStore } from './online-store';
import { ILocalizator } from '../localization/types';

const { pending } = OnlineStore;

interface IFetchListResult<T> {
    records: Array<T>;
    total: number;
}

export interface IListStoreApi<T> {
    fetchList: (params: IListServerQuery) => Promise<IFetchListResult<T>>;
}

export interface IListServerQuery {
    limit: number;
    offset: number;
    sortDesc: boolean;
    sortBy?: string;
    filter?: string;
}

export interface IUserInput {
    page: number;
    limit: number;
    sortBy: string;
    filter: string;
    sortDesc: boolean;
}

export interface IListStore<T> {
    status: Status;
    total: number;
    offset: number;
    limit: number;
    records: T[];
    page: number;
    totalPage: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    update: () => any;
    updateUserInput: (input: Partial<IUserInput>) => any;
}

export interface IListStoreServices<TItem> {
    errorProcessor: IErrorProcessor;
    localizator: ILocalizator;
    api: {
        fetchList: (query: IListServerQuery) => Promise<Array<TItem>>;
    };
}

export interface IListStoreStores {
    filter: {
        readonly filterAsString: string;
    };
}

export class ListStore<TItem> extends OnlineStore implements IListStore<TItem> {
    constructor(stores: IListStoreStores, services: IListStoreServices<TItem>) {
        super(services);

        this.services = services;

        autorun(() => {
            if (stores.filter.filterAsString) {
                this.updateUserInput({
                    filter: stores.filter.filterAsString,
                });
            }
        });
    }

    protected services: IListStoreServices<TItem>;

    @observable public status: Status = Status.PENDING;

    @observable public error = '';

    @observable public total = 0;

    @observable public offset = 1;

    @observable public limit = 20;

    @observable.ref public records: Array<TItem> = [];

    @observable
    private userInput: IUserInput = {
        page: 1,
        limit: 20,
        sortDesc: false,
        sortBy: '',
        filter: '',
    };

    @computed
    public get page() {
        return Math.floor(this.offset / this.limit) + 1;
    }

    @computed
    public get totalPage() {
        return Math.floor(this.total / this.limit) + 1;
    }

    @computed
    public get hasPrevPage() {
        return this.offset > 1;
    }

    @computed
    public get hasNextPage() {
        return this.offset + this.limit < this.total;
    }

    @pending
    @asyncAction
    public *update() {
        const { page, limit, sortBy, filter, sortDesc } = this.userInput;

        const offset = (page - 1) * limit;

        this.status = Status.PENDING;

        const query: IListServerQuery = {
            offset,
            limit,
            sortDesc: Boolean(sortDesc),
        };

        if (filter) {
            query.filter = JSON.stringify(filter);
        }

        if (sortBy) {
            query.sortBy = sortBy;
        }

        try {
            const response = yield this.services.api.fetchList(query);

            this.offset = offset;
            this.limit = limit;
            this.records = response.records;
            this.total = response.total;
            this.status = Status.DONE;
        } catch (e) {
            this.error = e.message;
            this.status = Status.ERROR;

            throw e;
        }
    }

    @asyncAction
    public *updateUserInput(input: Partial<IUserInput>) {
        const changes = Object.keys(input).filter(k => {
            const key = k as keyof IUserInput;
            const result = input[key] !== this.userInput[key];

            if (result) {
                this.userInput[key] = input[key] as any;
            }

            return result;
        });

        if (changes.length === 0) {
            return;
        }

        yield this.update();
    }
}

export default ListStore;