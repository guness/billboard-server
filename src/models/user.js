import {routerRedux} from 'dva/router'
import {login, query, logout} from '../services/app'

export default {
    namespace: 'userModel',
    state: {
        user: {},
        authenticated: false,
    },
    subscriptions: {
        setup({dispatch}) {
            dispatch({type: 'query'});
        },
    },
    effects: {
        * login({payload}, {put, call, select}) {

            const data = yield call(login, payload);

            const {locationQuery} = yield select(store => store.appModel);

            if (data.success) {
                const {from} = locationQuery;

                // Set authenticated
                yield put({type: 'updateState', payload: {authenticated: true}});
                // Retrieve user data
                yield put({type: 'query'});
                // Retrieve dashboard data
                yield put({ type: 'appModel/query' });

                if (from && from !== '/login') {
                    yield put(routerRedux.push(from))
                } else {
                    yield put(routerRedux.push('/'))
                }
            } else {
                throw data
            }
        },

        * logout({}, {call, put}) {
            const data = yield call(logout, {});
            if (data.success) {
                const payload = {user: {}, authenticated: false};
                yield put({type: 'updateState', payload});
                yield put(routerRedux.push('/login'));
            } else {
                throw (data)
            }
        },

        * query({}, {call, put, select}) {

            const response = yield call(query);
            const {locationPathname} = yield select(store => store.appModel);

            if (response.success) {
                yield put({
                    type: 'updateState',
                    payload: {
                        user: response.data.user,
                        authenticated: true,
                    },
                });
                // Retrieve dashboard data
                yield put({ type: 'appModel/query' });

                if (locationPathname === '/login') {
                    console.log('push /');
                    yield put(routerRedux.push('/'));
                }
            } else {
                if (locationPathname !== '/login') {
                    yield put(routerRedux.push({
                        pathname: 'login',
                        query: {
                            from: locationPathname,
                        },
                    }))
                }
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
    },
}
