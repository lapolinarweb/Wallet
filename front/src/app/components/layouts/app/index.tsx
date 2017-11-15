import * as React from 'react';
import { Menu, Alert } from 'antd';
import { ClickParam } from 'antd/lib/menu/';
import * as cn from 'classnames';
import { inject, observer } from 'mobx-react';
import { navigate } from '../../../../app/router';

interface IProps {
    className?: string;
    children: any;
    error: string;
    selectedNavMenuItem: string;
    userStore: {
        totalEthereumBalance: string;
        totalSonmBalance: string;
    };
}

@inject('userStore')
@observer
export class App extends React.Component<IProps, any> {

    public handleMenuClick(param: ClickParam) {
        navigate({path: param.key});
    }

    public render() {
        const {
            className,
            error,
            selectedNavMenuItem,
            children,
            userStore: {
                totalEthereumBalance,
                totalSonmBalance,
            },
        } = this.props;

        return (
            <div className={cn('sonm-app', className)}>
                {
                    error
                        ? <Alert message={error} className="sonm_app__alert"/>
                        : null
                }
                <div className="sonm_app__nav">
                    <div className="sonm_nav">
                        <div className="sonm_nav__logo"/>
                        <Menu
                            onClick={this.handleMenuClick}
                            className="sonm-nav__menu"
                            selectedKeys={[selectedNavMenuItem]}
                            theme="dark"
                            mode="horizontal"
                            style={{
                                borderColor: 'transparent',
                            }}
                        >
                            <Menu.Item key="/wallets" className="sonm-nav__menu-item">
                                Wallet
                            </Menu.Item>
                            <Menu.Item key="/send" className="sonm-nav__menu-item">
                                Send
                            </Menu.Item>
                            <Menu.Item key="/history" className="sonm-nav__menu-item">
                                History
                            </Menu.Item>
                            <Menu.Item key="/votes" className="sonm-nav__menu-item">
                                Votes
                            </Menu.Item>
                        </Menu>
                        <div className="sonm_nav__total">
                            <div className="sonm_nav__total-eth">
                                {totalEthereumBalance}
                            </div>
                            <div className="sonm_nav__total-sonm">
                                {totalSonmBalance}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sonm_app__content">
                    {children}
                </div>
            </div>
        );
    }
}