import devices from '../constants/mock/device';
import {query, update} from '../services/device';

export default {
    namespace: 'deviceModel',
    state: {
        devices: [],
    },
    subscriptions: {
        setup ({ dispatch }) {
            dispatch({type: 'query'})
        }
    },
    effects: {
        * query({payload}, {call, put}) {
            const response = yield call(query, payload)
            const { success, data } = response;
            if (success) {
                yield put({
                    type: 'updateDevices',
                    payload: {
                        devices: data,
                    },
                })
            } else {
                throw data;
            }
        },
        * update ({payload}, {call, put}){
            const {deviceId, ...restPayload} = payload;
            const response = yield call(update, deviceId, restPayload);
            const { success, data } = response;
            /*eslint-disable*/
            if (success) {
                console.log('change group success')
                yield put({
                    type: 'changeGroup',
                    payload,
                })
            } else {
                throw data;
            }
        }
    },
    reducers: {
        updateDevices(state, {payload: {devices}}){
            return {
                ...state,
                devices
            };
        },
        changeGroup(state, {payload}) {
            const {deviceId, groupId} = payload;
            console.log('change group reducer')
            return {
                ...state,
                devices: state.devices.map(device => device.id === deviceId ? {...device, groupId} : device),
            }
        },
    },
};