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
import {FormRules} from "element-plus";
import {i18n} from "@/common/i18n";

const t = i18n.global.t

export class UdfWarpFileSaveInfo {
    udfFilePath: string = ""
    savePath: string = ""
    savePathIsDir: boolean = false
}

export function getUdfWarpFileSaveInfoValidator(saveInfo: Ref<UdfWarpFileSaveInfo>) {
    function validateUdfFilePath(_: any, value: any, callback: any) {
        if (value === '') {
            callback(new Error(t('view.udf.requireUdfFilePath')))
        } else {
            callback()
        }
    }

    function validateSavePath(_: any, value: any, callback: any) {
        if (value === '') {
            callback(new Error(t('view.udf.requireSavePath')))
        } else if (!saveInfo.value.savePathIsDir) {
            callback(new Error(t('view.udf.savePathIsDir')))
        } else {
            callback()
        }
    }

    return reactive<FormRules<UdfWarpFileSaveInfo>>({
        udfFilePath: [{validator: validateUdfFilePath, trigger: "blur"}],
        savePath: [{validator: validateSavePath, trigger: "blur"}]
    })
}