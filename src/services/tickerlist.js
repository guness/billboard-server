import request from '../utils/request';
import {api} from '../utils/config';

const { tickerlist, ticker, proxy } = api;

export async function validate(url) {
    const encoded = window.encodeURIComponent(url);
    return request({
        url: `${proxy}/${encoded}`,
        method: 'get',
        fetchType: 'CORS',
    });
}

export async function query() {
    return request({
        url: tickerlist,
        method: 'get',
        fetchType: 'CORS',
    });
}

export async function querySingle() {
    return request({
        url: ticker,
        method: 'get',
        fetchType: 'CORS',
    });
}

export async function create(params) {
    return request({
        url: tickerlist,
        method: 'post',
        data: params,
    });
}

export async function createSingle(params) {
    return request({
        url: ticker,
        method: 'post',
        data: params,
    });
}

export async function remove(id) {
    return request({
        url: `${tickerlist}/${id}`,
        method: 'delete',
    })
}

export async function removeSingle(id) {
    return request({
        url: `${ticker}/${id}`,
        method: 'delete',
    })
}

export async function update(id, params) {
    return request({
        url: `${tickerlist}/${id}`,
        method: 'patch',
        data: params,
    })
}

export async function updateSingle(id, params) {
    return request({
        url: `${ticker}/${id}`,
        method: 'patch',
        data: params,
    })
}