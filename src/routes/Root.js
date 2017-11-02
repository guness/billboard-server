import React from 'react';
import {connect} from 'dva';
import PropTypes from 'prop-types';
import {withRouter} from 'dva/router'
import {Spin} from 'antd';

import Header from '../components/header';
import Layout from '../components/layout';
import Content from '../components/content';
import Sider from '../components/sider';
import styles from './Root.less';


class Root extends React.Component {
    render() {
        const authenticated = this.props.userModel && this.props.userModel.authenticated;
        const loading = this.props.loading;
        if (loading) {
            return (
                <div className={styles.spinContainer}>
                    <div>
                        <h2 className={styles.textLight}>Plusboard</h2>
                        <Spin/>
                    </div>
                </div>
            );
        } else if (authenticated) {
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


export default withRouter(connect(({userModel, loading}) => ({
    userModel,
    loading: loading.effects['userModel/query'],
}))(Root));