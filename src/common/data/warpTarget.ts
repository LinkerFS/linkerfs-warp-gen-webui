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

import {CardData} from "@/common/data/warpTargetCard.ts";
import {reactive, Ref} from "vue";
import {FormRules} from "element-plus";
import {i18n} from '@/common/i18n'

const t = i18n.global.t

export class WarpTarget {
    filePath: string = ""
    dataOffset: string = "0"
    dataSize: string = "0"
}

export function getWarpTargetValidator(cardData: Ref<CardData>) {

    function validateSizeRange(_: any, value: any, callback: any) {
        if (BigInt(value) < BigInt(0)) {
            return callback(new Error(t('component.warpTargetCard.valueNegative')))
        } else if (BigInt(value) > BigInt("9223372036854775807")) {
            return callback(new Error(t('component.warpTargetCard.valueMoreThanInt64')))
        }
        callback()
    }

    function validateFilePath(_: any, value: any, callback: any) {
        if (value === '') {
            return callback(new Error(t('component.warpTargetCard.requireFilePath')))
        } else if (cardData.value.fileTotalSize === BigInt(0)) {
            return callback(new Error(t('component.warpTargetCard.mustBeFile')))
        }
        callback()
    }

    function validateDataOffset(_: any, value: any, callback: any) {
        if (cardData.value.warpTarget.filePath.length > 0) {
            if (value === '') {
                return callback(new Error(t('component.warpTargetCard.requireDataOffset')))
            } else if (BigInt(value) >= cardData.value.fileTotalSize) {
                return callback(new Error(t('component.warpTargetCard.dataOutOfRange')))
            }
        }
        callback()
    }

    function validateDataSize(_: any, value: any, callback: any) {
        if (cardData.value.warpTarget.filePath.length > 0) {
            if (value === '') {
                return callback(new Error(t('component.warpTargetCard.requireDataSize')))
            } else if (BigInt(cardData.value.warpTarget.dataSize) === BigInt(0)) {
                return callback(new Error(t('component.warpTargetCard.dataSizePositive')))
            } else if (BigInt(cardData.value.warpTarget.dataOffset) + BigInt(cardData.value.warpTarget.dataSize) > cardData.value.fileTotalSize) {
                return callback(new Error(t('component.warpTargetCard.dataOutOfRange')))
            }
        }
        callback()
    }

    return reactive<FormRules<WarpTarget>>({
        filePath: [{validator: validateFilePath, trigger: 'blur'}],
        dataOffset: [{validator: validateDataOffset, trigger: 'blur'}, {validator: validateSizeRange, trigger: 'blur'}],
        dataSize: [{validator: validateDataSize, trigger: 'blur'}, {validator: validateSizeRange, trigger: 'blur'}]
    })

}