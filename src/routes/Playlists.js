import React from 'react';
import {connect} from 'dva';
import {Row, Col, Table, Popconfirm, Icon, Button, Tabs} from 'antd';
const TabPane = Tabs.TabPane;
import { Link } from 'react-router-dom';
import moment from 'moment';
import GroupModal from '../components/GroupModal';
import FileUpload from '../components/FileUpload';
import {toTitleCase} from '../utils';

class DeleteButton extends React.Component {

    handleConfirm = ev => this.props.onConfirm(this.props.item.id);

    render(){
        return (<Popconfirm
            title="Are you sure you want to delete this?"
            onConfirm={this.handleConfirm}
            okText="Yes"
            cancelText="No">
            <Button type="danger" icon="delete">Delete</Button>
        </Popconfirm>)
    };
}

class Playlists extends React.Component {

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
                    title: 'Preview',
                    dataIndex: 'path',
                    key: 'path',
                    render: (text) => <img src={text}/>,
                },
                {
                    title: 'Name',
                    dataIndex: 'name',
                    key: 'name',
                    width: 150,
                }, {
                    title: 'Type',
                    key: 'mediaType',
                    dataIndex: 'mediaType',
                    render: (text) => <span>{toTitleCase(text)}</span>,
                }, {
                    title: 'Duration',
                    key: 'duration',
                    dataIndex: 'duration',
                    render: (text) =>{
                        let duration = moment.duration(text, 'seconds');
                        let durationText = text ? `${duration.minutes()}:${duration.seconds()}` : '-';
                        return <span>{durationText}</span>
                    },
                }, {
                    title: 'Operations',
                    key: 'x',
                    dataIndex: '',
                    render: (text, record) => (
                        (record.id !== null) && (<DeleteButton item={record} onConfirm={this.handleMediaDelete} />)
                    ),
                }],
        };

        this.handleAddGroupClick = this.handleAddGroupClick.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleMediaDelete = this.handleMediaDelete.bind(this);
    }

    handleAddGroupClick() {
        this.setState({
            groupModalVisible: true,
        });
    }

    handleMediaDelete(mediaId) {
        this.props.dispatch({type: 'mediaModel/delete', payload: {mediaId}});
    }

    handleModalClose() {
        this.setState({
            groupModalVisible: false,
        });
    }

    render() {
        const {mediaModel, groupModel, playlistModel, relationModel} = this.props;
        const {medias} = mediaModel;
        const {groups} = groupModel;
        const {playlists} = playlistModel;
        const playlistMediaRelations = relationModel.playlistMedia;
        const operations = <Button type="primary" onClick={this.handleAddGroupClick}>
            <Icon type="plus"/> Add Playlist
        </Button>;

        const mediaObj = medias.reduce((p, c) => {
            p[c.id] = c;
            return p;
        }, {});

        /*const formattedGroups = groups.map((group, i) => {
            let groupedDevices = medias.filter(device => device.groupId === group.id);
            let onlineDevices = groupedDevices.filter(device => device.status === 'ONLINE');
            let groupedPlaylists = playlists.filter(playlist => playlist.groupId === group.id);
            return {
                ...group,
                index: i + 1,
                groupedDevices,
                onlineDevices,
                groupedPlaylists,
            }
        });*/

        return (
            <div>
                <Row>
                    <Col span={18}>
                        <h1>Playlists</h1>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <GroupModal isVisible={this.state.groupModalVisible} onClose={this.handleModalClose}/>

                        <Tabs
                            tabBarExtraContent={operations}>
                            {
                                playlists.map((playlist)=>{
                                    let playlistMedias = playlistMediaRelations
                                        .filter(pmr => pmr.playlistId === playlist.id)
                                        .map((pmr, i) => ({...(mediaObj[pmr.mediaId]), index: i+1}));

                                    return (<TabPane tab={playlist.name} key={playlist.id}>
                                        <Table rowKey="id" {...this.state.tableOptions} columns={this.state.columns} dataSource={playlistMedias}/>
                                        <FileUpload/>
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


export default connect(({mediaModel, playlistModel, groupModel, relationModel}) => ({mediaModel, playlistModel, groupModel, relationModel}))(Playlists);