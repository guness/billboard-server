import React from 'react';
import {Upload, Icon, message} from 'antd';
import {connect} from 'dva';

const Dragger = Upload.Dragger;

class FileUpload extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadProps: {
                name: 'file',
                multiple: true,
                showUploadList: false,
                action: '//jsonplaceholder.typicode.com/posts/',
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

        this.props.dispatch({type: 'mediaModel/create', payload: fd});
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

export default connect(({mediaModel}) => ({mediaModel}))(FileUpload);