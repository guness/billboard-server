import React from 'react';
import moment from 'moment';

export default (props) => {
    const {record} = props;
    const {status, lastOnline} = record
    return <span>{status === 'ONLINE' ? '-' : lastOnline ? moment(lastOnline).fromNow() : 'Never been online'}</span>;
}

