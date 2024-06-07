/*
 * linkerfs-warp-gen-webui: warp configuration file generator webui for project linkerfs
 * Copyright (C) 2024  kaedeair <kaedeair@outlook.com>
 *
 * This file is part of linkerfs-warp-gen-webui.
 *
 * linkerfs-warp-gen-webui is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * linkerfs-warp-gen-webui is distributed in the hope that it will be useful,but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with linkerfs-warp-gen-webui. If not, see <https://www.gnu.org/licenses/>.
 */

import axios from "axios";
import {ElMessage} from "element-plus";
import {i18n} from '@/common/i18n'

const t = i18n.global.t
const Axios = axios.create({
    baseURL: '/api',
    timeout: 3000,
})
Axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
Axios.interceptors.request.use(
    config => config,
    error => {
        ElMessage({
            message: `${t('Request failed: ')}${error.message}`,
            type: 'error'
        })
        return Promise.reject(error)
    }
)
Axios.interceptors.response.use(
    response => {
        if (response.data.code === ResponseStatus.Response_OK) {
            if (response.data.data == null) {
                ElMessage({
                    message: response.data.msg,
                    type: 'success'
                })
            } else {
                return response.data.data
            }
        } else {
            ElMessage({
                message: response.data.msg,
                type: 'error'
            })
            return Promise.reject()
        }
        return response.data?.data
    },
    error => {
        ElMessage({
            message: `${t('Request failed: ')}${error.message}`,
            type: 'error'
        })
        return Promise.reject(error)
    }
)

enum ResponseStatus {
    Response_OK = 200,
}

export default Axios