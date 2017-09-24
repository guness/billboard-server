import React from 'react';
import {Row, Col, Table, Badge, Icon, Button, Tabs} from 'antd';
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

const data = [];
for (let i = 1; i <= 10; i++) {
    data.push({
        key: i,
        name: 'Samsung ...',
        status: ['ONLINE', 'OFFLINE'][i % 2],
        lastOnline: moment().subtract(1, 'hour').add(Math.round(Math.random() * 60), 'minutes').valueOf(),
        osVersion: 1,
        appVersion: 1,
    });
}

const state = {
    loading: false,
    size: 'default',
    showHeader: true,
    rowSelection: {},
    scroll: undefined,
};

const operations = <Button type="primary"><Icon type="plus"/> Add Group</Button>;


function DeviceList(props) {
    return (
        <div>
            <Row>
                <Col span={24}>
                    <h1>Device List</h1>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Tabs
                        onChange={callback}
                        type="editable-card">
                        <TabPane tab="Tab 1" key="1">
                            <Table {...state} columns={columns} dataSource={data}/>
                        </TabPane>
                        <TabPane tab="Tab 2" key="2">Content of Tab Pane 2</TabPane>
                        <TabPane tab="Tab 3" key="3">Content of Tab Pane 3</TabPane>
                    </Tabs>

                </Col>
            </Row>

        </div>
    );
}


export default DeviceList;