import React from 'react';
import {connect} from 'dva';
import {Row, Col, Form, Input, Button, Spin} from 'antd';

const FormItem = Form.Item;

import DeviceStatus from '../components/DeviceStatus';
import DeviceLastOnline from '../components/DeviceLastOnline';

class Device extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
        };

        this.handleSetButton = this.handleSetButton.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    componentWillMount() {
        const {dispatch, match: {params: {shortId}}} = this.props;
        dispatch({type: 'deviceModel/querySingle', payload: {shortId}});
    }

    nameConfig() {
        return {
            rules: [{
                message: 'Please input device name',
            }],
            initialValue: this.props.deviceModel.currentDevice.name,
        };
    }

    handleSetButton() {
        if (this.props.user) {
            let {id} = this.props.user.owners[0];
            this.updateDevice({ownerId: id})
        } else {
            console.error('user is not defined');
        }
    }

    handleNameChange(event) {
        this.updateDevice({name: event.target.value})
    }

    updateDevice(payload) {
        const {dispatch} = this.props;
        dispatch({type: 'deviceModel/updateSingle', payload});
    }

    handleEnterKeyPress(event) {
        if (event.which === 13) {
            event.target.blur();
        }
        return false;
    }

    render() {
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };

        const {getFieldDecorator} = this.props.form;

        const {loading, deviceModel: {currentDevice}} = this.props;
        const deviceLoading = loading.effects['deviceModel/querySingle'];
        const deviceUpdating = loading.effects['deviceModel/updateSingle'];

        return (
            <div>
                <Row>
                    <Col span={24}>
                        <h1>Device</h1>
                    </Col>
                </Row>
                <Spin spinning={deviceLoading}>
                    {currentDevice && (<Row>
                        <Col span={24}>
                            <Form onSubmit={this.handleSubmit}>
                                <FormItem {...formItemLayout} label="Device Name">
                                    {getFieldDecorator('name', this.nameConfig())(<Input size="large"
                                                                                         placeholder=""
                                                                                         disabled={deviceUpdating}
                                                                                         onKeyPress={this.handleEnterKeyPress}
                                                                                         onBlur={this.handleNameChange}/>)}
                                </FormItem>

                                <FormItem {...formItemLayout} label="Device Owner">
                                <span className="ant-form-text">
                                    <Button type="primary"
                                            loading={currentDevice.ownerId === null && deviceUpdating}
                                            disabled={currentDevice.ownerId !== null}
                                            onClick={this.handleSetButton}> {currentDevice.ownerId === null ? 'Set to me' : 'Already Set'} </Button>
                                </span>
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="Device Model"
                                >
                                    <span className="ant-form-text">{currentDevice.device}</span>

                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="Device Status"
                                >
                                    <span className="ant-form-text"> <DeviceStatus
                                        status={currentDevice.status}/> </span>
                                </FormItem>


                                <FormItem
                                    {...formItemLayout}
                                    label="Last Online"
                                >
                                    <span className="ant-form-text"> <DeviceLastOnline record={currentDevice}/> </span>
                                </FormItem>

                                <FormItem
                                    {...formItemLayout}
                                    label="OS Version"
                                >
                                    <span className="ant-form-text"> {currentDevice.osVersion}</span>
                                </FormItem>

                            </Form>

                        </Col>
                    </Row>)}
                </Spin>
            </div>
        )
    }
};

const connectedDevice = connect(({loading, deviceModel, userModel}) =>
    ({loading, deviceModel, user: userModel.user}))(Device);

export default Form.create()(connectedDevice);