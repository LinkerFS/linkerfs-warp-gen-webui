<!--
  - linkerfs-warp-gen-webui: warp configuration file generator webui for project linkerfs
  - Copyright (C) 2024-2025  kaedeair <kaedeair@outlook.com>
  -
  - This file is part of linkerfs-warp-gen-webui.
  -
  - linkerfs-warp-gen-webui is free software: you can redistribute it and/or modify
  - it under the terms of the GNU Affero General Public License as published
  - by the Free Software Foundation, either version 3 of the License,
  - or (at your option) any later version.
  -
  - linkerfs-warp-gen-webui is distributed in the hope that it will be useful,but
  - WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
  - or FITNESS FOR A PARTICULAR PURPOSE.
  -
  - See the GNU Affero General Public License for more details.
  -
  - You should have received a copy of the GNU Affero General Public License
  - along with linkerfs-warp-gen-webui. If not, see <https://www.gnu.org/licenses/>.
  -->

<script lang="ts" setup>

import {ElForm, ElInput, ElMessage} from "element-plus";
import {ref, useTemplateRef} from "vue";
import {getUdfWarpFileSaveInfoValidator, UdfWarpFileSaveInfo} from "@/common/data/udfWarpFile.ts";
import UdfContent from "@/components/UdfContent.vue";
import {assignFullPath, FileTree} from "@/common/data/fileTree.ts";
import FileSelector from "@/components/FileSelector.vue";
import {FileTreeFilters} from "@/common/data/fileSelector.ts";
import {listUDF, ListUdfResp} from "@/common/api/file.ts";
import {useI18n} from "vue-i18n";
import {setInputDisplayTail} from "@/common/utils/dom.ts";
import CreateWarpResultDialog from "@/components/CreateWarpResultDialog.vue";
import {createUdfWarp, CreateWarpResponse} from "@/common/api/warp.ts";

const {t} = useI18n({useScope: 'global'})
const generating = ref<boolean>(false)
const udfWarpSaveInfo = ref(new UdfWarpFileSaveInfo)
const treeData = ref<FileTree[]>([])
const volumeId = ref("")
const fileSelectorRef = useTemplateRef('fileSelector')
const udfFileInputRef = useTemplateRef('udfFileInputRef')
const savePathInputRef = useTemplateRef('savePathInputRef')
const udfContentRef = useTemplateRef('udfContentRef')
const formRef = useTemplateRef('formRef')
const resultDialogRef = useTemplateRef('resultDialog')
const validateRule = getUdfWarpFileSaveInfoValidator(udfWarpSaveInfo)

function selectUdfFile() {
  fileSelectorRef.value?.open(
      {
        title: t('view.udf.udfFilePathPH'),
        filter: FileTreeFilters.isoFilter,
        callBack(fileInfo) {
          if (fileInfo.size === null) {
            ElMessage({
              message: t('view.udf.objectNotFile'),
              type: "error"
            })
            return
          }
          listUDF(fileInfo.fullPath).then((response) => {
            const data = response as unknown as ListUdfResp
            data.fileTree.fullPath = data.fileTree.name
            assignFullPath(data.fileTree)
            treeData.value = [data.fileTree]
            volumeId.value = data.volumeId
            udfWarpSaveInfo.value.udfFilePath = fileInfo.fullPath;
            setInputDisplayTail(udfFileInputRef)
          })
        }
      }
  )
}

function selectSavePath() {
  fileSelectorRef.value?.open(
      {
        title: t('view.udf.plzSelectDir'),
        filter: FileTreeFilters.dirFilter,
        callBack(fileInfo) {
          udfWarpSaveInfo.value.savePath = fileInfo.fullPath
          udfWarpSaveInfo.value.savePathIsDir = fileInfo.size === null
          setInputDisplayTail(savePathInputRef)
        }
      }
  )
}

function generateWarpFile() {
  let selectedTargets = udfContentRef.value?.getSelectTargets() ?? []
  if (selectedTargets.length === 0) {
    ElMessage({
      message: t('view.udf.atLeastOneTarget'),
      type: "error"
    })
    return
  }
  formRef.value!.validate((valid) => {
    if (valid) {
      generating.value = true
      createUdfWarp(udfWarpSaveInfo.value.udfFilePath, udfWarpSaveInfo.value.savePath, selectedTargets).then(data => {
        generating.value = false
        resultDialogRef.value?.open(data as unknown as CreateWarpResponse)
      }, () => {
        generating.value = false
      })
    }
  })
}
</script>

<template>
  <el-form ref='formRef' :model="udfWarpSaveInfo" :rules="validateRule" label-position="right" label-width="auto">
    <el-row align="middle" class="warp-row" justify="start">
      <el-form-item :label="$t('view.udf.udfFilePath') + ':'" class="warp-form-item" prop="udfFilePath">
        <el-col :span="12">
          <el-input
              ref="udfFileInputRef"
              v-model="udfWarpSaveInfo.udfFilePath"
              :placeholder="$t('view.udf.udfFilePathPH')"
              class="warp-input"
              disabled>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="warp-button" type="primary" @click="selectUdfFile">{{ $t('action.open') }}</el-button>
        </el-col>
      </el-form-item>
    </el-row>
    <el-row align="middle" class="warp-row" justify="start">
      <el-form-item :label="$t('view.udf.savePath') + ':'" class="warp-form-item" prop="savePath">
        <el-col :span="12">
          <el-input
              ref="savePathInputRef"
              v-model="udfWarpSaveInfo.savePath"
              :placeholder="$t('view.udf.savePathPH')"
              class="warp-input"
              disabled
          >
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button class="warp-button" type="primary" @click="selectSavePath">{{ $t('action.open') }}</el-button>
        </el-col>
        <el-col :span="4">
          <el-button :loading="generating" class="warp-button" type="success" @click="generateWarpFile">{{
              $t('action.generate')
            }}
          </el-button>
        </el-col>
      </el-form-item>
    </el-row>
  </el-form>
  <UdfContent ref="udfContentRef" :treeData="treeData" :volume-id="volumeId"></UdfContent>
  <FileSelector ref="fileSelector"></FileSelector>
  <CreateWarpResultDialog ref="resultDialog"></CreateWarpResultDialog>
</template>

<style scoped>
@import "@/assets/css/warp.css";
</style>