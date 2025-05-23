/*
 * linkerfs-warp-gen-webui: warp configuration file generator webui for project linkerfs
 * Copyright (C) 2024-2025  kaedeair <kaedeair@outlook.com>
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
import {FileTree} from "@/common/data/fileTree.ts";

export const listDir = async (path: string) => {
    return Axios.post("/file/listDir", {
        dirPath: path
    })
}

export interface ListDirResp {
    dirPath: string
    fileList: {
        name: string
        size: string
    }[]
    dirList: {
        name: string
        isEmpty: boolean
    }[]
}

export const listUDF = async (udfPath: string) => {
    return Axios.post("/file/listUDF", {
        udfPath: udfPath
    })
}

export interface ListUdfResp {
    udfPath: string
    volumeId: string
    fileTree: FileTree
}