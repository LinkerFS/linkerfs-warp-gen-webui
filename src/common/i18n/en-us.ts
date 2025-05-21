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

const state = {
    success: 'Success',
    warning: 'Warning',
    error: 'Error',
    notice: 'Notice',
    failed: 'Failed'
}

const action = {
    save: 'Save',
    edit: 'Edit',
    remove: 'Remove',
    reset: 'reset',
    add: 'Add',
    confirm: 'Confirm',
    cancel: 'Cancel',
    generate: 'Generate',
    open: 'Open'
}

const request = {
    request: 'request',
    failed: "@.capitalize:request.request @.lower:state.failed{':'} {reason}"
}

const warpTarget = {
    dataOffset: 'Data Offset',
    dataSize: 'Data Size',
    filePath: 'File Path'
}

const warpCreateResult = {
    title: 'Create Result',
    success: 'File(s) created successfully',
    allFail: 'All failed to create',
    someFail: 'Some file(s) failed to create',
    createdHardlinks: 'Created hardlinks:',
    createdWarpFiles: 'Created warp files:',
    failedFiles: 'Failed to create files:'
}

const warpTargetCardComp = {
    target: 'Target',
    maxUint64: '9223372036854775807',
    valueNegative: 'value can not be negative',
    valueMoreThanInt64: 'value can not more than @:component.warpTargetCard.maxUint64',
    requireFilePath: '@:data.warpTarget.filePath required',
    requireDataSize: '@:data.warpTarget.dataSize required',
    requireDataOffset: '@:data.warpTarget.dataOffset required',
    titleSelectFile: 'Please select a file',
    mustBeFile: 'Must be a File',
    dataSizePositive: '@:data.warpTarget.dataSize must more than 0',
    dataOutOfRange: 'data is out of file range'
}

const baseView = {
    savePath: 'Warp file path',
    fileName: 'Warp file name',
    addTarget: 'Add Target',
    savePathPH: 'Please select the path to save warp file',
    fileNamePH: 'Please input the file name',
    requireSavePath: '@:view.base.savePath required',
    requireFileName: '@:view.base.fileName required',
    savePathIsDir: '@:view.base.savePath must be a directory',
    invalidFileName: 'File name is invalid',
    plzSelectDir: 'Please select a directory',
    atLeastOneTarget: 'Add at least one target'
}

const menu = {
    base: 'Base',
    udfFile: 'UDF File'
}

const fileSelectorComp = {
    filesystem: 'File System'
}

const view = {
    menu: menu,
    base: baseView
}

const component = {
    fileSelector: fileSelectorComp,
    warpTargetCard: warpTargetCardComp
}

const data = {
    warpTarget: warpTarget,
    warpCreateResult: warpCreateResult,
}

export const en_us = {
    action: action,
    component: component,
    data: data,
    request: request,
    state: state,
    view: view
}
