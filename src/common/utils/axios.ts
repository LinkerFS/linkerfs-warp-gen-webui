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

const Axios = axios.create({
    baseURL: '/api',
    timeout: 3000,
})
Axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
Axios.interceptors.request.use(
    config => config,
    error => {
        //todo handle request error
        return Promise.reject(error)
    }
)
Axios.interceptors.response.use(
    response => {
        //todo handler response
        return response.data?.data
    },
    error => {
        //todo handle response error
        return Promise.reject(error)
    }
)
export default Axios