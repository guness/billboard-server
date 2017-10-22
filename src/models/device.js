import {query, update} from '../services/device';

export default {
    namespace: 'deviceModel',
    state: {
        devices: [],
    },
    effects: {
        * query({payload}, {call, put}) {
            const response = yield call(query, payload);
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
            if (success) {
                yield put({
                    type: 'changeGroup',
                    payload,
                });
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
            return {
                ...state,
                devices: state.devices.map(device => device.id === deviceId ? {...device, groupId} : device),
            }
        },
    },
};