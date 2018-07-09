import React, {Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {Input, InputNumber, Checkbox, DatePicker, TimePicker, Form} from 'antd';
import PropTypes from "prop-types";

import GroupDropdown from './GroupDropdown';

const {RangePicker} = DatePicker;
const FormItem = Form.Item;

@Form.create()
@connect(({playlistModel, tickerlistModel, groupModel}) =>
    ({playlistModel, tickerlistModel, groupModel}))

class ListForm extends React.Component {

    static propTypes = {
        type: PropTypes.oneOf(['playlist', 'tickerlist']).isRequired
    };

    constructor(props) {
        super(props);
        const {type} = props;
        let lists = type === 'playlist' ?
            props.playlistModel.playlists :
            props.tickerlistModel.tickerlists;

        let list;

        if (this.props.id) {
            list = lists.find(({id}) => id === this.props.id);
        }

        this.state = {
            name: list ? list.name : '',
            startDate: list ? moment(list.startDate) : moment(),
            endDate: list ? moment(list.endDate) : moment().add(1, 'months'),
            todayStart: moment().startOf('day'),
            repeated: list ? list.repeated : false,
            startBlock: moment.duration(list && typeof list.endBlock === 'number' ? list.endBlock : 0, 'minutes'),
            endBlock: moment.duration(list && typeof list.endBlock === 'number' ? list.endBlock : 120, 'minutes'),
            groupId: list ? list.groupId : null,
        };

        if (type === 'tickerlist') {
            this.state = {
                ...this.state,
                fontSize: list ? list.fontSize : 20,
                color: '#' + (list ? list.color : 'FFFFFF'),
                speed: list ? list.speed : 30
            }
        }
    }

    handleNameChange = e => {
        this.setState({
            name: e.target.value,
        })
    };

    handleRepeatChange = e => {
        this.setState({
            repeated: e.target.checked,
        })
    };

    handleDateChange = ([startDate, endDate]) => {
        this.setState({
            startDate,
            endDate,
        })
    };

    disabledDate = current => {
        // Can not select days before today
        return current && current.valueOf() < moment().subtract(1, 'year').valueOf();
    };

    disabledTime = () => {
        return {
            disabledMinutes: () => this.disabledRange(0, 60, 10),
        };
    };

    range = (start, end) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };

    disabledRange = (start, end, increment = 1) => {
        const result = [];
        for (let i = start; i < end; i++) {
            if (i % increment !== 0) {
                result.push(i)
            }
        }
        return result;
    };

    handleStartTimeChange = time => {
        let startBlock = moment.duration(time.diff(time.clone().startOf('day')));
        this.setState({
            startBlock,
        });
    };

    handleEndTimeChange = time => {
        let endBlock = moment.duration(time.diff(time.clone().startOf('day')));
        this.setState({
            endBlock,
        });
    };

    disabledStartMinutes = () => {
        return this.disabledRange(0, 60, 10);
    };

    disabledEndHours = () => {
        return this.range(0, this.state.startBlock.hours());
    };

    disabledEndMinutes = h => {
        let minutes = this.disabledRange(0, 60, 10);
        const startHour = this.state.startBlock.hours();
        if (h === startHour) {
            minutes.splice(0, Math.round(this.state.startBlock.minutes() / 10));
        }
        return minutes;
    };

    handleGroupSelect = groupId => {
        this.setState({
            groupId,
        });
    };

    handleValueChange = (key, value) => {
        this.setState({[key]: value})
    };

    handleEnterKeyPress = event => {
        if (event.which === 13) {
            event.target.blur();
        }
        return false;
    };


    render() {
        const {form: {getFieldDecorator}, type} = this.props;
        const titleLower = type === 'playlist' ? 'playlist' : 'caption list';
        const titleUpper = type === 'playlist' ? 'Playlist' : 'Caption List';


        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };


        const rangeConfig = {
            rules: [{type: 'array', required: true, message: 'Please select time!'}],
            initialValue: [this.state.startDate, this.state.endDate],
        };


        const nameConfig = {
            rules: [{
                required: true,
                message: `Please input ${titleLower} name`,
            }],
            initialValue: this.state.name,
        };

        const timeConfig = {
            rules: [{type: 'object', required: true, message: 'Please select time!'}],
        };


        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label={`${titleUpper} Name`}>

                    {getFieldDecorator('name', nameConfig)(<Input size="large" placeholder="" autoFocus
                                                                  onChange={this.handleNameChange}/>)
                    }
                </FormItem>

                <FormItem {...formItemLayout} label="Start/End Date">
                    {getFieldDecorator('timeRange', rangeConfig)(
                        <RangePicker size="large"
                                     format="DD MMM YYYY HH:mm"
                                     showTime={{hideDisabledOptions: true, format: 'HH:mm'}}
                                     disabledDate={this.disabledDate}
                                     disabledTime={this.disabledTime}
                                     onChange={this.handleDateChange}/>)
                    }
                </FormItem>

                <FormItem  {...formItemLayout} label="Group">
                    {getFieldDecorator('groupId', {initialValue: this.state.groupId, valuePropName: 'currentGroupId'})(
                        <GroupDropdown onGroupSelect={this.handleGroupSelect}/>,
                    )}
                </FormItem>

                <FormItem {...formItemLayout} label="Daily Repeat">
                    {getFieldDecorator('repeated', {initialValue: this.state.repeated, valuePropName: 'checked'})(
                        <Checkbox onChange={this.handleRepeatChange}>Repeated</Checkbox>,
                    )}
                </FormItem>

                <FormItem {...formItemLayout} style={{display: this.state.repeated ? 'block' : 'none'}}
                          label="Repeat End">
                    {getFieldDecorator('startBlock', {
                        ...timeConfig,
                        initialValue: this.state.todayStart.clone().add(this.state.startBlock),
                    })(
                        <TimePicker size="large"
                                    format="HH:mm"
                                    hideDisabledOptions
                                    disabledMinutes={this.disabledStartMinutes}
                                    onChange={this.handleStartTimeChange}/>,
                    )}
                </FormItem>
                <FormItem {...formItemLayout} style={{display: this.state.repeated ? 'block' : 'none'}}
                          label="Repeat End">
                    {getFieldDecorator('endBlock', {
                        ...timeConfig,
                        initialValue: this.state.todayStart.clone().add(this.state.endBlock),
                    })(
                        <TimePicker
                            size="large"
                            format="HH:mm"
                            hideDisabledOptions disabledHours={this.disabledEndHours}
                            disabledMinutes={this.disabledEndMinutes} onChange={this.handleEndTimeChange}/>,
                    )}
                </FormItem>

                {type === 'tickerlist' && <Fragment>
                    <FormItem  {...formItemLayout} label="Font Size">
                        {getFieldDecorator('fontSize', {initialValue: this.state.fontSize})(
                            <InputNumber size="large" min={10} max={500} onChange={value => this.handleValueChange('fontSize', value)} />
                        )}
                    </FormItem>
                    <FormItem  {...formItemLayout} label="Text Color">
                        {getFieldDecorator('color', {initialValue: this.state.color})(
                            <Input size="large"
                                   placeholder=""
                                   type="color"
                                   onChange={e => this.handleValueChange('color', e.target.value)}
                            />
                        )}
                    </FormItem>
                    <FormItem  {...formItemLayout} label="Text Speed">
                        {getFieldDecorator('speed', {initialValue: this.state.speed})(
                            <InputNumber size="large" min={10} max={500} onChange={value => this.handleValueChange('speed', value)} />
                        )}
                    </FormItem>
                </Fragment>}
            </Form>
        );
    }
}


export default ListForm


