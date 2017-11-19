import React from 'react';
import styles from './header.less';
import {Dropdown, Menu, Icon} from 'antd';
import {connect} from 'dva';
import logo from '../assets/logo_143x44.png';

class AppHeader extends React.Component {

    constructor(props){
        super(props);

        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    handleMenuClick = (e) => {
        const {dispatch} = this.props;
        if (e.key === 'logout') {
            dispatch({type: 'userModel/logout', payload: {}});
        }
    };

    render() {
        const {user} = this.props.userModel;
        const UserMenu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="logout">Logout</Menu.Item>
            </Menu>
        );

        return (
            <header className={styles.header}>
                <img src={logo} alt=""/>
                <h3 className={styles.brand}>PLUSBOARD MANAGEMENT PANEL</h3>
                <Dropdown overlay={UserMenu}>
                    <a className="ant-dropdown-link" href="#">
                        <Icon type="user"/>
                        &nbsp;
                        {user.name}
                    </a>
                </Dropdown>
            </header>
        );
    }
}

export default connect(({userModel}) => ({userModel}))(AppHeader);