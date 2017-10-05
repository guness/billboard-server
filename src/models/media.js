import {query, querySingle, update, create, remove} from '../services/media';
export default {
    namespace: 'mediaModel',
    state: {
        medias: [],
    },
    subscriptions: {
        setup ({ dispatch }) {
            dispatch({type: 'query'})
        }
    },
    effects: {
        * query({payload}, {call, put}){
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
        * querySingle({payload}, {call, put}){
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
        * create({payload}, {call, put}){
            const response = yield call(create, payload);
            const {success, data} = response;
            const {id} = data;

            if(success){
                yield put({type: 'querySingle', payload: {id}});
            } else {
                throw data;
            }
        },
        * remove ({payload}, {call, put}){
            const response = yield call(remove, payload.id);
            const {success, data} = response;

            if(success){
                yield put ({
                    type: 'removeMedia',
                    payload,
                });
                /*yield put({type: 'relationModel/query'});
                yield put({type: 'playlistModel/query'});*/
            } else {
                throw data;
            }
        }
    },
    reducers: {
        updateMedias(state, {payload: {medias}}){
            return {
                ...state,
                medias,
            };
        },
        addMedia(state, {payload: {media}}){
            return {
                ...state,
                medias: [...state.medias, media],
            };
        },
        updateMedia(state, {payload}){
            return {
                ...state,
                medias: state.medias.map(media => media.id === payload.id ? {...media, ...payload} : media),
            };
        },
        removeMedia(state, {payload: {id}}){
            return {
                ...state,
                medias: state.medias.filter(media => media.id !== id),
            };
        }
    }
}