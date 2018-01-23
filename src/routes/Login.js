import React from 'react';
import {connect} from 'dva';

import {Form, Icon, Input, Button} from 'antd';
import styles from './Login.less';
import logo from '../assets/logo.png';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const {dispatch} = this.props;
                dispatch({type: 'userModel/login', payload: values});
            }
        });
    };

    render() {
        const {form, loading} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div className={styles.loginFormRoot}>
                <div className={styles.loginFormWrapper}>
                    <Form onSubmit={this.handleSubmit} className={styles.loginForm} style={{backgroundImage: 'url(../assets/logo.png)'}}>
                        <img src={logo} alt=""/>
                        <hr/>
                        <h1 className={styles.loginFormTitle}>Management Panel</h1>

                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{required: true, message: 'Please input your username!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="Username"/>,
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: 'Please input your Password!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password"
                                       placeholder="Password"/>,
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" loading={loading} htmlType="submit" className={styles.loginFormButton}>
                                Log in
                            </Button>
                        </FormItem>
                    </Form>
                </div>
                <footer className={styles.footer}>
                    <small> &copy; {(new Date()).getFullYear()} Plusboard. All rights reserved </small>
                </footer>
            </div>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default connect(({userModel, loading}) => ({
    userModel,
    loading: loading.effects['userModel/login'],
}))(WrappedNormalLoginForm);