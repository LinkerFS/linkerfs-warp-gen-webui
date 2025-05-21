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

import {reactive, Ref} from "vue";
import {fileNameRegex} from "@/common/utils/validator.ts";
import {FormRules} from "element-plus";
import {i18n} from "@/common/i18n";

const t = i18n.global.t

export class WarpFileSaveInfo {
    savePath: string = ""
    warpFileName: string = ""
    savePathIsDir: boolean = false
}

export function getWarpFileSaveInfoValidator(saveInfo: Ref<WarpFileSaveInfo>) {

    function validateSavePath(_: any, value: any, callback: any) {
        if (value === '') {
            callback(new Error(t('view.base.requireSavePath')))
        } else if (!saveInfo.value.savePathIsDir) {
            callback(new Error(t('view.base.savePathIsDir')))
        } else {
            callback()
        }
    }

    function validateFileName(_: any, value: any, callback: any) {
        if (value === '') {
            callback(new Error(t('view.base.requireFileName')))
        } else if (!value.match(fileNameRegex)) {
            callback(new Error(t('view.base.invalidFileName')))
        } else {
            callback()
        }
    }

    return reactive<FormRules<WarpFileSaveInfo>>({
        savePath: [{validator: validateSavePath, trigger: "blur"}],
        warpFileName: [{validator: validateFileName, trigger: "blur"}]
    })
}