import React from 'react';
import {connect} from 'dva';
import {Modal, Input} from 'antd';
import PropTypes from 'prop-types';


class GroupModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            groupModalContent: '',
        };

        this.handleModalOk = this.handleModalOk.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.handleGroupModalChange = this.handleGroupModalChange.bind(this);
    }

    handleGroupModalChange(e){
        this.setState({
            groupModalContent: e.target.value,
        })
    }

    handleModalOk(){
        this.props.dispatch({type: 'groupModel/addGroup', payload: {name: this.state.groupModalContent}});
        this.handleCloseModal();
    }

    handleCloseModal(){
        this.setState({
            groupModalContent: '',
        });

        this.props.onClose();
    }

    render(){
        return (
            <Modal
                title="New Group"
                visible={this.props.isVisible}
                onOk={this.handleModalOk}
                onCancel={this.handleCloseModal}
                cancelText={'Cancel'}
                okText={'OK'}
            >
                <h5>Group Name</h5>
                <Input size="large" placeholder="" autoFocus value={this.state.groupModalContent} onChange={this.handleGroupModalChange} />
            </Modal>
        );
    }
}

GroupModal.propTypes = {
    onClose: PropTypes.func,
    isVisible: PropTypes.bool,
};

export default connect(({groupModel}) => ({groupModel}))(GroupModal);