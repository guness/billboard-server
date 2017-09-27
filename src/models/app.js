/* global window */
/* global document */
/* global location */
import {routerRedux} from 'dva/router';
import queryString from 'query-string';
import {parse} from 'qs';
import menus from '../constants/menus';

export default {
    namespace: 'appModel',
    state: {
        user: {},
        permissions: {
            visit: [],
        },
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
                })
            })
        },

        setup({dispatch}) {
            dispatch({type: 'query'});
            let tid;
            window.onresize = () => {
                clearTimeout(tid);
                tid = setTimeout(() => {
                    dispatch({type: 'changeNavbar'})
                }, 300)
            }
        },

    },
    effects: {
        * query ({
                     payload,
                 }, { call, put, select }) {
        }
    },
    reducers: {
        updateState(state, {payload}) {
            return {
                ...state,
                ...payload,
            }
        },
        handleNavOpenKeys (state, { payload: navOpenKeys }) {
            return {
                ...state,
                ...navOpenKeys,
            }
        },
    },
}