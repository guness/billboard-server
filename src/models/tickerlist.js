import {
    query, create, update, remove,
    querySingle, createSingle, updateSingle, removeSingle
} from '../services/tickerlist';

function* updateSingleSaga({ payload }, { call, put }) {
    const { id, ...restPayload } = payload;
    const response = yield call(updateSingle, id, restPayload);
    const { success, data } = response;

    if (success) {
        yield put({
            type: 'updateTicker',
            payload: payload,
        });
    } else {
        throw data;
    }
}

function* updateSaga({ payload }, { call, put }) {
    const { id, ...restPayload } = payload;
    const response = yield call(update, id, restPayload);
    const { success, data } = response;

    if (success) {
        yield put({
            type: 'updateTickerlist',
            payload: payload,
        });
    } else {
        throw data;
    }
}


export default {
    namespace: 'tickerlistModel',
    state: {
        tickerlists: [],
        tickers: [],
    },
    effects: {
        * query({ payload }, { call, put }) {
            const response = yield call(query, payload);
            const { success, data } = response;
            if (success) {
                yield put({
                    type: 'updateTickerlists',
                    payload: {
                        tickerlists: data,
                    },
                })
            } else {
                throw data;
            }
        },
        * querySingle({ payload }, {call, put}) {
            const response = yield call(querySingle, payload);
            const { success, data } = response;
            if (success) {
                yield put({
                    type: 'updateTickers',
                    payload: {
                        tickers: data,
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
                    type: 'addTickerlist',
                    payload: {
                        tickerlist: {
                            ...payload,
                            id,
                        }
                    }
                });
            } else {
                throw data;
            }
        },
        * createSingle({ payload }, { call, put }) {
            const response = yield call(createSingle, payload);
            const { success, data } = response;
            const { id } = data;

            if (success) {
                yield put({
                    type: 'addTicker',
                    payload: {
                        ticker: {
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
        },
        * updateSingle(action, effects) {
            const { call, put } = effects;
            yield call(updateSingleSaga, action, effects);
        },
        * batchedUpdate({ payload: { listArr } }, effects) {
            const { call, all } = effects;

            const promises = listArr.map(payload =>
                call(updateSaga, { payload }, effects)
            );

            yield all(promises);
        },
        * batchedUpdateSingle({ payload: { tickerArr } }, effects) {
            const { call, all } = effects;

            const promises = tickerArr.map(payload =>
                call(updateSingleSaga, { payload }, effects)
            );

            yield all(promises);
        },
        * remove({ payload }, { call, put }) {
            const response = yield call(remove, payload.id);
            const { success, data } = response;

            if (success) {
                yield put({
                    type: 'removeTickerlist',
                    payload,
                });
            } else {
                throw data;
            }
        },
        * removeSingle({ payload }, { call, put }) {
            const response = yield call(removeSingle, payload.id);
            const { success, data } = response;

            if (success) {
                yield put({
                    type: 'removeTicker',
                    payload,
                });
            } else {
                throw data;
            }
        }
    },
    reducers: {
        updateTickerlists(state, { payload: { tickerlists } }) {
            return {
                ...state,
                tickerlists
            };
        },
        updateTickers(state, { payload: { tickers } }) {
            return {
                ...state,
                tickers
            };
        },
        addTickerlist(state, { payload: { tickerlist } }) {
            return {
                ...state,
                tickerlists: [...state.tickerlists, tickerlist],
            };
        },
        addTicker(state, { payload: { ticker } }) {
            return {
                ...state,
                tickers: [...state.tickers, ticker],
            };
        },
        updateTickerlist(state, { payload }) {
            return {
                ...state,
                tickerlists: state.tickerlists.map(tickerlist => tickerlist.id === payload.id ? { ...tickerlist, ...payload } : tickerlist),
            };
        },
        updateTicker(state, { payload }) {
            return {
                ...state,
                tickers: state.tickers.map(ticker => ticker.id === payload.id ? { ...ticker, ...payload } : ticker),
            };
        },
        removeTickerlist(state, { payload: { id } }) {
            return {
                ...state,
                tickerlists: state.tickerlists.filter(tickerlist => tickerlist.id !== id),
            };
        },
        removeTicker(state, { payload: { id } }) {
            return {
                ...state,
                tickers: state.tickers.filter(ticker => ticker.id !== id),
            };
        }
    },
}