import {query, create, update, remove} from '../services/playlistMedia';
import {message} from 'antd';

export default {
    namespace: 'relationModel',
    state: {
        playlistMedias: [],
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
        * createMultiple({payload}, {call, put, all}){
            const effects = payload.map(relationItem => call(create, relationItem));
            const responses = yield all(effects);

            const playlistMedias = responses.reduce((prev, response, i) => {
                const {success, data} = response;
                const {id} = data;

                if(success){
                    let playlistMedia = {
                        ...payload[i],
                        id,
                    };

                    prev.push(playlistMedia);
                } else {
                    message(data);
                }

                return prev;
            }, []);

            yield put ({
                type: 'addMultiplePlaylistMedia',
                payload: {playlistMedias}
            });

            yield put({type: 'playlistModel/query'});
            yield put({type: 'mediaModel/query'});
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
        addMultiplePlaylistMedia(state, {payload: {playlistMedias}}){
            debugger;
            return {
                ...state,
                playlistMedias: [...state.playlistMedias, ...playlistMedias],
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