/*
 * @Author: wonder1218 zhengwen_man@163.com
 * @Date: 2025-01-17 14:49:02
 * @LastEditors: wonder1218 zhengwen_man@163.com
 * @LastEditTime: 2025-01-17 18:24:36
 * @FilePath: \RQP_APP\src\core\api\config.js
 * @Description: axios配置
 */
import axios from 'axios'
import { queryString } from '../utils';
import { ToastPlugin, LoadingPlugin, cookie } from 'vux';
import store from '../store';
import Vue from 'vue';
import { error } from 'shelljs';
import { name } from 'file-loader';
Vue.use(ToastPlugin);
Vue.use(LoadingPlugin);
const vm = new Vue();

// 创建axios实例
axios.defaults.baseURL = process.env.baseURL;
axios.defaults.timeout = 15000;

const axiosInstance = axios.create({
    baseURL: process.env.baseURL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }
})
var loadingCount = 0;
// request拦截器
axiosInstance.interceptors.request.use(
    config => {
        vm.$vux.loading.show();
        loadingCount++;
        config.headers.token = localStorage.getItem('AWE_AUTH_TOKEN');
        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

// response拦截器
axiosInstance.interceptors.response.use(
    response => {
        loadingCount--;
        if(loadingCount == 0) {
            vm.$vux.loading.hide();
        }
        return response;
    },
    error => {
        loadingCount = 0;
        vm.$vux.loading.hide();
        if(error && error.response) {
            switch (error.response.status) { 
                case 400:
                    vm.$vux.toast.text('请求错误', 'top');
                    break;
                case 401:
                    vm.$vux.toast.text('未授权，请登录', 'top');
                    break;
                case 403:
                    vm.$vux.toast.text('拒绝访问', 'top');
                    break;
                case 404:
                    vm.$vux.toast.text('请求地址出错', 'top');
                    break;
                case 405:
                    vm.$vux.toast.text('请求方法未允许', 'top');
                    break;
                case 408:
                    vm.$vux.toast.text('请求超时', 'top');
                    break;
                case 500:
                    vm.$vux.toast.text('服务器内部错误', 'top');
                    break;
                case 501:
                    vm.$vux.toast.text('服务未实现', 'top');
                    break;
                case 502:
                    vm.$vux.toast.text('网关错误', 'top');
                    break;
                case 503:
                    vm.$vux.toast.text('服务不可用', 'top');
                    break;
                case 504:
                    vm.$vux.toast.text('网关超时', 'top');
                    break;
                case 505:
                    vm.$vux.toast.text('HTTP版本不受支持', 'top');
                    break;
                default:
                    vm.$vux.toast.text(`连接错误${ error.response.status }`, 'top');
                    break;
            }
        } else {
            vm.$vux.toast.text('连接到服务器失败', 'top');
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;

// 敏行接口
function MXapi(callbacks) {
    var deviceReady = false;
    var taskQueue = [];
    document.addEventListener('deviceready', function deviceReadyHandler() {
        deviceReady = true;
        taskQueue.forEach(function(task) {
            applyApi.apply(null, task);
        });
        callbacks.ready && callbacks.ready();
        document.removeEventListener('deviceready', deviceReadyHandler)
        // taskQueue = [];
    }, false);

    function applyApi(namespace, api, args) {
        if (window[nameSpace] && window[nameSpace][api]) {
            callbacks.beforeApply && callbacks.beforeApply(namespace, api, args);
            window[nameSpace][api].apply(null, args);
            // MXCommon(namespace, api, args);
        } else if(!deviceReady) {
            taskQueue.push([namespace, api, args]);
        } else {
            callbacks.error && callbacks.error(['该终端没有', namespace, '.', api, '方法!'].join(''), namespace, api);
        }
    }
    return applyApi;
}

const applyApi = MXapi({
    ready: function() {
        console.log('device ready');
    },
    error: function() {
        console.log('device error');
    },
    beforeApply: function(namespace, api, args) {
        console.log('before apply');
    }
});

const makeApi = namespace => (api, ...args) => applyApi(namespace, api, args);
export const MXCommon = makeApi('MXCommon');

export const ajax = params => new Promise((resolve, reject) => {
    loadingCount++;
    vm.$vux.loading.show();
    params = Object.assign({}, params, {
        url: apiURL + `${params.url}`,
        async: true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'token': localStorage.getItem('AWE_AUTH_TOKEN')
        },
        success: function(data, status, xhr) {
            loadingCount--;
            if(loadingCount == 0) {
                vm.$vux.loading.hide();
            }
            if(JSON.stringify(data),indexOf('<html>') > 0) {
                vm.$vux.toast.text('数据返回格式不正确，请检查后台服务！', 'top');
                return;
            } else {
                resolve({ data: JSON.parse(data), status });
            }
            resolve({ data: JSON.parse(data), status });
        },
        error: function(data, status, xhr) {
            loadingCount = 0;
            vm.$vux.loading.hide();
            // reject({ data, status });
            if(xhr && xhr.status) {
                switch (xhr.status) {
                    case 400:
                    vm.$vux.toast.text('请求错误', 'top');
                    break;
                case 401:
                    vm.$vux.toast.text('未授权，请登录', 'top');
                    break;
                case 403:
                    vm.$vux.toast.text('拒绝访问', 'top');
                    break;
                case 404:
                    vm.$vux.toast.text('请求地址出错', 'top');
                    break;
                case 405:
                    vm.$vux.toast.text('请求方法未允许', 'top');
                    break;
                case 408:
                    vm.$vux.toast.text('请求超时', 'top');
                    break;
                case 500:
                    vm.$vux.toast.text('服务器内部错误', 'top');
                    break;
                case 501:
                    vm.$vux.toast.text('服务未实现', 'top');
                    break;
                case 502:
                    vm.$vux.toast.text('网关错误', 'top');
                    break;
                case 503:
                    vm.$vux.toast.text('服务不可用', 'top');
                    break;
                case 504:
                    vm.$vux.toast.text('网关超时', 'top');
                    break;
                case 505:
                    vm.$vux.toast.text('HTTP版本不受支持', 'top');
                    break;
                default:
                    vm.$vux.toast.text(`连接错误${ error.response.status }`, 'top');
                    break;
                }
            } else {
                vm.$vux.toast.text('连接到服务器失败', 'top');
            }
            return Promise.reject(error);
        }
    });
    MXCommon('ajax', params);
});

export const ajaxGet = (url, query) => {
    url = query ? `${url}?${queryString.stringify(query)}` : url;
    const params = {
        type: 'GET',
        url,
    }
    return ajax(params);
}

export const ajaxPost = (url, data) => {
    const params = {
        type: 'POST',
        url,
        data
    }
    return ajax(params);
}
