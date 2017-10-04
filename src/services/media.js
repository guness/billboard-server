import request from '../utils/request';
import {api} from '../utils/config';
const {media} = api;

export async function query () {
    return request({
        url: media,
        method: 'get',
        fetchType: 'CORS',
    });
}

export async function create (params) {
    return request({
        url: media,
        method: 'post',
        data: params,
    });
}

export async function remove (id) {
    return request({
        url: `${media}/${id}` ,
        method: 'delete',
        data: params,
    })
}

export async function update (id, params) {
    return request({
        url: `${media}/${id}`,
        method: 'patch',
        data: params,
    })
}