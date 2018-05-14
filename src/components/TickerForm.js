import React from 'react';
import {connect} from 'dva';

import moment from 'moment';
import {Input, Form, Checkbox } from 'antd';
import PropTypes from "prop-types";

const FormItem = Form.Item;

const initialState = {
    name: '',
    content: '',
    type: 'TEXT',
    id: 0
};

@Form.create()
@connect(({tickerlistModel, groupModel}) =>
    ({tickerlistModel, groupModel}))
class TickerForm extends React.Component {

    static propTypes = {
        id: PropTypes.number
    };

    state = {...initialState};

    constructor(props) {
        super(props);
        const { tickerlistModel: {tickers}, id } = props;

        let ticker;

        if (id) {
            ticker = tickers.find(ticker => ticker.id === id);
        }

        if(ticker){
            const { name, content, type } = ticker;
            this.state = {name, content, type };
        }
    }

    componentWillReceiveProps(nextProps){
        const { tickerlistModel: {tickers}, id } = nextProps;

        let ticker;
        let state = {...initialState};;

        if (id) {
            ticker = tickers.find(ticker => ticker.id === id);
            if(ticker){
                const {id, name, content, type} = ticker;
                state = {id, name, content, type}
            }
        }

        if (this.state.id !== id) {
            this.setState(state);
        }
    }

    handleNameChange = e => {
        this.setState({
            name: e.target.value,
        })
    };

    handleContentChange = e => {
        const content = e.target.value;

        this.setState({
            content,
        });
    };

    handleRSSChange = e => {
        const isRss = e.target.checked;
        this.setState({
            type: isRss ? 'RSS' : 'TEXT'
        });
    };

    render() {
        const {form: {getFieldDecorator}} = this.props;


        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 18},
            },
        };

        const nameConfig = {
            rules: [{
                required: true,
                message: `Please input caption name`,
            }],
            initialValue: this.state.name,
        };

        const contentConfig = {
            rules: [{
                required: true,
                message: `Please input caption content`,
            }],
            initialValue: this.state.content,
        };


        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="Name">

                    {getFieldDecorator('name', nameConfig)(<Input size="large"
                                                                  placeholder=""
                                                                  autoFocus
                                                                  onChange={this.handleNameChange}/>)
                    }
                </FormItem>

                <FormItem {...formItemLayout} label="Content">

                    {getFieldDecorator('content', contentConfig)(<Input size="large"
                                                                  placeholder=""
                                                                  autoFocus
                                                                  onChange={this.handleContentChange}/>)
                    }
                </FormItem>

                <FormItem
                    label="Content Type"
                    {...formItemLayout}
                >
                    {getFieldDecorator('isRss', {initialValue: this.state.type === 'RSS', valuePropName: 'checked'})(
                        <Checkbox onChange={this.handleRSSChange}>This is a RSS link</Checkbox>)}
                </FormItem>

            </Form>
        );
    }
}


export default TickerForm


