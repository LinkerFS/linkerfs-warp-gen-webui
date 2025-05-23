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

export interface LazyFileTree {
    idx?: number
    name: string
    fullPath: string
    children: LazyFileTree[] | null
    size: bigint | null
}

export interface FileTree {
    name: string
    fullPath?: string
    children: FileTree[] | null
    size: string | null
}

export class FileInfo {
    name: string
    size: bigint | null
    fullPath: string

    constructor(name: string, fullPath: string, size: bigint | null) {
        this.name = name;
        this.fullPath = fullPath
        this.size = size
    }
}

export function assignFullPath(fileTree: FileTree) {
    fileTree.children?.forEach((val) => {
        let fullPath = fileTree!.fullPath
        if (!fullPath!.endsWith('/'))
            fullPath += '/'
        fullPath += val.name
        val.fullPath = fullPath
        assignFullPath(val)
    })
}