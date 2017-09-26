import React from 'react';
import {connect} from 'dva';
import {Row, Col, Table, Badge, Icon, Button, Tabs, Modal, Input} from 'antd';
import moment from 'moment';
import {toTitleCase} from '../utils';


const TabPane = Tabs.TabPane;

function callback(key) {
    console.log(key);
}

const columns = [
    {
        title: '#',
        dataIndex: 'key',
        key: 'key',
        width: 40,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: 150,
    }, {
        title: 'Status',
        key: 'state',
        dataIndex: 'status',
        render: (text) => <span><Badge status={text === 'ONLINE' ? 'success' : 'default'}/>{toTitleCase(text)}</span>,
    },
    {
        title: 'Last Online',
        key: 'lastOnline',
        dataIndex: 'lastOnline',
        render: (text, record) => <span>{moment(text).fromNow()}</span>,
    }, {
        title: 'OS Version',
        key: 'osVersion',
        dataIndex: 'osVersion',
    }, {
        title: 'Assign/Change Group',
        key: 'x',
        dataIndex: '',
        render: (text, record) => (
            <span>
              <a href="#" className="ant-dropdown-link">
                Group 1 <Icon type="down"/>
              </a>
            </span>
        ),
    }];

const state = {
    loading: false,
    size: 'default',
    showHeader: true,
    scroll: undefined,
};

class DeviceList extends React.Component {
    constructor(){
        super();
        this.state = {
            modalVisible: false,
        };

        this.handleAddGroupClick = this.handleAddGroupClick.bind(this);
        this.handleModalOk = this.handleModalOk.bind(this);
        this.handleModalCancel = this.handleModalCancel.bind(this);
    }

    handleAddGroupClick(){
        this.setState({
            modalVisible: true,
        });
    }

    handleModalOk(){
        this.setState({
            modalVisible: false,
        });
    }

    handleModalCancel(){
        this.setState({
            modalVisible: false,
        });
    }

    render(){
        const {device, group} = this.props;
        const {devices} = device;
        const {groups} = group;
        const operations = <Button type="primary" onClick={this.handleAddGroupClick}><Icon type="plus"/> Add Group</Button>;

        return (
            <div>
                <Row>
                    <Col span={24}>
                        <h1>Device List</h1>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Modal
                            title="New Group"
                            visible={this.state.modalVisible}
                            onOk={this.handleModalOk}
                            onCancel={this.handleModalCancel}
                            cancelText={'Cancel'}
                            okText={'OK'}
                        >
                            <h5>Group Name</h5>
                            <Input size="large" placeholder="" autofocus />
                        </Modal>
                        <Tabs
                            tabBarExtraContent={operations}>
                            {
                                groups.map((group)=>{
                                    let groupedDevices = devices.filter((device)=> device.groupId === group.id );
                                    return (<TabPane tab={group.name} key={group.id}>
                                        <Table rowKey="id" {...state} columns={columns} dataSource={groupedDevices}/>
                                    </TabPane>);
                                })
                            }
                        </Tabs>

                    </Col>
                </Row>

            </div>
        );
    }

}


export default connect(({device, group}) => ({device, group}))(DeviceList);