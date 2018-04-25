import React from 'react';
import { connect } from 'dva';
import { Row, Col, Table, Popconfirm, Icon, Button, Tabs, Tag } from 'antd';
import { Link } from 'react-router-dom'
import moment from 'moment';
import { toTitleCase } from '../utils';
import GroupDropdown from '../components/GroupDropdown';
import GroupModal from '../components/GroupModal';
import GroupPlaylistModal from '../components/GroupPlaylistModal';

const TabPane = Tabs.TabPane;

class DeleteButton extends React.Component {

    handleConfirm = ev => this.props.onConfirm(this.props.group.id);

    render() {
        return (<Popconfirm
            title="Are you sure you want to delete this group?"
            onConfirm={this.handleConfirm}
            okText="Yes"
            cancelText="No">
            <Button type="danger" icon="delete">Delete</Button>
        </Popconfirm>)
    };
}

class Groups extends React.Component {

    constructor() {
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
                }, {
                    title: 'Online Devices',
                    key: 'onlineDevices',
                    render: (record) => <Link
                        to="/device-list">{record.onlineDevices.length}/{record.groupedDevices.length}</Link>,
                }, {
                    title: 'Playlists',
                    key: 'playlists',
                    render: (record) => (<div>
                        <Button type="info" icon="edit"
                                onClick={() => this.handleEditClick(record)}>Edit</Button> &nbsp;
                        {record.groupedPlaylists.map(({ id, name }) => <Tag color="blue"
                                                                            key={id}>{name}</Tag>)}

                    </div>),
                }, {
                    title: 'Operations',
                    key: 'x',
                    dataIndex: '',
                    render: (text, record) => (
                        (record.id !== null) && (<DeleteButton group={record} onConfirm={this.handleGroupDelete}/>)
                    ),
                }],
            isGroupModalVisible: false,
            isPlaylistModalVisible: false,
            playlistModalData: null
        };

        this.handleAddGroupClick = this.handleAddGroupClick.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleGroupDelete = this.handleGroupDelete.bind(this);
    }

    handleAddGroupClick() {
        this.setState({
            isGroupModalVisible: true,
        });
    }

    handleGroupDelete(id) {
        this.props.dispatch({ type: 'groupModel/remove', payload: { id } });
    }

    handleModalClose() {
        this.setState({
            isGroupModalVisible: false,
        });
    }

    handleEditClick = record => {
        this.setState({
            isPlaylistModalVisible: true,
            playlistModalData: record
        });
    };

    handlePlaylistModalClose = () => {
        this.setState({
            isPlaylistModalVisible: false,
        });
    };

    render() {
        const { deviceModel, groupModel, playlistModel } = this.props;
        const { devices } = deviceModel;
        const { groups } = groupModel;
        const { playlists } = playlistModel;

        const { tableOptions, columns, isGroupModalVisible, isPlaylistModalVisible, playlistModalData } = this.state;

        const operations = <Button type="primary" onClick={this.handleAddGroupClick}>
            <Icon type="plus"/> Add Group
        </Button>;

        const formattedGroups = groups.map((group, i) => {
            let groupedDevices = devices.filter(device => device.groupId === group.id);
            let onlineDevices = groupedDevices.filter(device => device.status === 'ONLINE');
            let groupedPlaylists = playlists.filter(playlist => playlist.groupId === group.id);
            return {
                ...group,
                index: i + 1,
                groupedDevices,
                onlineDevices,
                groupedPlaylists,
            }
        });


        return (
            <div>
                <GroupPlaylistModal
                    isVisible={isPlaylistModalVisible}
                    onClose={this.handlePlaylistModalClose}
                    group={playlistModalData}
                />
                <Row>
                    <Col span={18}>
                        <h1>Groups</h1>
                    </Col>
                    <Col span={4}>{operations}</Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <GroupModal isVisible={isGroupModalVisible} onClose={this.handleModalClose}/>

                        <Table rowKey="id" {...tableOptions} columns={columns}
                               dataSource={formattedGroups}/>
                    </Col>
                </Row>

            </div>
        );
    }
}


export default connect(({ deviceModel, playlistModel, groupModel }) => ({
    deviceModel,
    playlistModel,
    groupModel
}))(Groups);