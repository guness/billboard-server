import React from 'react';
import {connect} from 'dva';
import {Modal, Form} from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

import PlaylistForm from './PlaylistForm';

class PlaylistModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {

        };

        this.handleModalOk = this.handleModalOk.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.playlistFormRef = this.playlistFormRef.bind(this);
    }



    handleModalOk(){
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const {name, repeated, groupId, timeRange, startBlock, endBlock} = values;
            let payload = {
                name,
                repeated,
                groupId,
                startDate: timeRange[0].format('YYYY-MM-DD HH:mm:ss'),
                endDate: timeRange[1].format('YYYY-MM-DD HH:mm:ss'),
                startBlock: startBlock.diff(moment().startOf('day'), 'minutes'),
                endBlock: endBlock.diff(moment().startOf('day'), 'minutes'),
            };
            form.resetFields();

            if(this.props.id){
                payload.id = this.props.id;
                this.props.dispatch({type: 'playlistModel/update', payload});
            }else{
                this.props.dispatch({type: 'playlistModel/create', payload});
            }

            this.handleCloseModal();
        });
    }

    handleCloseModal(){
        this.props.onClose();
    }

    playlistFormRef(form){
        this.form = form;
    }

    render(){

        return (
            <Modal
                title={this.props.id ? 'Update Playlist' : 'New Playlist'}
                visible={this.props.isVisible}
                onOk={this.handleModalOk}
                onCancel={this.handleCloseModal}
                cancelText={'Cancel'}
                okText={'OK'}
            >
                <PlaylistForm id={this.props.id} ref={this.playlistFormRef}/>
            </Modal>
        );
    }
}


PlaylistModal.propTypes = {
    onClose: PropTypes.func,
    isVisible: PropTypes.bool,
    id: PropTypes.number
};

export default connect(({playlistModel}) => ({playlistModel}))(PlaylistModal);