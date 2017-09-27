import React from 'react';
import {connect} from 'dva';
import {Menu, Dropdown, Icon} from 'antd';
import PropTypes from 'prop-types';

const GroupDropdown = ({groups, currentGroupId, onGroupSelect}) => {

    const currentGroup = groups.find(group => group.id === currentGroupId);

    const handleGroupSelect = ({item}) => onGroupSelect(item.props.group.id);

    const menu = (
        <Menu onClick={handleGroupSelect}>
            {
                groups.filter(group => group.id !== currentGroup.id)
                    .map(group =>
                    (<Menu.Item key={group.id} group={group}>
                        <a target="#" >{group.name}</a>
                    </Menu.Item>)
                )
            }
        </Menu>
    );


    return (<Dropdown overlay={menu} onClick={e => e.preventDefault()}>
        <a className="ant-dropdown-link" href="#">
            {currentGroup.name} <Icon type="down"/>
        </a>
    </Dropdown>)
};

GroupDropdown.propTypes = {
    groups: PropTypes.array,
    currentGroupId: PropTypes.any,
    onGroupSelect: PropTypes.func,
};

export default connect(({groupModel}) => ({groups: groupModel.groups}))(GroupDropdown);