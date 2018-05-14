import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Button, Form, Popconfirm} from 'antd';
const FormItem = Form.Item;
import moment from 'moment';
import styles from './ListDisplayForm.less';
import ListModal from './ListModal';
import {connect} from 'dva';

@connect(({playlistModel}) => (playlistModel))
class ListDisplayForm extends React.Component{

    static propTypes = {
        list: PropTypes.object.isRequired,
        group: PropTypes.object,
        type: PropTypes.oneOf(['playlist', 'tickerlist'])
    };

    state = {
        formItemLayout: null,
        listModalVisible: false,
    };

    handleUpdatePlaylistClick = () => {
        this.setState({
            listModalVisible: true,
        });
    };

    handleModalClose = () => {
        this.setState({
            listModalVisible: false,
        });
    };

    handleConfirm = () => {
        const {dispatch, type, list} = this.props;
        dispatch({type: `${type}Model/remove`, payload: {id: list.id}})
    };

    render(){
        let {list, type, group} = this.props;
        return (
            <Form layout="inline" className={styles.listForm}>
                <ListModal
                    id={list.id}
                    isVisible={this.state.listModalVisible}
                    onClose={this.handleModalClose}
                    type={type}
                />

                <FormItem
                    {...this.state.formItemLayout}
                    label="Group">
                    <strong className="ant-form-text">{(group && group.name) || 'No Group Assigned'}</strong>
                </FormItem>
                <FormItem
                    {...this.state.formItemLayout}
                    label="Start Date">
                    <strong className="ant-form-text">{moment(list.startDate).format('L')}</strong>
                </FormItem>
                <FormItem
                    {...this.state.formItemLayout}
                    label="End Date">
                    <strong
                        className="ant-form-text">{moment(list.endDate).format('L')}</strong>
                </FormItem>
                {!!list.repeated && (
                    <FormItem
                        {...this.state.formItemLayout}
                        label="Start Hour">
                        <strong className="ant-form-text">{moment().startOf('day').add(list.startBlock, 'minutes').format('HH:mm')}</strong>
                    </FormItem>)}
                {!!list.repeated && (
                    <FormItem
                        {...this.state.formItemLayout}
                        label="End Hour">
                        <strong className="ant-form-text">{moment().startOf('day').add(list.endBlock, 'minutes').format('HH:mm')}</strong>
                    </FormItem>)}

                <FormItem
                    {...this.state.formItemLayout}>
                    <Button onClick={this.handleUpdatePlaylistClick}>
                        <Icon type="edit" /> Edit
                    </Button>
                </FormItem>
                <FormItem
                    {...this.state.formItemLayout}>
                    <Popconfirm
                        title="Are you sure you want to remove this list?"
                        onConfirm={this.handleConfirm}
                        okText="Yes"
                        cancelText="No">
                        <Button type="danger">
                            <Icon type="delete"/> Delete
                        </Button>
                    </Popconfirm>
                </FormItem>
            </Form>
        )
    }
}

export default ListDisplayForm;