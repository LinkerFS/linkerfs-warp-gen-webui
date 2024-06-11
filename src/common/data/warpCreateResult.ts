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

import {Ref} from "vue";
import {CreateWarpResponse} from "@/common/api/warp.ts";
import {IconType, MessageDialogConfig} from "@/common/data/messageDialog.ts";
import {i18n} from '@/common/i18n'

const t = i18n.global.t
export const defaultTitle = t('Create Result')
export const setMessageConfig = (config: Ref<MessageDialogConfig>, result: CreateWarpResponse) => {
    if (result.failedFiles.length > 0) {
        if (result.warpFiles.length > 0 || result.hardlinkFiles.length > 0) {
            config.value.icon = IconType.WARNING
            config.value.description = t('Some file failed to create ')
        } else {
            config.value.icon = IconType.ERROR
            config.value.description = t('All failed to create')
        }
    } else {
        config.value.icon = IconType.SUCCESS
        config.value.description = t('file created successfully')
    }
}