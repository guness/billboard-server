import React from 'react';
import PropTypes from 'prop-types';
import {Upload, Icon, message} from 'antd';
import {connect} from 'dva';
import { allowedImageFormats, allowedVideoFormats } from '../constants';

const Dragger = Upload.Dragger;

class FileUpload extends React.Component {
    constructor(props) {
        super(props);

        const accept = allowedImageFormats.map( ait => `image/${ait}`)
            .concat(allowedVideoFormats.map(avt => `video/${avt}`))
            .join(',');

        this.state = {
            uploadProps: {
                name: 'file',
                multiple: true,
                showUploadList: false,
                accept,
                action: '',
                onChange(info) {
                    const status = info.file.status;
                    if (status !== 'uploading') {
                        console.log(info.file, info.fileList);
                    }
                    if (status === 'done') {
                        message.success(`${info.file.name} file uploaded successfully.`);
                    } else if (status === 'error') {
                        message.error(`${info.file.name} file upload failed.`);
                    }
                },
            },
        };
        this.handleUploadFile = this.handleUploadFile.bind(this);
    }

    handleUploadFile(info) {
        let file = info.file;
        let fd = new FormData();
        fd.append('file', file);

        const playlist = this.props.playlist;

        if(playlist){
            this.props.dispatch({type: 'mediaModel/createAndAddPlaylist', payload: {media: fd, playlistId: playlist.id}});
        }else{
            this.props.dispatch({type: 'mediaModel/create', payload: fd});
        }
    }

    render() {
        return (<div style={{marginTop: 16, height: 180}}>
            <Dragger {...this.state.uploadProps} customRequest={this.handleUploadFile}>
                <p className="ant-upload-drag-icon">
                    <Icon type="inbox"/>
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading
                    company data or other band files</p>
            </Dragger>
        </div>)
    }
}

FileUpload.propTypes = {
    playlist: PropTypes.object,
};

export default connect(({mediaModel, relationModel}) => ({mediaModel, relationModel}))(FileUpload);