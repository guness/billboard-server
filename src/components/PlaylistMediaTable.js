import React from 'react';
import {Table, Popconfirm, Button} from 'antd'
import moment from 'moment';
import MediaPreview from '../components/MediaPreview';
import {toTitleCase} from '../utils';
import PropTypes from 'prop-types';
import styles from './PlaylistMediaTable.less';

class DeleteButton extends React.Component {

    handleConfirm = ev => this.props.onConfirm(this.props.media.id, this.props.media.playlistId);

    render() {
        return (<Popconfirm
            title="Are you sure you want to remove this media?"
            onConfirm={this.handleConfirm}
            okText="Yes"
            cancelText="No">
            <Button type="danger" icon="delete">Remove Media</Button>
        </Popconfirm>)
    };
}


class PlaylistMediaTable extends React.Component {
    state = {
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
                key: 'url',
                render: (media) => (<div className={styles.previewWrapper}>
                    <MediaPreview media={media} controls={false}/>
                </div>),
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
                render: (text) => {
                    let duration = moment.duration(text, 'milliseconds');
                    let durationText = text ? duration.minutes() + ':' + duration.seconds() : '-';
                    return <span>{durationText}</span>
                },
            }, {
                title: 'Operations',
                key: 'x',
                dataIndex: '',
                render: (text, media) => (
                    (media.id !== null) && (<DeleteButton media={media} onConfirm={this.props.onMediaRemove}/>)
                ),
            }],
    };

    render() {
        let {playlistMedias} = this.props;
        return (
            <Table rowKey="id" {...this.state.tableOptions} columns={this.state.columns} dataSource={playlistMedias}/>)
    }

    static propTypes = {
        onMediaRemove: PropTypes.func,
        playlistMedias: PropTypes.array,
    }
}

export default PlaylistMediaTable;