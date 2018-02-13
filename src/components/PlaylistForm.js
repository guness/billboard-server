import React from 'react';
import {connect} from 'dva';

import moment from 'moment';
import {Input, Checkbox, DatePicker, TimePicker, Form} from 'antd';

const FormItem = Form.Item;
const {RangePicker} = DatePicker;

import GroupDropdown from './GroupDropdown';

class PlaylistForm extends React.Component {

    constructor(props) {
        super(props);
        let {playlistModel: {playlists}} = props;
        let playlist;

        if (this.props.id) {
            playlist = playlists.find(playlist => playlist.id === this.props.id);
        }

        this.state = {
            name: playlist ? playlist.name : '',
            startDate: playlist ? moment(playlist.startDate) : moment(),
            endDate: playlist ? moment(playlist.endDate) : moment().add(1, 'months'),
            todayStart: moment().startOf('day'),
            repeated: playlist ? playlist.repeated : false,
            startBlock: moment.duration(playlist && typeof playlist.endBlock === 'number' ? playlist.endBlock : 0, 'minutes'),
            endBlock: moment.duration(playlist && typeof playlist.endBlock === 'number' ? playlist.endBlock : 120, 'minutes'),
            groupId: playlist ? playlist.groupId : null,
        };

        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleRepeatChange = this.handleRepeatChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleStartTimeChange = this.handleStartTimeChange.bind(this);
        this.handleEndTimeChange = this.handleEndTimeChange.bind(this);
        this.disabledStartMinutes = this.disabledStartMinutes.bind(this);
        this.disabledEndHours = this.disabledEndHours.bind(this);
        this.disabledEndMinutes = this.disabledEndMinutes.bind(this);
        this.handleGroupSelect = this.handleGroupSelect.bind(this);
    }

    handleNameChange(e) {
        this.setState({
            name: e.target.value,
        })
    }

    handleRepeatChange(e) {
        this.setState({
            repeated: e.target.checked,
        })
    }

    handleDateChange([startDate, endDate]) {
        this.setState({
            startDate,
            endDate,
        })
    }

    disabledDate = (current) => {
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

    handleStartTimeChange(time) {
        let startBlock = moment.duration(time.diff(time.clone().startOf('day')));
        this.setState({
            startBlock,
        });
    }

    handleEndTimeChange(time) {
        let endBlock = moment.duration(time.diff(time.clone().startOf('day')));
        this.setState({
            endBlock,
        });
    }

    disabledStartMinutes() {
        return this.disabledRange(0, 60, 10);
    }

    disabledEndHours() {
        return this.range(0, this.state.startBlock.hours());
    }

    disabledEndMinutes(h) {
        let minutes = this.disabledRange(0, 60, 10);
        const startHour = this.state.startBlock.hours();
        if (h === startHour) {
            minutes.splice(0, Math.round(this.state.startBlock.minutes() / 10));
        }
        return minutes;
    }

    handleGroupSelect(groupId) {
        this.setState({
            groupId,
        });
    }


    render() {

        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 14},
            },
        };

        const {getFieldDecorator} = this.props.form;
        const rangeConfig = {
            rules: [{type: 'array', required: true, message: 'Please select time!'}],
            initialValue: [this.state.startDate, this.state.endDate],
        };

        const nameConfig = {
            rules: [{
                required: true,
                message: 'Please input playlist name',
            }],
            initialValue: this.state.name,
        };

        const timeConfig = {
            rules: [{type: 'object', required: true, message: 'Please select time!'}],
        };


        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem {...formItemLayout} label="Playlist Name">

                    {getFieldDecorator('name', nameConfig)(<Input size="large" placeholder="" autoFocus
                                                                  onChange={this.handleNameChange}/>)
                    }
                </FormItem>

                <FormItem {...formItemLayout} label="Start/End Date">
                    {getFieldDecorator('timeRange', rangeConfig)(
                        <RangePicker size="large"
                                     format="DD MMM YYYY HH:mm"
                                     showTime={{ hideDisabledOptions: true, format: 'HH:mm' }}
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
            </Form>
        );
    }
}

const ConnectedPlaylistFrom = connect(({playlistModel, groupModel}) => ({playlistModel, groupModel}))(PlaylistForm);

export default Form.create()(ConnectedPlaylistFrom);


