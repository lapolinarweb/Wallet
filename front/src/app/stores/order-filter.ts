import { observable, computed, action } from 'mobx';
import {
    EnumProfileStatus,
    EnumOrderType,
    EnumOrderStatus,
} from 'app/api/types';
import { RootStore } from 'app/stores';
import { TypeNotStrictEthereumAddress } from '../api/runtime-types';
import { validatePositiveNumber } from '../utils/validation/validate-positive-number';

export enum EnumOrderOwnerType {
    market,
    my,
}

const VALIDATION_MSG = 'incorrect';

export interface IOrderFilter {
    orderOwnerType: EnumOrderOwnerType;
    creatorAddress: string;
    type: string; // TODO rename
    onlyActive: boolean;
    priceFrom: string;
    priceTo: string;
    // owner status:
    professional: boolean;
    registered: boolean;
    identified: boolean;
    anonymous: boolean;
    // -
    redshiftFrom: string;
    redshiftTo: string;
    ethFrom: string;
    ethTo: string;
    zCashFrom: string;
    zCashTo: string;
    cpuCountFrom: string;
    cpuCountTo: string;
    gpuCountFrom: string;
    gpuCountTo: string;
    ramSizeFrom: string;
    ramSizeTo: string;
    storageSizeFrom: string;
    storageSizeTo: string;
    gpuRamSizeFrom: string;
    gpuRamSizeTo: string;
}

export type IOrderFilterValidation = Partial<
    { [P in keyof IOrderFilter]: string }
>;

export interface IFilterStore {
    readonly filter: any;
    readonly filterAsString: string;
}

export class OrderFilterStore implements IFilterStore {
    private static validateNumber = (value: string) =>
        value === '' ? '' : validatePositiveNumber(value).join(', ');

    private static defaultUserInput: IOrderFilter = {
        orderOwnerType: EnumOrderOwnerType.market,
        creatorAddress: '',
        type: 'Sell',
        onlyActive: false,
        priceFrom: '',
        priceTo: '',
        // owner status:
        professional: false,
        registered: false,
        identified: false,
        anonymous: false,
        // -
        redshiftFrom: '',
        redshiftTo: '',
        ethFrom: '',
        ethTo: '',
        zCashFrom: '',
        zCashTo: '',
        cpuCountFrom: '',
        cpuCountTo: '',
        gpuCountFrom: '',
        gpuCountTo: '',
        ramSizeFrom: '',
        ramSizeTo: '',
        storageSizeFrom: '',
        storageSizeTo: '',
        gpuRamSizeFrom: '',
        gpuRamSizeTo: '',
    };

    protected static emptyValidation: IOrderFilterValidation = {
        redshiftFrom: '',
        redshiftTo: '',
        ethFrom: '',
        ethTo: '',
        zCashFrom: '',
        zCashTo: '',
        cpuCountFrom: '',
        cpuCountTo: '',
        gpuCountTo: '',
        gpuCountFrom: '',
        ramSizeFrom: '',
        ramSizeTo: '',
        storageSizeFrom: '',
        storageSizeTo: '',
        gpuRamSizeFrom: '',
        gpuRamSizeTo: '',
        priceFrom: '',
        priceTo: '',
    };

