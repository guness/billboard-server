import React from 'react';
import {Badge} from 'antd';
import {toTitleCase} from '../utils';

export default function (props) {
    const {status} = props;
    return (<span>
                <Badge
                    status={status === 'ONLINE' ? 'success' : 'default'}/>{toTitleCase(status)}
            </span>);
}
