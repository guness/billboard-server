import React from 'react';
import Header from '../components/header';
import Layout from '../components/layout';
import Content from '../components/content';
import Sider from '../components/sider';
import './Root.less';

function App(props) {
    return (
        <div>
            <Header>header</Header>
            <Layout>
                <Sider/>
                <Content>
                    {props.children}
                </Content>
            </Layout>
        </div>
    );
}


export default App;