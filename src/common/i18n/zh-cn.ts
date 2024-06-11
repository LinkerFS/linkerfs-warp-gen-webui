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

const state = {
    success: '成功',
    warning: '警告',
    error: '错误',
    notice: '注意',
    failed: '失败'
}

const action = {
    save: '保存',
    edit: '编辑',
    remove: '删除',
    reset: '重置',
    add: '添加',
    confirm: '确认',
    cancel: '取消',
    generate: '生成',
    open: '打开'
}

const request = {
    request: '请求',
    failed: "@.capitalize:request.request{}@.lower:state.failed{':'} {reason}"
}

const warpTarget = {
    dataOffset: '数据偏移量',
    dataSize: '数据大小',
    filePath: '文件路径'
}

const warpCreateResult = {
    title: '创建结果',
    success: '文件创建成功',
    allFail: '所有文件均创建失败',
    someFail: '有些文件创建失败',
    createdHardlinks: '创建的硬链接:',
    createdWarpFiles: '创建的变形文件:',
    failedFiles: '创建失败的文件:'
}

const warpTargetCardComp = {
    target: '目标',
    maxUint64: '9223372036854775807',
    valueNegative: '数值不能为负',
    valueMoreThanInt64: '数值不能超过 @:component.warpTargetCard.maxUint64',
    requireFilePath: '@:data.warpTarget.filePath 为必填项',
    requireDataSize: '@:data.warpTarget.dataSize 为必填项',
    requireDataOffset: '@:data.warpTarget.dataOffset 为必填项',
    titleSelectFile: '请选择一个文件',
    mustBeFile: '必须是一个文件',
    dataSizePositive: '@:data.warpTarget.dataSize 必须大于0',
    dataOutOfRange: '目标数据超出了文件范围'
}

const baseView = {
    savePath: '文件路径',
    fileName: '文件名',
    addTarget: '添加目标',
    savePathPH: '请选择一个路径来保存变形文件',
    fileNamePH: '请输入文件名',
    requireSavePath: '@:view.base.savePath 为必填项',
    requireFileName: '@:view.fileName 为必填项',
    savePathIsDir: '@:view.base.savePath 必须是一个目录',
    invalidFileName: '文件名非法',
    plzSelectDir: '请选择一个目录',
    atLeastOneTarget: '至少添加一个目标'
}

const menu = {
    base: '基础'
}

const fileSelectorComp = {
    filesystem: '文件系统'
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

export const zh_cn = {
    action: action,
    component: component,
    data: data,
    request: request,
    state: state,
    view: view
}
