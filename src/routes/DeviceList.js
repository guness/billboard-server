import React from 'react';
import {connect} from 'dva';
import {Link} from 'react-router-dom';
import {Row, Col, Table, Badge, Icon, Button, Tabs} from 'antd';
const TabPane = Tabs.TabPane;
import GroupDropdown from '../components/GroupDropdown';
import GroupModal from '../components/GroupModal';
import DeviceStatus from '../components/DeviceStatus';
import DeviceLastOnline from '../components/DeviceLastOnline';


class DeviceList extends React.Component {

    constructor(){
        super();
        this.state = {
            tableOptions: {
                loading: false,
                size: 'default',
                showHeader: true,
                scroll: undefined,
            },
            columns: [
                {
                    title: '#',
                    dataIndex: 'index',
                    key: 'index',
                    width: 40,
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    width: 150,
                    render: (text, record) => <Link to={`device/${record.firebaseId.substr(0,4)}${record.firebaseId.substr(-2)}`}>{text}</Link>
                }, {
                    title: 'Status',
                    key: 'state',
                    dataIndex: 'status',
                    render: text => <DeviceStatus status={text}/>,
                },
                {
                    title: 'Last Online',
                    key: 'lastOnline',
                    dataIndex: 'lastOnline',
                    render: (text, record) => <DeviceLastOnline record={record}/>,
                }, {
                    title: 'OS Version',
                    key: 'osVersion',
                    dataIndex: 'osVersion',
                }, {
                    title: 'Assign/Change Group',
                    key: 'x',
                    dataIndex: '',
                    render: (text, record) => (
                        <GroupDropdown currentGroupId={record.groupId} onGroupSelect={(group) => {
                            this.handleGroupSelect(group, record)
                        }}/>
                    ),
                }],
        };

        this.handleAddGroupClick = this.handleAddGroupClick.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);

        this.handleGroupSelect = this.handleGroupSelect.bind(this);
    }

    handleGroupSelect(groupId, {id}){
        this.props.dispatch({type: 'deviceModel/update', payload: {deviceId: id, groupId}})
    }

    handleAddGroupClick(){
        this.setState({
            groupModalVisible: true,
        });
    }

    handleModalClose(){
        this.setState({
            groupModalVisible: false,
        });
    }

    render(){
        const {deviceModel, groupModel} = this.props;
        const {devices} = deviceModel;
        const {groups} = groupModel;
        const operations = <Button type="primary" onClick={this.handleAddGroupClick}><Icon type="plus"/> Add Group</Button>;
        const allDevices =  devices.map((device, i) => ({...device, index: i+1}));

        return (
            <div>
                <Row>
                    <Col span={24}>
                        <h1>Device List</h1>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <GroupModal isVisible={this.state.groupModalVisible} onClose={this.handleModalClose}/>
                        <Tabs
                            tabBarExtraContent={operations}>
                            {
                                <TabPane tab="All Devices" key={null}>
                                    <Table rowKey="id" {...this.state.tableOptions} columns={this.state.columns} dataSource={allDevices}/>
                                </TabPane>
                            }
                            {
                                groups.map((group)=>{
                                    let groupedDevices = devices
                                        .filter((device)=> device.groupId === group.id )
                                        .map((device, i) => ({...device, index: i+1}));

                                    return (<TabPane tab={group.name} key={group.id}>
                                        <Table rowKey="id" {...this.state.tableOptions} columns={this.state.columns} dataSource={groupedDevices}/>
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


export default connect(({deviceModel, groupModel}) => ({deviceModel, groupModel}))(DeviceList);