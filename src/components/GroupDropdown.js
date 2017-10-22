import React from 'react';
import {connect} from 'dva';
import {Menu, Dropdown, Icon} from 'antd';
import PropTypes from 'prop-types';

const GroupDropdown = ({groups, currentGroupId, onGroupSelect}) => {

    let ungroupIncluded = [{
        id: null,
        name: 'Ungrouped',
    }, ...groups];

    let currentGroup = ungroupIncluded.find(group => group.id === currentGroupId);
    if (!currentGroup) {
        currentGroup = ungroupIncluded[0]
    }

    const handleGroupSelect = ({item}) => onGroupSelect(item.props.group.id);

    const menu = (
        <Menu onClick={handleGroupSelect}>
            {
                ungroupIncluded.filter(group => group.id !== currentGroup.id)
                    .map(group =>
                        (<Menu.Item key={group.id} group={group}>
                            <a target="#">{group.name}</a>
                        </Menu.Item>),
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