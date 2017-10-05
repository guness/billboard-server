import request from '../utils/request';
import {api} from '../utils/config';
const {group} = api;

export async function query () {
    return request({
        url: group,
        method: 'get',
        fetchType: 'CORS',
    });
}

export async function create (params) {
    return request({
        url: group,
        method: 'post',
        data: params,
    });
}

export async function remove (id) {
    return request({
        url: `${group}/${id}` ,
        method: 'delete'
    })
}

export async function update (id, params) {
    return request({
        url: `${group}/${id}`,
        method: 'patch',
        data: params,
    })
}