    protected rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
    }

    @observable
    public userInput: IOrderFilter = OrderFilterStore.defaultUserInput;

    @action
    public setUserInput(values: Partial<IOrderFilter>) {
        this.userInput = OrderFilterStore.defaultUserInput;
        this.updateUserInput(values);
        this.applyFilter();
    }

    @action
    public updateUserInput(values: Partial<IOrderFilter>) {
        const keys = Object.keys(values) as Array<keyof IOrderFilter>;
        keys.forEach(key => {
            if (!(key in this.userInput)) {
                throw new Error(`Unknown user input ${key}`);
            }

            if (values[key] !== undefined) {
                (this.userInput[key] as any) = values[key];
            }
        });
    }

    protected readonly validationFixedRef: IOrderFilterValidation = {
        ...OrderFilterStore.emptyValidation,
    };
    @computed
    get validation() {
        for (const key in OrderFilterStore.emptyValidation) {
            const k = key as keyof IOrderFilter;
            this.validationFixedRef[k] =
                OrderFilterStore.validateNumber(String(this.userInput[k])) &&
                VALIDATION_MSG;
        }

        this.validationFixedRef.creatorAddress = this.validationCreatorAddress;

        return this.validationFixedRef;
    }

    @computed
    public get orderOwnerType() {
        return this.userInput.orderOwnerType;
    }

    @computed
    public get myAddress() {
        return this.rootStore.marketStore.marketAccountAddress;
    }

    @computed
    public get creatorAddress() {
        let result = '';

        if (this.validationCreatorAddress === '') {
            result = this.userInput.creatorAddress;

            if (!result.startsWith('0x')) {
                result = '0x' + result;
            }
        }

        return result;
    }

    @computed
    public get validationCreatorAddress(): string {
        let result = '';

        if (this.userInput.creatorAddress !== '') {
            try {
                TypeNotStrictEthereumAddress(this.userInput.creatorAddress);
            } catch (e) {
                result = 'incorrect ethereum address'; // TODO use localizator
            }
        }

        return result;
    }

    @computed
    public get type() {
        return this.userInput.type;
    }

    @computed
    public get onlyActive() {
        return this.userInput.onlyActive;
    }

    protected getTextInputValue(key: keyof IOrderFilter): string | undefined {
        return this.validation[key] ? undefined : String(this.userInput[key]);
    }

    @computed
    public get priceFrom(): string | undefined {
        return this.getTextInputValue('priceFrom');
    }

    @computed
    public get priceTo(): string | undefined {
        return this.getTextInputValue('priceTo');
    }

    @computed
    public get professional() {
        return this.userInput.professional;
    }

    @computed
    public get registered() {
        return this.userInput.registered;
    }

    @computed
    public get identified() {
        return this.userInput.identified;
    }

    @computed
    public get anonymous() {
        return this.userInput.anonymous;
    }

    @computed
    public get cpuCountFrom(): string | undefined {
        return this.getTextInputValue('cpuCountFrom');
    }

    @computed
    public get cpuCountTo(): string | undefined {
        return this.getTextInputValue('cpuCountTo');
    }

    @computed
    public get gpuCountFrom(): string | undefined {
        return this.getTextInputValue('gpuCountFrom');
    }

    @computed
    public get gpuCountTo(): string | undefined {
        return this.getTextInputValue('gpuCountTo');
    }

    @computed
    public get ramSizeFrom(): string | undefined {
        return this.getTextInputValue('ramSizeFrom');
    }

    @computed
    public get ramSizeTo(): string | undefined {
        return this.getTextInputValue('ramSizeTo');
    }

    @computed
    public get gpuRamSizeFrom(): string | undefined {
        return this.getTextInputValue('gpuRamSizeFrom');
    }

    @computed
    public get gpuRamSizeTo(): string | undefined {
        return this.getTextInputValue('gpuRamSizeTo');
    }

    @computed
    public get storageSizeFrom(): string | undefined {
        return this.getTextInputValue('storageSizeFrom');
    }

    @computed
    public get storageSizeTo(): string | undefined {
        return this.getTextInputValue('storageSizeTo');
    }

    @computed
    public get redshiftFrom(): string | undefined {
        return this.getTextInputValue('redshiftFrom');
    }

    @computed
    public get redshiftTo(): string | undefined {
        return this.getTextInputValue('redshiftTo');
    }

    @computed
    public get ethFrom(): string | undefined {
        return this.getTextInputValue('ethFrom');
    }

    @computed
    public get ethTo(): string | undefined {
        return this.getTextInputValue('ethTo');
    }

    @computed
    public get zСashFrom(): string | undefined {
        return this.getTextInputValue('zCashFrom');
    }

    @computed
    public get zСashTo(): string | undefined {
        return this.getTextInputValue('zCashTo');
    }

    @computed
    public get filter(): any {
        return {
            creator: {
                address:
                    this.creatorAddress !== ''
                        ? { $eq: this.creatorAddress }
                        : this.orderOwnerType === EnumOrderOwnerType.my
                            ? { $eq: this.myAddress }
                            : { $ne: this.myAddress },
                status: {
                    $in: [
                        [EnumProfileStatus.anonimest, this.anonymous],
                        [EnumProfileStatus.ident, this.identified],
                        [EnumProfileStatus.reg, this.registered],
                        [EnumProfileStatus.pro, this.professional],
                    ]
                        .filter(([n, isEnabled]) => isEnabled)
                        .map(([n]) => n),
                },
            },
            orderType: {
                $eq:
                    this.type === 'Buy' ? EnumOrderType.bid : EnumOrderType.ask,
            },
            orderStatus: {
                $eq: this.onlyActive
                    ? EnumOrderStatus.active
                    : EnumOrderStatus.unknown,
            },
            price: {
                $gte: this.priceFrom,
                $lte: this.priceTo,
            },
            benchmarkMap: {
                cpuCount: { $gte: this.cpuCountFrom, $lte: this.cpuCountTo },
                gpuCount: { $gte: this.gpuCountFrom, $lte: this.gpuCountTo },
                ramSize: { $gte: this.ramSizeFrom, $lte: this.ramSizeTo },
                gpuRamSize: {
                    $gte: this.gpuRamSizeFrom,
                    $lte: this.gpuRamSizeTo,
                },
                redshiftGpu: { $gte: this.redshiftFrom, $lte: this.redshiftTo },
                ethHashrate: { $gte: this.ethFrom, $lte: this.ethTo },
                zcashHashrate: { $gte: this.zСashFrom, $lte: this.zСashTo },
                storageSize: {
                    $gte: this.storageSizeFrom,
                    $lte: this.storageSizeTo,
                },
            },
            profileAddress: {
                $eq: this.myAddress,
            },
        };
    }

    @action
    public applyFilter() {
        this.filterAsString = JSON.stringify(this.filter);
    }

    @observable public filterAsString: string = '';
}

export default OrderFilterStore;
