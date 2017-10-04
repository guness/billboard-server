import {query, create, update, remove} from '../services/group';

export default {
    namespace: 'groupModel',
    state: {
        groups: [],
    },
    subscriptions: {
        setup ({ dispatch }) {
            dispatch({type: 'query'})
        }
    },
    effects: {
        * query({payload}, {call, put}) {
            const response = yield call(query, payload);
            const { success, data } = response;
            if (success) {
                yield put({
                    type: 'updateGroups',
                    payload: {
                        groups: data,
                    },
                })
            } else {
                throw data;
            }
        },
        * create({payload}, {call, put}){
            const response = yield call(create, payload);
            const {success, data} = response;
            const {id} = data;

            if(success){
                yield put ({
                    type: 'addGroup',
                    payload: {
                        group: {
                            ...payload,
                            id,
                        }
                    }
                });
            } else {
                throw data;
            }
        },
        * update({payload}, {call, put}) {
            const {id, ...restPayload} = payload;
            const response = yield call(update, id, restPayload);
            const {success, data} = response;

            if (success) {
                yield put({
                    type: 'updateGroup',
                    payload: payload,
                });
                yield put({type: 'deviceModel/query'});
            } else {
                throw data;
            }
        },
        * remove ({payload}, {call, put}){
            const response = yield call(remove, payload.id);
            const {success, data} = response;

            if(success){
                yield put ({
                    type: 'removeGroup',
                    payload,
                });
                yield put({type: 'deviceModel/query'});
            } else {
                throw data;
            }
        }
    },
    reducers: {
        updateGroups(state, {payload: {groups}}){
            return {
                ...state,
                groups
            };
        },
        addGroup(state, {payload: {group}}){
            return {
                ...state,
                groups: [...state.groups, group],
            };
        },
        updateGroup(state, {payload}){
            return {
                ...state,
                groups: state.groups.map(group => group.id === payload.id ? {...group, ...payload} : group),
            };
        },
        removeGroup(state, {payload: {id}}){
            return {
                ...state,
                groups: state.groups.filter(group => group.id !== id),
            };
        }
    },
};