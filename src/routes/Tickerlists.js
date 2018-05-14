import React from 'react';
import {connect} from 'dva';
import {Row, Col, Icon, Button, Tabs} from 'antd';

const TabPane = Tabs.TabPane;
import ListModal from '../components/ListModal';
import ListDisplayForm from '../components/ListDisplayForm';
import TickerlistTable from "../components/TickerlistTable";
import {sortItems} from "../utils";
import styles from './Tickerlists.less'
import TickerModal from "../components/TickerModal";

@connect(({mediaModel, tickerlistModel, groupModel, relationModel, loading: {effects}}) => ({
    mediaModel,
    tickerlistModel,
    groupModel,
    relationModel,
    effects
}))
class Tickerlists extends React.PureComponent {

    state = {
        tickerlistModalVisible: false,
        tickerModalVisible: false,
        tickerlistId: 0,
        tickerId: undefined
    };

    handleAddTickerlistClick = () => {
        this.setState({
            tickerlistModalVisible: true,
        });
    };

    handleAddTickerClick = tickerlistId => {
        this.setState({
            tickerModalVisible: true,
            tickerlistId,
            tickerId: undefined
        });
    };

    handleEditTickerClick = ({id: tickerId, tickerlistId}) => {
            this.setState({
            tickerModalVisible: true,
            tickerlistId,
            tickerId,
        });
    };


    handleTickerlistModalClose = () => {
        this.setState({
            tickerlistModalVisible: false,
        });
    };

    handleTickerModalClose = () => {
        this.setState({
            tickerModalVisible: false,
        });
    };


    handleTickerRemove = id => {
        this.props.dispatch({type: 'tickerlistModel/removeSingle', payload: {id}});
    };


    handleOrderChange = (tickerlistId, itemOrder) => {
        this.props.dispatch({type: 'tickerlistModel/update', payload: {id: tickerlistId, itemOrder}})
    };

    render() {
        const {groupModel, tickerlistModel, effects} = this.props;
        const {groups} = groupModel;
        const {tickerlists, tickers} = tickerlistModel;

        const operations = <Button type="primary" onClick={this.handleAddTickerlistClick}>
            <Icon type="plus"/> Add Caption List
        </Button>;


        return (
            <div>
                <Row>
                    <Col span={18}>
                        <h1>Caption Lists</h1>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>

                        <ListModal
                            type="tickerlist"
                            isVisible={this.state.tickerlistModalVisible}
                            onClose={this.handleTickerlistModalClose}
                        />
                        <TickerModal
                            isVisible={this.state.tickerModalVisible}
                            onClose={this.handleTickerModalClose}
                            tickerlistId={this.state.tickerlistId}
                            id={this.state.tickerId}
                        />

                        <Tabs
                            tabBarExtraContent={operations}>
                            {
                                tickerlists.map((tickerlist) => {
                                    let filteredTickers = tickers
                                        .filter(ticker => ticker.tickerlistId === tickerlist.id);
                                    let sortedTickers = sortItems(filteredTickers, tickerlist.itemOrder);

                                    let group = groups.find(group => group.id === tickerlist.groupId);

                                    return (<TabPane tab={tickerlist.name} key={tickerlist.id}>
                                        <h3>Caption List Info</h3>
                                        <ListDisplayForm list={tickerlist} group={group} type="tickerlist"/>
                                        <Row>
                                            <Col span={18}>
                                                <h3>Caption List</h3>
                                            </Col>
                                            <Col span={6} className={styles.addButtonContainer}>
                                                <Button type="primary"
                                                        onClick={() => this.handleAddTickerClick(tickerlist.id)}>
                                                    <Icon type="plus"/> Add Caption
                                                </Button>
                                            </Col>
                                        </Row>

                                        <TickerlistTable
                                            tickers={sortedTickers}
                                            onTickerRemove={this.handleTickerRemove}
                                            onOrderChange={itemOrder => this.handleOrderChange(tickerlist.id, itemOrder)}
                                            loading={effects['tickerlistModel/update']}
                                            onEditClick={this.handleEditTickerClick}
                                        />

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


export default Tickerlists;