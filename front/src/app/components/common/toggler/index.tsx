import * as React from 'react';
import * as cn from 'classnames';
import { ITogglerBaseProps } from '../types';

export interface ITogglerChangeParams {
    name: string;
    value: boolean;
    stringValue?: string;
}

export interface ICssClasses {
    title: string;
    input: string;
    cradle: string;
    label: string;
}

export interface ITogglerProps extends ITogglerBaseProps {
    cssClasses?: ICssClasses;
    titleBefore?: boolean;
}

export class Toggler extends React.PureComponent<ITogglerProps, never> {
    public static defaultProps = {
        cssClasses: {
            input: 'sonm-toggler__input',
            label: 'sonm-toggler',
            cradle: 'sonm-toggler__cradle',
            title: 'sonm-toggler__title',
        },
    };

    public render() {
        const {
            className,
            name,
            groupName,
            value,
            title,
            titleBefore,
            disabled,
            cssClasses = Toggler.defaultProps.cssClasses,
        } = this.props;

        const content = [
            <input
                key="a"
                disabled={disabled}
                name={groupName || name}
                type={groupName ? 'radio' : 'checkbox'}
                className={cssClasses.input}
                checked={value}
                onChange={this.handleChange}
            />,
            <div className={cssClasses.cradle} key="b" />,
        ];

        if (title) {
            const titleBlock = (
                <div key="t" className={cssClasses.title}>
                    {title}
                </div>
            );

            if (titleBefore) {
                content.unshift(titleBlock);
            } else {
                content.push(titleBlock);
            }
        }

        const css = cn(
            className,
            cssClasses.label,
            disabled ? `${cssClasses.label}--disabled` : null,
        );
        return <label className={css}>{content}</label>;
    }

    protected handleChange = (event: any) => {
        const p = this.props;
        const value = event.target.checked;

        if (p.onChange !== undefined) {
            p.onChange({
                value,
                name: p.name,
                stringValue: value ? 'enable' : 'disable',
            });
        }
    };
}

export default Toggler;
