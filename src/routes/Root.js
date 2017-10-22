import React from 'react';
import {connect} from 'dva';
import PropTypes from 'prop-types';
import {withRouter} from 'dva/router'

import Header from '../components/header';
import Layout from '../components/layout';
import Content from '../components/content';
import Sider from '../components/sider';
import styles from './Root.less';


class Root extends React.Component {
    render() {
        const {authenticated} = this.props.userModel;
        if (authenticated) {
            return (
                <div className={styles.appRoot}>
                    <Header>header</Header>
                    <Layout>
                        <Sider/>
                        <Content>
                            {this.props.children}
                        </Content>
                    </Layout>
                </div>
            );
        } else {
            return <div className={styles.appRoot}>{this.props.children}</div>;
        }
    }
}

Root.propTypes = {
    userModel: PropTypes.object.isRequired,
};


export default withRouter(connect(({userModel}) => ({userModel}))(Root));