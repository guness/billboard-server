import React from 'react';
import {connect} from 'dva';
import {Row, Col, Table, Popconfirm, Icon, Button, Tabs} from 'antd';
const TabPane = Tabs.TabPane;
import PlaylistModal from '../components/PlaylistModal';
import FileUpload from '../components/FileUpload';
import PlaylistDisplayForm from '../components/PlaylistDisplayForm';
import SelectableMediaCard from '../components/SelectableMediaCard';
import PlaylistMediaTable from '../components/PlaylistMediaTable';

class Playlists extends React.Component {

    constructor() {
        super();
        this.state = {

        };

        this.handleAddPlaylistClick = this.handleAddPlaylistClick.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleMediaRemove = this.handleMediaRemove.bind(this);
        this.handleMediaClick = this.handleMediaClick.bind(this);
    }

    handleAddPlaylistClick() {
        this.setState({
            playlistModalVisible: true,
        });
    }


    handleModalClose() {
        this.setState({
            playlistModalVisible: false,
        });
    }

    handleMediaClick(mediaId, oldValue, playlistId){
        if (oldValue) {
            this.handleMediaRemove(mediaId, playlistId);
        } else {
            let payload = {mediaId, playlistId};
            this.props.dispatch({type: 'relationModel/create', payload});
        }
    }

    handleMediaRemove(mediaId, playlistId) {
        let playlistMedia = this.props.relationModel.playlistMedias.find(pm => pm.mediaId === mediaId && pm.playlistId === playlistId);
        if (playlistMedia) {
            this.props.dispatch({type: 'relationModel/remove', payload: {id: playlistMedia.id}});
        }
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
                                        .map((pmr, i) => ({
                                            ...(mediaObj[pmr.mediaId]),
                                            index: i+1,
                                            playlistId: playlist.id
                                        }));
                                    let group = groups.find(group => group.id === playlist.groupId);

                                    return (<TabPane tab={playlist.name} key={playlist.id}>
                                        <h3>Playlist Info</h3>
                                        <PlaylistDisplayForm playlist={playlist} group={group}/>

                                        <h3>Media List</h3>
                                        <PlaylistMediaTable playlistMedias={playlistMedias} onMediaRemove={this.handleMediaRemove}/>

                                        <h3>Add Media</h3>

                                        <Tabs type="card" >
                                            <TabPane tab="Upload" key="upload">
                                                <h4>Upload</h4>
                                                <FileUpload playlist={playlist}/>
                                            </TabPane>
                                            <TabPane tab="Choose Existing" key="existing">
                                                <h4>Choose Existing</h4>
                                                <div style={{marginTop: 15}}>
                                                    {medias.map(media => {
                                                        const selected = !!playlistMedias.find(playlistMedia => playlistMedia.id === media.id);
                                                        return <SelectableMediaCard
                                                            onClick={this.handleMediaClick}
                                                            key={media.id}
                                                            selected={selected}
                                                            media={media}
                                                            playlist={playlist}
                                                        />
                                                    })}
                                                </div>
                                            </TabPane>
                                        </Tabs>
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