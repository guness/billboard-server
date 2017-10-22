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
                    type: 'updateState',
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