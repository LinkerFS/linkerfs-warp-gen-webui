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

import {i18n} from '@/common/i18n'

const t = i18n.global.t

export interface MessageDialogState {
    title: string
    visible: boolean
    icon: IconType
    description: string
}

export enum IconType {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info',
    WARNING = 'warning'
}

export const getIconTitle = (type: IconType) => {
    switch (type) {
        case IconType.SUCCESS:
            return t('state.success')
        case IconType.ERROR:
            return t('state.error')
        case IconType.INFO:
            return t('state.notice')
        case IconType.WARNING:
            return t('state.warning')
    }
}