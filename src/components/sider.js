import React from 'react';
import {Menu, Icon} from 'antd';
import {withRouter} from 'dva/router';
import {arrayToTree, queryArray} from '../utils';
import {connect} from 'dva';
import pathToRegexp from 'path-to-regexp';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'
import styles from './sider.less';

const Sider = ({ dispatch, app, location }) => {
    const {navOpenKeys, menus} = app;

    const menuTree = arrayToTree(menus.filter(menu => menu.mpid !== '-1'), 'id', 'mpid');
    const levelMap = {};

    const getMenus = (menuTreeN) => {
        return menuTreeN.map((item) => {
            if (item.children) {
                if (item.mpid) {
                    levelMap[item.id] = item.mpid;
                }
                return (
                    <Menu.SubMenu
                        key={item.id}
                        title={<span>
                        {item.icon && <Icon type={item.icon}/>}
                            {item.name}
                            </span>}
                    >
                        {getMenus(item.children)}
                    </Menu.SubMenu>
                );
            }
            return (
                <Menu.Item key={item.id}>
                    <Link to={item.route || '#'}>
                        {item.icon && <Icon type={item.icon}/>}
                        {(!menuTree.includes(item)) && item.name}
                    </Link>
                </Menu.Item>
            );
        });
    };

    const menuItems = getMenus(menuTree);

    const getAncestorKeys = (key) => {
        const map = {};
        const getParent = (index) => {
            const result = [String(levelMap[index])];
            if (levelMap[result[0]]) {
                result.unshift(getParent(result[0])[0]);
            }
            return result;
        };
        for (const index in levelMap) {
            if ({}.hasOwnProperty.call(levelMap, index)) {
                map[index] = getParent(index);
            }
        }
        return map[key] || [];
    };

    const onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => !navOpenKeys.includes(key));
        const latestCloseKey = navOpenKeys.find(key => !openKeys.includes(key));
        let nextOpenKeys = [];
        if (latestOpenKey) {
            nextOpenKeys = getAncestorKeys(latestOpenKey).concat(latestOpenKey)
        }
        if (latestCloseKey) {
            nextOpenKeys = getAncestorKeys(latestCloseKey)
        }
        dispatch({type: 'app/handleNavOpenKeys', payload: {navOpenKeys: nextOpenKeys}});
    };

    const menuProps = {
        onOpenChange,
        openKeys: navOpenKeys,
    };

    let currentMenu;
    let defaultSelectedKeys;
    for (const menu of menus) {
        if (menu.route && pathToRegexp(menu.route).exec(location.pathname)) {
            currentMenu = menu;
            break;
        }
    }

    const getPathArray = (array, current, pid, id) => {
        const result = [String(current[id])];
        const getPath = (item) => {
            if (item && item[pid]) {
                result.unshift(String(item[pid]));
                getPath(queryArray(array, item[pid], id));
            }
        };
        getPath(current);
        return result;
    };

    if (currentMenu) {
        defaultSelectedKeys = getPathArray(menus, currentMenu, 'mpid', 'id');
    }

    if (!defaultSelectedKeys) {
        defaultSelectedKeys = ['1'];
    }


    return (
        <Menu
            className={styles.appMenu}
            {...menuProps}
            mode={'inline'}
            theme={'light'}
            selectedKeys={defaultSelectedKeys}>
            {menuItems}
        </Menu>
    )
};

export default withRouter(connect(
    ({app}) => ({app})
)(Sider));

Sider.propTypes = {
    location: PropTypes.object,
    dispatch: PropTypes.func,
    app: PropTypes.object,
};
