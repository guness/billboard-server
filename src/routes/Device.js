import React from 'react';
import {connect} from 'dva';
import {Row, Col, Form, Input, Button} from 'antd';

const FormItem = Form.Item;

import DeviceStatus from '../components/DeviceStatus';

class Device extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            name: '',
        };

        this.handleSetButton = this.handleSetButton.bind(this);
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
        let {id} = this.props.currentOwner;
        this.updateDevice({ownerId: id})
    }

    updateDevice(payload) {
        const {dispatch} = this.props;
        dispatch({type: 'deviceModel/updateSingle', payload});
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
                        {deviceLoading && <span>Loading</span>}
                    </Col>
                </Row>
                {currentDevice && (<Row>
                    <Col span={24}>
                        <Form onSubmit={this.handleSubmit}>
                            <FormItem {...formItemLayout} label="Device Name">
                                {getFieldDecorator('name', this.nameConfig())(<Input size="large"
                                                                                     placeholder=""
                                                                                     autoFocus
                                                                                     onChange={this.handleNameChange}/>)}
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
                                <span className="ant-form-text"> <DeviceStatus status={currentDevice.status}/> </span>

                            </FormItem>

                            <FormItem
                                {...formItemLayout}
                                label="Device Owner"
                            >
                                <span className="ant-form-text">
                                    <Button type="primary"
                                            loading={deviceUpdating}
                                            disabled={currentDevice.ownerId !== null}
                                            onClick={this.handleSetButton}> {currentDevice.ownerId === null ? 'Set to me' : 'Already Set'} </Button>
                                </span>

                            </FormItem>
                        </Form>

                    </Col>
                </Row>)}
            </div>
        )
    }
};

const connectedDevice = connect(({loading, deviceModel, userModel}) =>
    ({loading, deviceModel, currentOwner: userModel.user.owners[0]}))(Device);

export default Form.create()(connectedDevice);