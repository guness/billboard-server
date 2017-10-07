import React from 'react';
import Header from '../components/header';
import Layout from '../components/layout';
import Content from '../components/content';
import Sider from '../components/sider';
import './Root.less';

import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

function App(props) {
    return (
        <LocaleProvider locale={enUS}>
            <div>
                <Header>header</Header>
                <Layout>
                    <Sider/>
                    <Content>
                        {props.children}
                    </Content>
                </Layout>
            </div>
        </LocaleProvider>
    );
}


export default App;