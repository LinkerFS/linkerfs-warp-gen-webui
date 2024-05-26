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

import {FilterNodeMethodFunction, TreeNodeData} from "element-plus/es/components/tree/src/tree.type";
import Node from "element-plus/es/components/tree/src/model/node";
import {FileTree} from "@/common/data/fileTree.ts";

export class FileSelectorState {
    title: string
    visible: boolean
    filter: FilterNodeMethodFunction | undefined

    constructor() {
        this.title = ""
        this.visible = false
        this.filter = noFilter
    }
}

export interface FileSelectConfig {
    title: string
    filter?: FilterNodeMethodFunction | undefined
}

const noFilter = undefined

const dirFilter = (_: any, data: TreeNodeData, __: Node) => {
    return !data.hasOwnProperty('size')
}

const fileNameFilter = (suffixes: Array<String>) => {
    if (suffixes.length > 0)
        return (_: any, data: TreeNodeData, __: Node) => {
            data = data as FileTree
            let result = false;
            // reserve directory
            if (!data.hasOwnProperty('size'))
                return true
            suffixes.forEach((val) => {
                if (data.name.endsWith(val))
                    result = true
            })
            return result
        }
    else
        return noFilter
}

export const FileTreeFilters = {noFilter, dirFilter, fileNameFilter}