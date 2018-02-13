import React from 'react';
import { Table, Popconfirm, Button } from 'antd'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import moment from 'moment';
import MediaPreview from '../components/MediaPreview';
import { toTitleCase } from '../utils';
import PropTypes from 'prop-types';
import styles from './PlaylistMediaTable.less';


function dragDirection(dragIndex,
                       hoverIndex,
                       initialClientOffset,
                       clientOffset,
                       sourceClientOffset,) {
    const hoverMiddleY = (initialClientOffset.y - sourceClientOffset.y) / 2;
    const hoverClientY = clientOffset.y - sourceClientOffset.y;
    if (dragIndex < hoverIndex && hoverClientY > hoverMiddleY) {
        return 'downward';
    }
    if (dragIndex > hoverIndex && hoverClientY < hoverMiddleY) {
        return 'upward';
    }
}

let BodyRow = (props) => {
    const {
        isOver,
        connectDragSource,
        connectDropTarget,
        dragRow,
        moveRow,
        clientOffset,
        sourceClientOffset,
        initialClientOffset,
        ...restProps
    } = props;
    const style = { ...restProps.style, cursor: 'move' };

    let className = restProps.className;
    if (isOver && initialClientOffset) {
        const direction = dragDirection(
            dragRow.index,
            restProps.index,
            initialClientOffset,
            clientOffset,
            sourceClientOffset
        );
        if (direction === 'downward') {
            className += ' ' + styles.dropOverDownward;
        }
        if (direction === 'upward') {
            className += ' ' + styles.dropOverUpward;
        }
    }

    return connectDragSource(
        connectDropTarget(
            <tr
                {...restProps}
                className={className}
                style={style}
            />
        )
    );
};

const rowSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return;
        }

        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRow)
);

class DeleteButton extends React.PureComponent {

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

@DragDropContext(HTML5Backend)
export default class PlaylistMediaTable extends React.Component {
    static propTypes = {
        onMediaRemove: PropTypes.func.isRequired,
        playlistMedias: PropTypes.array.isRequired,
        onOrderChange: PropTypes.func,
        loading: PropTypes.bool
    };

    state = {
        data: [],
        tableOptions: {
            loading: false,
            size: 'default',
            showHeader: true,
            scroll: undefined,
        },
        columns: [
            {
                title: '#',
                key: 'index',
                render: (text, media, i) => <span>{i + 1}</span>,
                width: 80,
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

    constructor(props) {
        super(props);
        this.state.data = props.playlistMedias;
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.loading) {
            this.setState({ data: nextProps.playlistMedias });
        }
    }

    components = {
        body: {
            row: BodyRow,
        },
    };

    moveRow = (dragIndex, hoverIndex) => {
        const { data } = this.state;
        const dragRow = data[dragIndex];

        this.setState(
            update(this.state, {
                data: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            }),
            () => {
                this.props.onOrderChange(JSON.stringify(this.state.data.map(({ id }) => id)));
            }
        );
    };

    render() {
        const { loading } = this.props;
        const { tableOptions, columns, data } = this.state;
        return (
            <Table rowKey="id"
                   {...tableOptions}
                   columns={columns}
                   dataSource={data}
                   components={this.components}
                   loading={loading}
                   onRow={(record, index) => ({
                       index,
                       moveRow: this.moveRow,
                   })}
            />)
    }
}