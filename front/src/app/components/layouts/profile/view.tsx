import * as React from 'react';
import * as cn from 'classnames';
import { TFnGetUiText } from 'app/components/common/localized-pure-component';
import { Details, IProfileDefinition } from './sub/details';
import { Statistic } from './sub/statistic';
// import { KYC } from './sub/kyc';
import { ICertificateProps } from './sub/certificate';
// import { CertificatesPanel } from './sub/certificates-panel';
import { Panel } from 'app/components/common/panel';
import { EnumProfileStatus } from 'app/api/types';
import { Button } from 'app/components/common/button';

interface IProps {
    className?: string;
    getUiText: TFnGetUiText<any>;
    definitionList: IProfileDefinition[];
    certificates: ICertificateProps[];
    description: string;
    consumerDeals: string;
    consumerAvgTime: string;
    consumerToken: string;
    supplierDeals: string;
    supplierAvgTime: string;
    supplierToken: string;
    my: boolean;
    userName?: string;
    countryAbCode2?: string;
    logoUrl?: string;
    userStatus: EnumProfileStatus;
    address: string;
    style?: any;
    onNavigateToOrders: (address: string) => void;

    onClickKYC: () => void;
    onCloseKYC: () => void;
    showDialogKYC: boolean;
}

export class ProfileView extends React.PureComponent<IProps, never> {
    protected handleClickOrders = () => {
        this.props.onNavigateToOrders(this.props.address);
    };

    public render() {
        const p = this.props;

        return (
            <div className={cn('sonm-profile', p.className)} style={p.style}>
                <div className="sonm-profile__column">
                    <Details
                        userName={p.userName}
                        countryAbCode2={p.countryAbCode2}
                        logoUrl={p.logoUrl}
                        className="sonm-profile__panel"
                        status={p.userStatus}
                        address={p.address}
                        getUiText={p.getUiText}
                        definitions={p.definitionList}
                    />
                    {p.description ? (
                        <Panel
                            key="desc"
                            className="sonm-profile__panel"
                            title="Description"
                        >
                            {p.description}
                        </Panel>
                    ) : null}
                </div>
                <div className="sonm-profile__column">
                    {/* {p.showDialogKYC ? (
                        ToDo GUI-179 remove
                        <KYC onClose={p.onCloseKYC} address={p.address} />
                    ) : null} */}
                    {p.description ? (
                        <Panel
                            key="desc"
                            className="sonm-profile__panel"
                            title="Description"
                        >
                            {p.description}
                        </Panel>
                    ) : null}
                    {p.my ? (
                        <Button
                            className="sonm-profile__kyc"
                            onClick={p.onClickKYC}
                        >
                            Pass certification
                        </Button>
                    ) : null}
                    {/*<CertificatesPanel*/}
                    {/*className="sonm-profile__panel"*/}
                    {/*certificates={p.certificates}*/}
                    {/*my={p.my}*/}
                    {/*/>*/}
                    <Statistic
                        className="sonm-profile__panel"
                        consumerDeals={p.consumerDeals}
                        consumerAvgTime={p.consumerAvgTime}
                        consumerToken={p.consumerToken}
                        supplierDeals={p.supplierDeals}
                        supplierAvgTime={p.supplierAvgTime}
                        supplierToken={p.supplierToken}
                        getUiText={p.getUiText}
                    />
                    <Button
                        className="sonm-profile__orders"
                        onClick={this.handleClickOrders}
                    >
                        Go to orders
                    </Button>
                </div>
            </div>
        );
    }
}

export default ProfileView;
