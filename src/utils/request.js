import axios from "axios"
import store from "@/store/index"
import { start, close } from "@/utils/progress"
import { ElMessage } from "element-plus"

//创建axios实例
const service = axios.create({
    baseURL: API, //api网关
    timeout: 100000, //请求超时时间10s
})

//request拦截器
service.interceptors.request.use(
    (config) => {
        start()
        //让每一个请求都带上jwt
        if (store.getters["identity/token"]) {
            if (config && config.headers) {
                config.headers["access_token"] = `${store.getters["identity/token"]}`
            }
        } else {
            store.dispatch("identity/logout")
        }
        return config
    },
    (error) => {
        start()
        console.log(error)
        Promise.reject(error)
    }
)

//response拦截器
service.interceptors.response.use(
    (response) => {
        close()
        const res = response.data
        if (response.status !== 200 || res.status !== 0) {
            ElMessage({
                message: res.message,
                grouping: true,
                type: "error",
            })
            return Promise.reject("error")
        }

        return res
    },
    (error) => {
        close()
        const res = error?.response?.data ?? error.message
        ElMessage({
            message: "系统错误：" + res,
            grouping: true,
            type: "error",
        })

        return Promise.reject(error)
    }
)

/**
 * 发送get请求
 * @param {*} url 请求路径
 * @param {*} params query参数
 * @returns
 */
export async function get(url, params) {
    return service({
        method: "get",
        url: url,
        params: params,
    })
}
/**
 * 发送post请求
 * @param {*} url 请求路径
 * @param {*} data body数据
 * @returns
 */
export async function post(url, data) {
    return service({
        method: "post",
        url: url,
        data: data,
    })
}
/**
 * 发送put请求
 * @param {*} url 请求路径
 * @param {*} data body数据
 * @returns
 */
export async function put(url, data) {
    return service({
        method: "put",
        url: url,
        data: data,
    })
}
/**
 * 发送delete请求
 * @param {*} url 请求路径
 * @param {*} data body数据
 * @returns
 */
export async function del(url, data) {
    return service({
        method: "delete",
        url: url,
        data: data,
    })
}
export default service