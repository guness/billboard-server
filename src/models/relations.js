import {query, create, update, remove} from '../services/playlistMedia';

export default {
    namespace: 'relationModel',
    state: {
        playlistMedias: [],
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
                    type: 'updatePlaylistMedias',
                    payload: {
                        playlistMedias: data,
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
                let newPayload = {
                    playlistMedia: {
                        ...payload,
                        id,
                    }
                };

                yield put ({
                    type: 'addPlaylistMedia',
                    payload: newPayload
                });

                yield put({type: 'playlistModel/query'});
                yield put({type: 'mediaModel/query'});

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
                    type: 'updatePlaylistMedia',
                    payload: payload,
                });
                yield put({type: 'playlistModel/query'});
                yield put({type: 'mediaModel/query'});
            } else {
                throw data;
            }
        },
        * remove ({payload}, {call, put}){
            const response = yield call(remove, payload.id);
            const {success, data} = response;

            if(success){
                yield put ({
                    type: 'removePlaylistMedia',
                    payload,
                });
                yield put({type: 'playlistModel/query'});
                yield put({type: 'mediaModel/query'});
            } else {
                throw data;
            }
        }
    },
    reducers: {
        updatePlaylistMedias(state, {payload: {playlistMedias}}){
            return {
                ...state,
                playlistMedias
            };
        },
        addPlaylistMedia(state, {payload: {playlistMedia}}){
            return {
                ...state,
                playlistMedias: [...state.playlistMedias, playlistMedia],
            };
        },
        updatePlaylistMedia(state, {payload}){
            return {
                ...state,
                playlistMedias: state.playlistMedias.map(playlistMedia => playlistMedia.id === payload.id ? {...playlistMedia, ...payload} : playlistMedia),
            };
        },
        removePlaylistMedia(state, {payload: {id}}){
            return {
                ...state,
                playlistMedias: state.playlistMedias.filter(playlistMedia => playlistMedia.id !== id),
            };
        }
    },
}