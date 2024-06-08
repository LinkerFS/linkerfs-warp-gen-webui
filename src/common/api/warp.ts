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

import Axios from "@/common/utils/axios.ts";
import {WarpTarget} from "@/common/data/warpFile.ts";

export const createWarp = async (savePath: string, configs: WarpConfig[]) => {
    let data: CreateWarpReq = {
        savePath: savePath,
        warpConfigs: configs
    }
    return Axios.post("/warp/create", data)
}

export interface WarpConfig {
    fileName: string
    warpTargets: WarpTarget[]
}

interface CreateWarpReq {
    savePath: string
    warpConfigs: WarpConfig[]
}

export interface CreateWarpResponse {
    warpFiles: string[]
    hardlinkFiles: string[]
    failedFiles: string[]
}