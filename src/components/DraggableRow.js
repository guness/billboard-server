import React from 'react';
import {DragSource, DropTarget} from "react-dnd";
import styles from './DraggableRow.less';

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

const BodyRowSource = (props) => {
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
    const style = {...restProps.style, cursor: 'move'};

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

export const rowSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    },
};

export const rowTarget = {
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

export const BodyRow = DropTarget('row', rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource('row', rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRowSource)
);