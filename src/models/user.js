import {delay} from 'dva/saga';
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
                yield put({type: 'appModel/query'});

                if (from && from !== '/login') {
                    yield put(routerRedux.push(from))
                } else {
                    yield put(routerRedux.push('/'))
                }
            } else {
                yield put({type: 'query'});
                yield call(delay, 500);
                throw data
            }
        },

        * logout({}, {call, put}) {
            const data = yield call(logout, {});

            const payload = {user: {}, authenticated: false};
            yield put({type: 'updateState', payload});
            yield put(routerRedux.push('/login'));

            if (!data.success) {
                throw (data)
            }

        },

        * query({}, {call, put, select}) {
            let response;
            try {
                response = yield call(query);
            } catch (e) {
                if (locationPathname !== '/login') {
                    yield put(routerRedux.push({
                        pathname: 'login',
                        query: {
                            from: locationPathname,
                        },
                    }))
                }
                return;
            }
            const {locationPathname} = yield select(store => store.appModel);

            if (response.success) {
                const {user} = response.data;
                yield put({
                    type: 'updateState',
                    payload: {
                        user,
                        authenticated: true,
                    },
                });
                // Retrieve dashboard data
                yield put({type: 'appModel/query'});

                if (locationPathname === '/login') {
                    console.log('push /');
                    yield put(routerRedux.push('/'));
                }
                if (!user.owners || user.owners.length === 0) {
                    throw {message: 'Make sure you have at least one owner assigned by management.'};
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
