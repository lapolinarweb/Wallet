import * as React from 'react';
import { Spin } from 'antd';
import * as cn from 'classnames';
import { Button } from 'app/components/common/button';
import { Api } from 'app/api';
import { IValidation } from 'ipc/types';
import { BlackSelect } from 'app/components/common/black-select';

interface IProps {
    className?: string;
    onLogin: () => void;
}

class BlackWalletSelect extends BlackSelect<string> {}

type TAction = 'select-wallet' | 'create-new' | 'enter-password';

export class Login extends React.Component<IProps, any> {
    public state = {
        currentAction: ('select-wallet' as TAction),
        password: '',
        newName: '',
        newPassword: '',
        confirmation: '',
        wallets: ([] as string[]),
        name: '',
        pending: false,
        error: '',

        validation: ({} as IValidation),
    };

    protected getWalletList = async () =>  {
        this.setState({ pending: true });

        const { data } = await Api.getWalletList();
        const wallets = data as string[];

        let name = '';
        const savedName = window.localStorage.getItem('sonm-last-used-wallet');

        if (savedName && wallets.indexOf(savedName) !== -1) {
            name = savedName;
        } else if (wallets.length > 0) {
            name = wallets[0];
        }

        const update: any = {
            pending: false,
            wallets,
            name,
        };

        if (wallets.length === 1) {
            update.name = wallets[0];
            update.currentAction = 'enter-password';
        }

        if (wallets.length === 0) {
            update.currentAction = 'create-new';
        }

        this.setState(update);
    }

    public componentWillMount() {
        this.getWalletList();
    }

    protected handleRequireNewWallet = () => {
        this.setState({ creating: true });
    }

    protected handleStartLogin = (event: any) => {
        event.preventDefault();

        this.setState({
            currentAction: 'enter-password',
        });
    }

    protected handleLogin = async (event: any) => {
        event.preventDefault();

        try {
            const { validation, data: success } = await Api.setSecretKey(this.state.password, this.state.name);

            if (validation) {
                this.setState({ validation });
            }

            if (success) {
                this.props.onLogin();
            }

        } catch (e) {
            this.setState({ error: String(e) });
        }
    }

    protected handleCreateNew = async (event: any) => {
        event.preventDefault();

        let invalid = false;

        if (this.state.wallets.indexOf(this.state.name) !== -1) {
            this.setState({ validation: { newName: 'Already exist' } });
            invalid = true;
        }

        if (this.state.password !== this.state.confirmation) {
            this.setState({ validation: { confirmation: 'Passwords !==' } });
            invalid = true;
        }

        if (!invalid) {
            this.setState({
                pending: true,
            });

            try {
                const { validation } = await Api.setSecretKey(this.state.password, this.state.name);

                if (validation) {
                    this.setState({ validation });
                } else {
                    this.props.onLogin();
                }

            } catch (e) {

                this.setState({
                    pending: false,
                    error: String(e),
                });
            }
        }
    }

    protected static setFocus(ref: any) {
        ref && ref.focus();
    }

    protected handleChangeInput = (event: any) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    protected handleChangeWallet = (params: any) => {
        this.setState({ name: params.value });

        window.localStorage.setItem('sonm-last-used-wallet', params.value);
    }

    protected handleReturn = (event: any) => {
        event.preventDefault();

        this.setState({ currentAction: 'select-wallet', validation: {} });
    }

    protected renderSelect() {
        return (
            <form className="sonm-login__wallet-form" onSubmit={this.handleStartLogin}>
                <BlackWalletSelect
                    className="sonm-login__wallet-select"
                    name="name"
                    onChange={this.handleChangeWallet}
                    value={this.state.name}
                    options={this.state.wallets}
                />
                <Button
                    height={50}
                    square
                    className="sonm-login__wallet-login"
                    onClick={this.handleStartLogin}
                    type="submit"
                >
                    Login
                </Button>
            </form>
        );
    }

    protected renderLoginPopup() {
        if (this.state.currentAction !== 'enter-password') {
            return null;
        }

        return (
            <div className="sonm-login__popup">
                <form className="sonm-login__popup-inner" onSubmit={this.handleLogin}>
                    {this.renderCross()}
                    <h3 className="sonm-login__popup-header">Enter password</h3>
                    <label className="sonm-login__label">
                        <span className="sonm-login__label-text">Password</span>
                        <span className="sonm-login__label-error">{this.state.validation.password}</span>
                        <input
                            type="password"
                            className="sonm-login__input"
                            name="password"
                            onChange={this.handleChangeInput}
                        />
                    </label>
                    <Button
                        className="sonm-login__create"
                        type="submit"
                    >
                        Login
                    </Button>
                </form>
            </div>
        );
    }

    protected renderNewWalletPopup() {
        if (this.state.currentAction !== 'create-new') {
            return null;
        }

        return (
            <div className="sonm-login__popup">
                <form className="sonm-login__popup-inner" onSubmit={this.handleCreateNew}>
                    {this.renderCross()}
                    <h3 className="sonm-login__popup-header">New wallet</h3>
                    <label className="sonm-login__label">
                        <span className="sonm-login__label-text">Wallet name</span>
                        <span className="sonm-login__label-error">{this.state.validation.newName}</span>
                        <input
                            type="text"
                            className="sonm-login__input"
                            name="newName"
                            onChange={this.handleChangeInput}
                        />
                    </label>
                    <label className="sonm-login__label">
                        <span className="sonm-login__label-text">Password</span>
                        <span className="sonm-login__label-error">{this.state.validation.newPassword}</span>
                        <input
                            type="password"
                            className="sonm-login__input"
                            name="newPassword"
                            onChange={this.handleChangeInput}
                        />
                    </label>
                    <label className="sonm-login__label">
                        <span className="sonm-login__label-text">Password confirmation</span>
                        <span className="sonm-login__label-error">{this.state.validation.confirmation}</span>
                        <input
                            type="password"
                            className="sonm-login__input"
                            name="confirmation"
                            onChange={this.handleChangeInput}
                        />
                    </label>
                    <Button
                        className="sonm-login__create"
                        type="submit"
                    >
                        Create
                    </Button>
                </form>
            </div>
        );
    }

    protected renderCross() {
        return <button type="button" className="sonm-login__popup-cross" onClick={this.handleReturn}>+</button>;
    }

    public render() {
        const {
            className,
        } = this.props;

        return (
            <Spin spinning={this.state.pending} className="sonm-login__spin">
                <div className={cn('sonm-login', className)}>
                    <div className="sonm-login__errors">
                        {this.state.error}
                    </div>
                    <div
                        className={cn(
                            'sonm-login__center', {
                            'sonm-login__center--inactive': this.state.currentAction !== 'select-wallet',
                        })}
                    >
                        {this.renderSelect()}
                    </div>
                    {this.renderNewWalletPopup()}
                    {this.renderLoginPopup()}
                </div>
            </Spin>
        );
    }
}
