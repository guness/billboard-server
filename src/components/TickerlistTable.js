import React, {PureComponent} from 'react'
import {Table, Popconfirm, Button} from 'antd'
import {DragDropContext} from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import PropTypes from "prop-types";
import moment from "moment/moment";

import {toTitleCase} from '../utils';
import update from "immutability-helper/index";
import {BodyRow} from "./DraggableRow";

class DeleteButton extends React.PureComponent {

    handleConfirm = ev => this.props.onConfirm(this.props.ticker.id);

    render() {
        return (<Popconfirm
            title="Are you sure you want to remove this item?"
            onConfirm={this.handleConfirm}
            okText="Yes"
            cancelText="No">
            <Button type="danger" icon="delete">Remove</Button>
        </Popconfirm>)
    };
}

@DragDropContext(HTML5Backend)
class TickerlistTable extends PureComponent {
    static propTypes = {
        onTickerRemove: PropTypes.func.isRequired,
        onEditClick: PropTypes.func.isRequired,
        tickers: PropTypes.array.isRequired,
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
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: 150,
            },
            {
                title: 'Text',
                key: 'content',
                dataIndex: 'content',
            },
            {
                title: 'Type',
                key: 'type',
                dataIndex: 'type',
                render: type => <span>{toTitleCase(type)}</span>,
            }, {
                title: 'Operations',
                key: 'x',
                dataIndex: '',
                render: (text, ticker) => (
                    (ticker.id !== null) && (<span>
                        <Button onClick={() => this.handleEditClick(ticker)}>Edit</Button>
                        &nbsp;
                        <DeleteButton ticker={ticker} onConfirm={this.props.onTickerRemove}/>
                    </span>)
                ),
            }],
    };

    constructor(props) {
        super(props);
        this.state.data = props.tickers;
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps.loading) {
            this.setState({ data: nextProps.tickers });
        }
    }

    components = {
        body: {
            row: BodyRow,
        },
    };

    handleEditClick = ticker => {
        this.props.onEditClick(ticker);
    };

    moveRow = (dragIndex, hoverIndex) => {
        const {data} = this.state;
        const dragRow = data[dragIndex];

        this.setState(
            update(this.state, {
                data: {
                    $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
                },
            }),
            () => {
                this.props.onOrderChange(JSON.stringify(this.state.data.map(({id}) => id)));
            }
        );
    };

    render() {
        const {loading} = this.props;
        const {tableOptions, columns, data} = this.state;
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

export default TickerlistTable;