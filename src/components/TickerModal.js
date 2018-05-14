import React from 'react';
import { Modal, message, Button } from 'antd';
import {connect} from "dva";
import PropTypes from 'prop-types';
import { validate } from '../services/tickerlist';

import TickerForm from "./TickerForm";

@connect(_ => ({}))
class TickerModal extends React.Component {

    static propTypes = {
        onClose: PropTypes.func,
        isVisible: PropTypes.bool,
        id: PropTypes.number,
        tickerlistId: PropTypes.number.isRequired
    };

    state = {
        loading: false
    };

    setLoading = loading => {
        this.setState({
            loading
        });
    };

    handleModalOk = () => {
        this.setLoading(true)
        const {onClose, id, tickerlistId, dispatch} = this.props;
        const form = this.form;
        form.validateFields(async (err, values) => {
            if (err) {
                return this.setLoading(false);
            }

            const {name, content, isRss} = values;

            if(isRss){
                try {
                    const response = await validate(content);
                    if(!response.success){
                        this.setLoading(false);
                        message.error('We cannot reach this url, please check again.')
                        return this.setLoading(false);
                    }
                }catch (e){
                    return this.setLoading(false);
                }
            }

            this.setLoading(false);

            let payload = {
                name,
                content,
                type: isRss ? 'RSS' : 'TEXT',
                tickerlistId
            };
            form.resetFields();

            if(id) {
                payload.id = id;
                dispatch({type: 'tickerlistModel/updateSingle', payload});
            } else{
                dispatch({type: 'tickerlistModel/createSingle', payload});
            }

            onClose();
        });
    };

    formRef = form =>{
        this.form = form;
    };

    render(){
        const {id, isVisible, type, onClose} = this.props;

        return (
            <Modal
                title={id ? 'Update Caption' : 'New Caption'}
                visible={isVisible}
                footer={[
                    <Button key="Cancel" onClick={onClose}>Cancel</Button>,
                    <Button key="Ok" type="primary" loading={this.state.loading} onClick={this.handleModalOk}>Ok</Button>,
                ]}
            >
                <TickerForm id={id} ref={this.formRef} type={type}/>
            </Modal>
        );
    }
}

export default TickerModal;