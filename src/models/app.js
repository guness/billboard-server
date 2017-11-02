/* global window */
/* global document */
/* global location */
import {routerRedux} from 'dva/router';
import queryString from 'query-string';
import menus from '../constants/menus';

export default {
    namespace: 'appModel',
    state: {
        menus,
        menuPopoverVisible: false,
        navOpenKeys: [],
        locationPathname: '',
        locationQuery: {},
    },
    subscriptions: {
        setupHistory({dispatch, history}) {
            history.listen((location) => {
                dispatch({
                    type: 'updateLocation',
                    payload: {
                        locationPathname: location.pathname,
                        locationQuery: queryString.parse(location.search),
                    },
                });
            });
        },
    },
    effects: {
        * query({}, {select, put}) {
            const {authenticated} = yield select(state => state.userModel);
            if (authenticated) {
                yield put({type: 'deviceModel/query'});
                yield put({type: 'groupModel/query'});
                yield put({type: 'mediaModel/query'});
                yield put({type: 'playlistModel/query'});
                yield put({type: 'relationModel/query'});
            }
        },
        * updateLocation({payload}, {put, select}) {

            const {locationPathname} = payload;
            yield put({type: 'updateState', payload});
            const {authenticated} = yield select(store => store.userModel);
            if (!authenticated && locationPathname !== '/login') {
                yield put(routerRedux.push({
                    pathname: 'login',
                    query: {
                        from: locationPathname,
                    },
                }));
            } else if (authenticated && locationPathname === '/login'){
                yield put(routerRedux.push({
                    pathname: '/',
                    query: {
                        from: locationPathname,
                    },
                }));
            }
        },
    },
    reducers: {
        updateState(state, {payload}) {
            return {
                ...state,
                ...payload,
            }
        },
        handleNavOpenKeys(state, {payload: navOpenKeys}) {
            return {
                ...state,
                ...navOpenKeys,
            }
        },
    },
}