import { query, querySingle, update, create, remove } from '../services/media';
import { message } from 'antd';
import { delay } from 'dva/saga';

let mediasToCreate = [];
let playlistIds = [];
let task;
const createAndAddPlaylistWithDebounce = function* (payload, { put, call, all }) {
    yield call(delay, 50);

    yield put({ type: 'uploadInProgress' });
    const effects = mediasToCreate.map(media => call(create, media));
    const mediaResponses = yield all(effects);
    const successfulPayloads = mediaResponses.reduce((prev, response, i) => {
        let { success, data } = response;
        if (success) {
            let mediaId = data.id;
            prev.push({ mediaId, playlistId: playlistIds[i] });
        } else {
            message(data);
        }
        return prev;
    }, []);

    yield put({ type: 'relationModel/createMultiple', payload: successfulPayloads });
    yield put({ type: 'finishUpload' });

    playlistIds = [];
    mediasToCreate = [];
};

const createWithDebounce = function* (payload, { put, call, all }) {
    yield call(delay, 50);

    yield put({ type: 'uploadInProgress' });
    const effects = mediasToCreate.map(media => call(create, media));
    const mediaResponses = yield all(effects);
    const successfulPayloads = mediaResponses.reduce((prev, response, i) => {
        let { success, data } = response;
        if (success) {
            let mediaId = data.id;
            prev.push({ mediaId, playlistId: playlistIds[i] });
        } else {
            message(data);
        }
        return prev;
    }, []);

    yield put({ type: 'relationModel/createMultiple', payload: successfulPayloads });
    yield put({ type: 'finishUpload' });

    playlistIds = [];
    mediasToCreate = [];
};



export default {
    namespace: 'mediaModel',
    state: {
        medias: [],
    },
    effects: {
        * query({ payload }, { call, put }) {
            const response = yield call(query, payload);
            const { success, data } = response;
            if (success) {
                yield put({
                    type: 'updateMedias',
                    payload: {
                        medias: data,
                    },
                })
            } else {
                throw data;
            }
        },
        * querySingle({ payload }, { call, put }) {
            const response = yield call(querySingle, payload.id);
            const { success, data } = response;
            if (success) {
                yield put({
                    type: 'addMedia',
                    payload: {
                        media: data,
                    },
                });
            } else {
                throw data;
            }
        },
        * uploadInProgress({}, { take }) {
            yield take('finishUpload');
        },
        createAndAddPlaylist: [function* ({ payload }, { fork, put, call, all, cancel }) {
            let { media, playlistId } = payload;
            mediasToCreate.push(media);
            playlistIds.push(playlistId);
            if (task) {
                yield cancel(task);
            }
            task = yield fork(createAndAddPlaylistWithDebounce, payload, { put, call, all });
        }, { type: 'takeEvery' }],
        * create({ payload }, { call, put }) {

            yield put({ type: 'uploadInProgress' });

            const response = yield call(create, payload);
            const { success, data } = response;
            const { id } = data;

            if (success) {
                yield put({ type: 'querySingle', payload: { id } });
            } else {
                throw data;
            }
            yield put({ type: 'finishUpload' });
            return id;
        },

        throttledUpdate: [function* ({ payload }, { call, put }) {
            yield call(delay, 500);
            yield put({ type: 'update', payload });
        }, { type: 'takeLatest' }],

        * update({ payload }, { call, put }) {
            const { id, ...restPayload } = payload;
            const response = yield call(update, id, restPayload);
            const { success, data } = response;

            if (success) {
                yield put({
                    type: 'updateMedia',
                    payload: payload,
                });
            } else {
                throw data;
            }
        },
        * remove({ payload }, { call, put }) {
            const response = yield call(remove, payload.id);
            const { success, data } = response;

            if (success) {
                yield put({
                    type: 'removeMedia',
                    payload,
                });

                yield put({ type: 'playlistModel/query' });
                yield put({ type: 'relationModel/query' });
            } else {
                throw data;
            }
        },
    },
    reducers: {
        updateMedias(state, { payload: { medias } }) {
            return {
                ...state,
                medias,
            };
        },
        addMedia(state, { payload: { media } }) {
            return {
                ...state,
                medias: [...state.medias, media],
            };
        },
        updateMedia(state, { payload }) {
            return {
                ...state,
                medias: state.medias.map(media => media.id === payload.id ? { ...media, ...payload } : media),
            };
        },
        removeMedia(state, { payload: { id } }) {
            return {
                ...state,
                medias: state.medias.filter(media => media.id !== id),
            };
        },
    },
}