import React from 'react';
import PropTypes from 'prop-types';
import {Icon, Button, Form, Popconfirm} from 'antd';
const FormItem = Form.Item;
import moment from 'moment';
import styles from './PlaylistDisplayForm.less';
import PlaylistModal from './PlaylistModal';
import {connect} from 'dva';

class PlaylistDisplayForm extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            formItemLayout: null,
            playlistModalVisible: false,
        };

        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleUpdatePlaylistClick = this.handleUpdatePlaylistClick.bind(this);
        this.handleConfirm = this.handleConfirm.bind(this);
    }

    handleUpdatePlaylistClick() {
        this.setState({
            playlistModalVisible: true,
        });
    }

    handleModalClose() {
        this.setState({
            playlistModalVisible: false,
        });
    }

    handleConfirm(){
        this.props.dispatch({type: 'playlistModel/remove', payload: {id: this.props.playlist.id}})
    }

    render(){
        let {playlist, group} = this.props;
        return (
            <Form layout="inline" className={styles.playlistForm}>
                <PlaylistModal id={playlist.id} isVisible={this.state.playlistModalVisible} onClose={this.handleModalClose}/>

                <FormItem
                    {...this.state.formItemLayout}
                    label="Group">
                    <strong className="ant-form-text">{(group && group.name) || 'No Group Assigned'}</strong>
                </FormItem>
                <FormItem
                    {...this.state.formItemLayout}
                    label="Start Date">
                    <strong className="ant-form-text">{moment(playlist.startDate).format('L')}</strong>
                </FormItem>
                <FormItem
                    {...this.state.formItemLayout}
                    label="End Date">
                    <strong
                        className="ant-form-text">{moment(playlist.endDate).format('L')}</strong>
                </FormItem>
                {!!playlist.repeated && (
                    <FormItem
                        {...this.state.formItemLayout}
                        label="Start Hour">
                        <strong className="ant-form-text">{moment().startOf('day').add(playlist.startBlock, 'minutes').format('HH:mm')}</strong>
                    </FormItem>)}
                {!!playlist.repeated && (
                    <FormItem
                        {...this.state.formItemLayout}
                        label="End Hour">
                        <strong className="ant-form-text">{moment().startOf('day').add(playlist.endBlock, 'minutes').format('HH:mm')}</strong>
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
                        title="Are you sure you want to remove this playlist?)"
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

PlaylistDisplayForm.propTypes = {
    playlist: PropTypes.object,
    group: PropTypes.object,
};

export default connect(({playlistModel}) => (playlistModel))(PlaylistDisplayForm);