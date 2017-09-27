import devices from '../constants/mock/device';

export default {
    namespace: 'deviceModel',
    state: {
        devices,
    },
    subscriptions: {},
    effects: {},
    reducers: {
        addDevice(state, {payload: device}) {
            return {
                ...state,
                devices: [...devices, device],
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