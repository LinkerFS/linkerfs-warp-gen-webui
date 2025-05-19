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

import {FilterNodeMethodFunction, TreeNodeData} from "element-plus/es/components/tree/src/tree.type";
import {FileInfo, LazyFileTree} from "@/common/data/fileTree.ts";
import {InjectionKey} from "vue";
import FileSelector from "@/components/FileSelector.vue";
import {VueTemplateRef} from "@/common/utils/typeDeduction.ts";

export type FileTreeFilterFunc = (data: LazyFileTree) => boolean
export type SelectedCallBack = (callBack: FileInfo) => void

export interface FileSelectConfig {
    title: string
    callBack: (fileInfo: FileInfo) => void
    filter: FileTreeFilterFunc
}

export class FileSelectorState {
    title: string
    visible: boolean
    filter: FilterNodeMethodFunction
    filterFunc: FileTreeFilterFunc

    constructor() {
        this.title = ""
        this.visible = false
        this.filterFunc = noFilter
        this.filter = (_, nodeData: TreeNodeData, __) => {
            return this.filterFunc(nodeData as LazyFileTree)
        }
    }
}

const noFilter = (_: LazyFileTree) => true

const dirFilter = (data: LazyFileTree) => {
    return data.size === null
}

const fileNameFilter = (suffixes: Array<string>) => {
    if (suffixes.length > 0)
        return (data: LazyFileTree) => {
            let result = false;
            // reserve directory
            if (data.size === null && data.children !== null)
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

export const fileSelectorSymbol: InjectionKey<VueTemplateRef<typeof FileSelector>> = Symbol('fileSelector')

export const FileTreeFilters = {noFilter, dirFilter, fileNameFilter}