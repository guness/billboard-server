import React from 'react';
import {connect} from 'dva';
import {Row, Col, Table, Popconfirm, Icon, Button, Tabs} from 'antd';
const TabPane = Tabs.TabPane;
import moment from 'moment';
import PlaylistModal from '../components/PlaylistModal';
import FileUpload from '../components/FileUpload';
import PlaylistDisplayForm from '../components/PlaylistDisplayForm';
import {toTitleCase} from '../utils';

class DeleteButton extends React.Component {

    handleConfirm = ev => this.props.onConfirm(this.props.item.id);

    render(){
        return (<Popconfirm
            title="Are you sure you want to remove this media?"
            onConfirm={this.handleConfirm}
            okText="Yes"
            cancelText="No">
            <Button type="danger" icon="delete">Remove Media</Button>
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
                    key: 'mimeType',
                    dataIndex: 'mimeType',
                    render: (text) => <span>{toTitleCase(text)}</span>,
                }, {
                    title: 'Duration',
                    key: 'duration',
                    dataIndex: 'duration',
                    render: (text) =>{
                        let duration = moment.duration(text, 'milliseconds');
                        let durationText = text ? duration.minutes() + ':' + duration.seconds() : '-';
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

        this.handleAddPlaylistClick = this.handleAddPlaylistClick.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleMediaDelete = this.handleMediaDelete.bind(this);
    }

    handleAddPlaylistClick() {
        this.setState({
            playlistModalVisible: true,
        });
    }

    handleMediaDelete(mediaId) {
        this.props.dispatch({type: 'mediaModel/delete', payload: {mediaId}});
    }

    handleModalClose() {
        this.setState({
            playlistModalVisible: false,
        });
    }

    render() {
        const {mediaModel, groupModel, playlistModel, relationModel} = this.props;
        const {medias} = mediaModel;
        const {groups} = groupModel;
        const {playlists} = playlistModel;
        const playlistMediaRelations = relationModel.playlistMedias;
        const operations = <Button type="primary" onClick={this.handleAddPlaylistClick}>
            <Icon type="plus"/> Add Playlist
        </Button>;

        const mediaObj = medias.reduce((p, c) => {
            p[c.id] = c;
            return p;
        }, {});

        return (
            <div>
                <Row>
                    <Col span={18}>
                        <h1>Playlists</h1>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>

                        <PlaylistModal isVisible={this.state.playlistModalVisible} onClose={this.handleModalClose}/>

                        <Tabs
                            tabBarExtraContent={operations}>
                            {
                                playlists.map((playlist)=>{
                                    let playlistMedias = playlistMediaRelations
                                        .filter(pmr => pmr.playlistId === playlist.id)
                                        .map((pmr, i) => ({...(mediaObj[pmr.mediaId]), index: i+1}));
                                    let group = groups.find(group => group.id === playlist.groupId);

                                    return (<TabPane tab={playlist.name} key={playlist.id}>
                                        <h3>Playlist Info</h3>
                                        <PlaylistDisplayForm playlist={playlist} group={group}/>

                                        <h3>Media List</h3>
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