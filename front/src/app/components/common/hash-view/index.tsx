import * as React from 'react';

const LAST_SYMBOL_AMOUNT = 6;

interface IBalanceViewProps {
    className?: string;
    fontSizePx?: number;
    hash: string;
    prefix?: string;
    hasCopyButton?: boolean;
}

import * as cn from 'classnames';

export class Hash extends React.PureComponent<IBalanceViewProps, any> {

    protected static copyInput = createInput();

    protected handleClickCopy = (event: any) => {
        event.preventDefault();
        event.stopPropagation();

        Hash.copyInput.value = this.props.hash;
        Hash.copyInput.select();
        document.execCommand('Copy');
    }

    public render() {
        const { className, fontSizePx, hash, prefix, hasCopyButton } = this.props;

        const hash0x =  hash.startsWith('0x') ? hash : '0x' + hash;

        const len = hash0x.length;
        let start = hash0x;
        let end = '';

        if (len > LAST_SYMBOL_AMOUNT) {
            start = hash0x.slice(0, len - LAST_SYMBOL_AMOUNT);
            end = hash0x.slice(len - LAST_SYMBOL_AMOUNT);
        }

        const style = fontSizePx
            ? { fontSize: `${fontSizePx}px` }
            : undefined;

        const showCopyButton = hasCopyButton && 1;

        return (
            <div
                className={cn('sonm-hash', className)}
                style={style}
            >
                <span className="sonm-hash__start">
                    {prefix} {start}
                </span>
                <span className="sonm-hash__end">
                    {end}
                    {showCopyButton
                        ? <button className="sonm-hash__copy" onClickCapture={this.handleClickCopy} />
                        : null
                    }
                </span>
            </div>
        );
    }
}

function createInput() {
    const copyInput: HTMLInputElement = document.createElement('input');

    copyInput.style.position = 'fixed';
    copyInput.style.left = '-1000px';
    copyInput.style.top = '0';

    document.addEventListener('DOMContentLoaded', () => {
        document.body.appendChild(copyInput);
    });

    return copyInput;
}

export default Hash;
