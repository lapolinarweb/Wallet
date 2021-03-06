import * as React from 'react';
import * as cn from 'classnames';
import { DatePicker } from '../date-picker';
import { Calendar } from '../calendar';

import {
    IDateRangeProps,
    TDateRangeValue,
    IDateRangeOptionalProps,
    IDateRangeAllProps,
} from './types';

export class DateRange extends React.Component<IDateRangeProps, any> {
    public static defaultProps: IDateRangeOptionalProps = {
        valueToString: DateRange.format,
        className: '',
        leftPickerProps: undefined,
        rightPickerProps: undefined,
    };

    public static format(value: TDateRangeValue): string {
        return `${Calendar.format(value[0])} ~ ${Calendar.format(value[1])}`;
    }

    protected static isDateEqual(
        date1: Date | undefined,
        date2: Date | undefined,
    ) {
        if (date1 !== undefined && date2 !== undefined) {
            return (
                date1.getFullYear() === date2.getFullYear() &&
                date1.getMonth() === date2.getMonth() &&
                date1.getDate() === date2.getDate()
            );
        } else {
            return false;
        }
    }

    protected onChange = (params: any) => {
        const value = [
            this.props.value[0],
            this.props.value[1],
        ] as TDateRangeValue;

        const isRangeEnd = params.name === 'to';
        const idx = isRangeEnd ? 1 : 0;
        value[idx] = params.value;
        const valueString = this.getProps().valueToString(value);

        if (isRangeEnd) {
            value[idx].setHours(23);
            value[idx].setMinutes(59);
            value[idx].setSeconds(59);
            value[idx].setMilliseconds(999);
        }

        this.props.onChange({
            value,
            valueString,
            name,
        });
    };

    protected getProps(): IDateRangeAllProps {
        return this.props as IDateRangeAllProps;
    }

    public shouldComponentUpdate(next: IDateRangeProps) {
        const props = this.props;

        return (
            props.className !== next.className ||
            props.leftPickerProps !== next.leftPickerProps ||
            props.rightPickerProps !== next.rightPickerProps ||
            !DateRange.isDateEqual(props.value[0], next.value[0]) ||
            !DateRange.isDateEqual(props.value[1], next.value[1])
        );
    }

    public render() {
        const { value: fromTo, className } = this.props;
        const from = fromTo[0];
        const to = fromTo[1];

        return (
            <div className={cn('date-range', className)}>
                <DatePicker
                    className="date-range__picker"
                    name="from"
                    onChange={this.onChange}
                    value={from}
                    targetDate={to}
                    disableAfter={to}
                />
                <DatePicker
                    className="date-range__picker"
                    name="to"
                    onChange={this.onChange}
                    value={to}
                    targetDate={from}
                    disableBefore={from}
                />
            </div>
        );
    }
}

export default DateRange;

export * from './types';
