import devices from '../constants/mock/device';

export default {
    namespace: 'device',
    state: {
        devices,
    },
    subscriptions: {},
    effects: {},
    reducers: {
        addDevice(state, { payload: device}) {
            return {
                ...state,
                devices: [...devices, device],
            };
        },
    },
};