import React from 'react';
import {connect} from 'dva';
import {Modal } from 'antd';
import PropTypes from 'prop-types';
import moment from 'moment';

import ListForm from './ListForm';

@connect(() => ({}))
class ListModal extends React.Component {

    static propTypes = {
        onClose: PropTypes.func,
        isVisible: PropTypes.bool,
        id: PropTypes.number,
        type: PropTypes.oneOf(['playlist', 'tickerlist']).isRequired
    };

    handleModalOk = () => {
        const {onClose, type, id, dispatch} = this.props;
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }

            const { name, repeated, groupId, timeRange, startBlock, endBlock, fontSize, color, speed } = values;
            let payload = {
                name,
                repeated,
                groupId,
                startDate: timeRange[0].format('YYYY-MM-DD HH:mm:ss'),
                endDate: timeRange[1].format('YYYY-MM-DD HH:mm:ss'),
                startBlock: startBlock.diff(moment().startOf('day'), 'minutes'),
                endBlock: endBlock.diff(moment().startOf('day'), 'minutes'),
            };

            if (type === 'tickerlist') {
                payload = {
                    ...payload,
                    fontSize,
                    color: color.replace('#', '').toUpperCase(),
                    speed
                }
            }

            form.resetFields();

            if(id){
                payload.id = this.props.id;
                dispatch({type: `${type}Model/update`, payload});
            }else{
                dispatch({type: `${type}Model/create`, payload});
            }

            onClose();
        });
    };

    formRef = form =>{
        this.form = form;
    };

    render(){
        const {id, isVisible, type, onClose} = this.props;

        const title = type === 'playlist' ? 'Playlist' : 'Caption List';

        return (
            <Modal
                title={id ? `Update ${title}` : `New ${title}`}
                visible={isVisible}
                onOk={this.handleModalOk}
                onCancel={onClose}
                cancelText={'Cancel'}
                okText={'OK'}
                width={600}
            >
                <ListForm id={id} ref={this.formRef} type={type}/>
            </Modal>
        );
    }
}

export default ListModal;