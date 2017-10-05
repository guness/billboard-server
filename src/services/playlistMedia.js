import request from '../utils/request';
import {api} from '../utils/config';
const {playlistMedia} = api;

export async function query () {
    return request({
        url: playlistMedia,
        method: 'get',
        fetchType: 'CORS',
    });
}

export async function create (params) {
    return request({
        url: playlistMedia,
        method: 'post',
        data: params,
    });
}

export async function remove (id) {
    return request({
        url: `${playlistMedia}/${id}` ,
        method: 'delete',
        data: params,
    })
}

export async function update (id, params) {
    return request({
        url: `${playlistMedia}/${id}`,
        method: 'patch',
        data: params,
    })
}