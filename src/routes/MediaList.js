import React from 'react';
import {connect} from 'dva';
import {Row, Col, Tabs, Card} from 'antd';
const TabPane = Tabs.TabPane;

import FileUpload from '../components/FileUpload';
import MediaCard from '../components/MediaCard';
import {imageRegex} from '../utils/config';

class MediaList extends React.Component{

    constructor(props){
        super(props);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleDelete(id){
        this.props.dispatch({type: 'mediaModel/remove', payload: {id}});
    }

    render(){
        const {mediaModel, playlistModel} = this.props;

        const {medias} = mediaModel;
        const imageMedias = medias.filter(media => imageRegex.test(media.mimeType));
        const videoMedias = medias.filter(media => !imageRegex.test(media.mimeType));
        const {playlists} = playlistModel;

        return (
            <div>
                <Row>
                    <Col span={24}>
                        <h1>Media List</h1>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <FileUpload/>
                    </Col>
                </Row>

                <Row>
                    <Col span={24}>
                        <Tabs>
                            <TabPane tab="All Media" key={null}>
                                {medias.map(media => <MediaCard key={media.id} media={media} onDelete={this.handleDelete}/>)}
                            </TabPane>
                            <TabPane tab="Image" key="image">
                                {imageMedias.map(media => <MediaCard key={media.id} media={media} onDelete={this.handleDelete}/>)}
                            </TabPane>
                            <TabPane tab="Video" key="video">
                                {videoMedias.map(media => <MediaCard key={media.id} media={media} onDelete={this.handleDelete}/>)}
                            </TabPane>

                        </Tabs>

                    </Col>
                </Row>

            </div>
        );
    }
}


export default connect(({mediaModel, playlistModel}) => ({mediaModel, playlistModel}))(MediaList);