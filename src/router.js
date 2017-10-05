import React from 'react';
import { Router, Route, Switch, Redirect } from 'dva/router';
import {Root, DeviceList, Groups, MediaList, Playlists, NotFound} from './routes';

function RouterConfig({ history }) {
    return (
        <Router history={history}>
            <Root>
                <Switch>
                    <Route path="/" exact render={() => (<Redirect to="/device-list" />)} />
                    <Route path="/device-list" component={DeviceList} />
                    <Route path="/groups" component={Groups} />
                    <Route path="/media-list" component={MediaList} />
                    <Route path="/playlists" component={Playlists} />
                    <Route component={NotFound} />
                </Switch>
            </Root>
        </Router>
    );
}

export default RouterConfig;
