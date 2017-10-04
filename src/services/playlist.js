import request from '../utils/request';
import {api} from '../utils/config';
const {playlist} = api;

export async function query () {
    return request({
        url: playlist,
        method: 'get',
        fetchType: 'CORS',
    });
}

export async function create (params) {
    return request({
        url: playlist,
        method: 'post',
        data: params,
    });
}

export async function remove (id) {
    return request({
        url: `${playlist}/${id}` ,
        method: 'delete',
        data: params,
    })
}

export async function update (id, params) {
    return request({
        url: `${playlist}/${id}`,
        method: 'patch',
        data: params,
    })
}