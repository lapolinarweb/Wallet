import * as React from 'react';
import { IKycListItemProps } from './types';
import ProfileStatus from 'app/components/common/profile-status';
import Balance from 'app/components/common/balance-view';
import * as cn from 'classnames';
import { ConfirmationPanel } from 'app/components/common/confirmation-panel';
import { KycLinkPanel } from '../kyc-link-panel';
import Button from 'app/components/common/button';

export class KycListItem extends React.Component<IKycListItemProps, never> {
    constructor(props: IKycListItemProps) {
        super(props);
    }

    protected static imgPrefix = 'data:image/png;base64,';

    protected handleClickSelect = () => {
        this.props.onClick(this.props.index);
    };

    protected handleSubmitPassword = (password: string) => {
        this.props.onSubmitPassword(this.props.index, password);
    };

    protected handleCancelPassword = () => {
        this.props.onCancelPassword(this.props.index);
    };

    protected handleCloseLink = () => {
        this.props.onCloseLink(this.props.index);
    };

    protected handleBackClick = (
        event: React.MouseEvent<HTMLButtonElement>,
    ) => {
        event.stopPropagation();
        this.props.onCloseLink(this.props.index);
    };

    public render() {
        const p = this.props;
        const v = p.validator;
        return (
            <div
                className={cn('kyc-list-item', p.className, {
                    'kyc-list-item--selected': this.props.isSelected,
                })}
                onClick={this.handleClickSelect}
            >
                <img
                    className="kyc-list-item__icon"
                    src={KycListItem.imgPrefix + v.logo}
                />
                <h3 className="kyc-list-item__title">{v.name}</h3>
                <div className="kyc-list-item__descr">{v.description}</div>

                <div className="kyc-list-item__status">
                    <div className="kyc-list-item__label">
                        Identification level
                    </div>
                    <ProfileStatus status={v.level} />
                </div>

                <div className="kyc-list-item__price">
                    <div className="kyc-list-item__label">Price</div>
                    <Balance
                        balance={v.fee}
                        decimalPointOffset={18}
                        symbol="SNM"
                    />
                </div>

                {p.isSelected ? (
                    p.kycLink !== undefined ? (
                        <KycLinkPanel
                            className="kyc-list-item__bottom"
                            value={(v.url || '') + '/' + (p.kycLink || '')}
                            onClose={this.handleCloseLink}
                        />
                    ) : p.isBuyingAvailable ? (
                        <ConfirmationPanel
                            className="kyc-list-item__bottom"
                            showCloseButton
                            labelHeader="Please, enter account password."
                            labelDescription=""
                            onSubmit={this.handleSubmitPassword}
                            onCancel={this.handleCancelPassword}
                            validationMessage={p.validationMessage}
                        />
                    ) : (
                        <div className="kyc-insuficcient-funds kyc-list-item__bottom">
                            <h4 className="kyc-insuficcient-funds__header">
                                Insufficient funds for KYC
                            </h4>
                            <div className="insuficcient-funds__message">
                                Choose another KYC service or replenish your
                                deposit
                            </div>
                            <Button
                                color="violet"
                                className="kyc-insuficcient-funds__button-deposit"
                                onClick={this.props.onNavigateDeposit}
                            >
                                DEPOSIT
                            </Button>
                            <Button
                                color="violet"
                                transparent
                                className="kyc-insuficcient-funds__button-back"
                                onClick={this.handleBackClick}
                            >
                                BACK
                            </Button>
                        </div>
                    )
                ) : null}
            </div>
        );
    }
}
