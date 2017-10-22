import {query, create, update, remove} from '../services/playlist';

export default {
    namespace: 'playlistModel',
    state: {
        playlists: [],
    },
    effects: {
        * query({payload}, {call, put}) {
            const response = yield call(query, payload);
            const { success, data } = response;
            if (success) {
                yield put({
                    type: 'updatePlaylists',
                    payload: {
                        playlists: data,
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
                    type: 'addPlaylist',
                    payload: {
                        playlist: {
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
                    type: 'updatePlaylist',
                    payload: payload,
                });
                yield put({type: 'relationModel/query'});
            } else {
                throw data;
            }
        },
        * remove ({payload}, {call, put}){
            const response = yield call(remove, payload.id);
            const {success, data} = response;

            if(success){
                yield put ({
                    type: 'removePlaylist',
                    payload,
                });
                yield put({type: 'relationModel/query'});
            } else {
                throw data;
            }
        }
    },
    reducers: {
        updatePlaylists(state, {payload: {playlists}}){
            return {
                ...state,
                playlists
            };
        },
        addPlaylist(state, {payload: {playlist}}){
            return {
                ...state,
                playlists: [...state.playlists, playlist],
            };
        },
        updatePlaylist(state, {payload}){
            return {
                ...state,
                playlists: state.playlists.map(playlist => playlist.id === payload.id ? {...playlist, ...payload} : playlist),
            };
        },
        removePlaylist(state, {payload: {id}}){
            return {
                ...state,
                playlists: state.playlists.filter(playlist => playlist.id !== id),
            };
        }
    },
}