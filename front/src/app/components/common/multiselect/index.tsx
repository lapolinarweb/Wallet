import * as React from 'react';
import * as get from 'lodash/fp/get';
import {
    IMultiSelectProps,
    IMultiSelectAllProps,
    IMultiSelectOptionalProps,
} from './types';
import { Button } from '../button';
import { DropdownInput } from '../dropdown-input';
import { Checkbox } from '../checkbox';
import { ITogglerChangeParams } from '../toggler';
import Icon from '../icon';
import * as cn from 'classnames';

export class MultiSelect<T> extends React.Component<IMultiSelectProps<T>, any> {
    public static readonly defaultProps: IMultiSelectOptionalProps = {
        label: '',
        className: '',
        nameIndex: '',
        filterPlaceHolder: '',
    };

    public constructor(props: IMultiSelectProps<T>) {
        super(props);

        this.state = {
            filteredList: props.list,
            isExpanded: false,
        };
    }

    // Helpers

    protected getName = (item: T): string => {
        return this.props.nameIndex
            ? get(this.props.nameIndex)(item)
            : String(item);
    };

    protected getLabelValue = () => {
        return this.props.value.length === 1
            ? this.getName(this.props.value[0])
            : this.props.value.length.toString();
    };

    protected filterList = (value: string): T[] => {
        const filteredInputValue = value.trim().toLowerCase();
        return filteredInputValue === ''
            ? this.props.list
            : this.props.list.filter(item =>
                  this.getName(item)
                      .toLowerCase()
                      .includes(filteredInputValue),
              );
    };

    // Event Handlers

    protected handleChangeFilter = (event: any) => {
        const value = event.target.value;
        this.setState({
            filteredList: this.filterList(value),
        });
    };

    protected handleRequireClose = () => {
        this.setState({
            filteredList: this.props.list,
            isExpanded: false,
        });

        this.props.onRequireClose && this.props.onRequireClose();
    };

    protected handleChangeCheckbox = (params: ITogglerChangeParams) => {
        const itemName = params.name;

        const value: T[] = params.value
            ? [
                  ...this.props.value,
                  this.props.list.find(x => this.getName(x) === itemName) as T,
              ]
            : this.props.value.filter(x => this.getName(x) !== itemName);

        this.props.onChange({
            value,
            name: this.props.name,
            valueString: value.map(this.getName).join(', '),
        });
    };

    protected handleClickClear = () => {
        this.setState({
            isExpanded: false,
        });

        this.props.onChange({
            value: [],
            name: this.props.name,
            valueString: '',
        });
    };

    protected handleButtonClick = () => {
        this.setState({
            isExpanded: !this.state.isExpanded,
        });
    };

    public render() {
        const p = this.props as IMultiSelectAllProps<T>;
        const valueNames = p.value.map(this.getName);

        return (
            <div className={cn('multiselect__container', p.className)}>
                <DropdownInput
                    className="multiselect__dropdown-input"
                    valueString={`${p.label}: ${this.getLabelValue()}`}
                    onRequireClose={this.handleRequireClose}
                    onButtonClick={this.handleButtonClick}
                    hasBalloon
                    isExpanded={this.state.isExpanded}
                >
                    <div className="multiselect__popup">
                        <div className="multiselect__input-container">
                            <input
                                className="multiselect__input"
                                name="filter"
                                onChange={this.handleChangeFilter}
                                placeholder={p.filterPlaceHolder}
                            />
                        </div>

                        <div className="multiselect__list-container">
                            {this.state.filteredList.map((i: T) => {
                                const name = this.getName(i);

                                return (
                                    <Checkbox
                                        className="multiselect__item"
                                        key={name}
                                        name={name}
                                        title={name}
                                        value={valueNames.indexOf(name) !== -1}
                                        onChange={this.handleChangeCheckbox}
                                    />
                                );
                            })}
                        </div>

                        <div className="multiselect__apply-button-container">
                            <Button
                                color="violet"
                                className="multiselect__apply-button"
                                onClick={this.handleRequireClose}
                            >
                                APPLY
                            </Button>
                        </div>
                    </div>
                </DropdownInput>
                {p.hasClearButton ? (
                    <button
                        className="multiselect__clear-button"
                        onClick={this.handleClickClear}
                    >
                        <Icon i="Close" />
                    </button>
                ) : null}
            </div>
        );
    }
}

export default MultiSelect;

export * from './types';
