import request from '../utils/request';
import {api} from '../utils/config';
const {device} = api;

export async function query () {
    return request({
        url: device,
        method: 'get',
        fetchType: 'CORS',
    });
}

export async function create (params) {
    return request({
        url: device,
        method: 'post',
        data: params,
    });
}

export async function remove (id) {
    return request({
        url: `${device}/${id}` ,
        method: 'delete',
        data: params,
    })
}

export async function update (id, params) {
    return request({
        url: `${device}/${id}`,
        method: 'patch',
        data: params,
    })
}