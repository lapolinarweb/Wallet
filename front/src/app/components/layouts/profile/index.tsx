import * as React from 'react';
import { ProfileView } from './view';
import { Api } from 'app/api';
import { IProfileFull, EnumProfileStatus } from 'app/api/types';
import { rootStore } from '../../../stores';

interface IProps {
    className?: string;
    address: string;
    onNavigateToOrders: (address: string) => void;
    onNavigateToKyc: () => void;
}

interface IState {
    profile: IProfileFull;
    showDialogKYC: boolean;
}

const returnFirstArg = (...as: any[]) => String(as[0]);

export class Profile extends React.PureComponent<IProps, IState> {
    protected static readonly emptyProfile: IProfileFull = {
        attributes: [],
        name: '',
        address: '0x1',
        status: EnumProfileStatus.anonimest,
        sellOrders: 0,
        buyOrders: 0,
        deals: 0,
        country: '',
        logoUrl: '',
        description: '',
    };

    public state = {
        profile: Profile.emptyProfile,
        showDialogKYC: false,
    };

    public componentDidMount() {
        this.fetchData();
    }

    protected async fetchData() {
        const profile = await Api.profile.fetchByAddress(this.props.address);

        this.setState({
            profile,
        });
    }

    protected handleClickKYC = async () => {
        // ToDo GUI-179
        this.props.onNavigateToKyc();
        // this.setState({
        //     showDialogKYC: true,
        // });
    };

    protected handleCloseKYC = () => {
        this.setState({
            showDialogKYC: false,
        });
    };

    public render() {
        const props = this.props;
        const profile = this.state.profile;

        return (
            <ProfileView
                getUiText={returnFirstArg}
                className={props.className}
                definitionList={profile.attributes}
                certificates={[]}
                description={profile.description}
                consumerDeals="0"
                consumerAvgTime="1"
                consumerToken="2"
                supplierDeals="3"
                supplierAvgTime="4"
                supplierToken="5"
                my={
                    props.address.toLowerCase() ===
                    rootStore.marketStore.marketAccountAddress.toLowerCase()
                }
                userName={profile.name}
                countryAbCode2={profile.country}
                logoUrl={profile.logoUrl}
                userStatus={profile.status || 0}
                address={profile.address}
                onNavigateToOrders={props.onNavigateToOrders}
                showDialogKYC={this.state.showDialogKYC}
                onClickKYC={this.handleClickKYC}
                onCloseKYC={this.handleCloseKYC}
            />
        );
    }
}

export default Profile;
