import {query, querySingle, update} from '../services/device';

export default {
    namespace: 'deviceModel',
    state: {
        devices: [],
        currentDevice: null,
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
        * querySingle({payload:{shortId}}, {call, put}) {
            const response = yield call(querySingle, shortId);
            const { success, data } = response;
            if (success) {
                yield put({
                    type: 'updateCurrentDevice',
                    payload: {
                        currentDevice: data,
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
        },
        * updateSingle ({payload}, {select, call, put}){
            const {id} = yield select(store => store.deviceModel.currentDevice);
            const response = yield call(update, id, payload);
            const { success, data } = response;
            if (success) {
                const oldCurrentDevice = yield select(store => store.deviceModel.currentDevice);
                const currentDevice = {...oldCurrentDevice, ...payload};
                yield put({
                    type: 'updateCurrentDevice',
                    payload: {currentDevice},
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
        updateCurrentDevice(state, {payload: {currentDevice}}){
            return {
                ...state,
                currentDevice
            }
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