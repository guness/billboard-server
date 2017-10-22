import React from 'react';
import {Redirect, Route, Switch, routerRedux} from 'dva/router';
import Root from './routes/Root';

const {ConnectedRouter} = routerRedux;

import dynamic from 'dva/dynamic';
import PropTypes from 'prop-types';

import {LocaleProvider} from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

const Routers = function ({history, app}) {
    const NotFound = dynamic({
        app,
        component: () => import('./routes/NotFound'),
    });

    const routes = [
        {
            path: '/login',
            component: () => import('./routes/Login'),
        }, {
            path: '/device-list',
            component: () => import('./routes/DeviceList'),
        }, {
            path: '/groups',
            component: () => import('./routes/Groups'),
        }, {
            path: '/media-list',
            component: () => import('./routes/MediaList'),
        }, {
            path: '/playlists',
            component: () => import('./routes/Playlists'),
        },
    ];

    return (
        <ConnectedRouter history={history}>
            <LocaleProvider locale={enUS}>
                <Root>
                    <Switch>
                        <Route exact path="/" render={() => (<Redirect to="/device-list"/>)}/>
                        {
                            routes.map(({path, ...dynamics}, key) => (
                                <Route key={key}
                                       exact
                                       path={path}
                                       component={dynamic({
                                           app,
                                           ...dynamics,
                                       })}
                                />
                            ))
                        }
                        <Route component={NotFound}/>
                    </Switch>
                </Root>
            </LocaleProvider>
        </ConnectedRouter>
    )
};

Routers.propTypes = {
    history: PropTypes.object,
    app: PropTypes.object,
};


export default Routers;
