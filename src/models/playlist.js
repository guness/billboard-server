import { query, create, update, remove } from '../services/playlist';

function* updateSaga({ payload }, { call, put }) {
    const { id, ...restPayload } = payload;
    const response = yield call(update, id, restPayload);
    const { success, data } = response;

    if (success) {
        yield put({
            type: 'updatePlaylist',
            payload: payload,
        });
    } else {
        throw data;
    }
}


export default {
    namespace: 'playlistModel',
    state: {
        playlists: [],
    },
    effects: {
        * query({ payload }, { call, put }) {
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
        * create({ payload }, { call, put }) {
            const response = yield call(create, payload);
            const { success, data } = response;
            const { id } = data;

            if (success) {
                yield put({
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
        updateSaga: updateSaga,
        * update(action, effects) {
            const { call, put } = effects;
            yield call(updateSaga, action, effects);
            yield put({ type: 'relationModel/query' });
        },
        * batchedUpdate({ payload: { playlistArr } }, effects) {
            const { call, all } = effects;

            const promises = playlistArr.map(payload =>
                call(updateSaga, { payload }, effects)
            );

            yield all(promises);
        },
        * remove({ payload }, { call, put }) {
            const response = yield call(remove, payload.id);
            const { success, data } = response;

            if (success) {
                yield put({
                    type: 'removePlaylist',
                    payload,
                });
                yield put({ type: 'relationModel/query' });
            } else {
                throw data;
            }
        }
    },
    reducers: {
        updatePlaylists(state, { payload: { playlists } }) {
            return {
                ...state,
                playlists
            };
        },
        addPlaylist(state, { payload: { playlist } }) {
            return {
                ...state,
                playlists: [...state.playlists, playlist],
            };
        },
        updatePlaylist(state, { payload }) {
            return {
                ...state,
                playlists: state.playlists.map(playlist => playlist.id === payload.id ? { ...playlist, ...payload } : playlist),
            };
        },
        removePlaylist(state, { payload: { id } }) {
            return {
                ...state,
                playlists: state.playlists.filter(playlist => playlist.id !== id),
            };
        }
    },
}