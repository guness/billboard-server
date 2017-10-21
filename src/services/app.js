import request from '../utils/request';
import {api} from '../utils/config';
const {user, userLogin, userLogout} = api;

export async function query () {
    return request({
        url: user,
        method: 'get'
    });
}

export async function login (params) {
    return request({
        url: userLogin,
        method: 'post',
        data: params,
    });
}

export async function logout () {
    return request({
        url: userLogout,
        method: 'get'
    });
}