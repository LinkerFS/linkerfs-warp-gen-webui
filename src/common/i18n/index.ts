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

import {createI18n} from "vue-i18n";
import {en_us} from "@/common/i18n/en-us.ts";
import {zh_cn} from "@/common/i18n/zh-cn.ts";


const i18nConfig = {
    messages: {'en': en_us, 'zh-cn': zh_cn},
    legacy: false,
    fallbackLocale: 'en',
    locale: navigator.language.toLowerCase(),
    missingWarn: false,
    fallbackWarn: false
}
export const i18n = createI18n(i18nConfig)