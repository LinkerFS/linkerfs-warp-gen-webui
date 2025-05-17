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

<script setup lang="ts">
import {provide, reactive, ref, useTemplateRef} from "vue";
import WarpTargetCard from "@/components/WarpTargetCard.vue";
import {Plus} from "@element-plus/icons-vue";
import {WarpTarget} from "@/common/data/warpTarget.ts";
import {FileInfo} from "@/common/data/fileTree.ts";
import {FileTreeFilters, fileSelectorSymbol} from "@/common/data/fileSelector.ts";
import {setInputDisplayTail} from "@/common/utils/dom.ts";
import {ElForm, ElInput, ElMessage, FormInstance, FormRules} from "element-plus";
import {fileNameRegex} from "@/common/utils/validator.ts";
import {createWarp, CreateWarpResponse, WarpConfig} from "@/common/api/warp.ts";
import {useI18n} from 'vue-i18n'
import MessageDialog from "@/components/MessageDialog.vue";
import {IconType, MessageDialogConfig} from "@/common/data/messageDialog.ts";
import WarpFileCreateResult from "@/components/WarpFileCreateResult.vue";
import {defaultTitle, setMessageConfig} from "@/common/data/warpCreateResult.ts";
import FileSelector from "@/components/FileSelector.vue";
import {CardData} from "@/common/data/warpTargetCard.ts";

const {t} = useI18n({useScope: 'global'})
const warpFile = reactive({path: "", fileName: "", isDir: false})
const cardsData = reactive(Array<CardData>())
const pathInputRef = useTemplateRef('pathInputRef')
const formRef = ref<FormInstance>()
const currentEditingSeq = ref(0)
const fileSelector = useTemplateRef('fileSelector')
provide("currentEditingSeq", currentEditingSeq)
provide(fileSelectorSymbol, fileSelector)
const messageDialog = ref<MessageDialogConfig>({
  title: defaultTitle,
  visible: false,
  icon: IconType.SUCCESS,
  description: ""
})
const createResult = ref<CreateWarpResponse>({
  warpFiles: [],
  hardlinkFiles: [],
  failedFiles: []
})
const generating = ref<boolean>(false);
const validateRule = reactive<FormRules<typeof warpFile>>({
  path: [{validator: validatePath, trigger: "blur"}],
  fileName: [{validator: validateFileName, trigger: "blur"}]
})

function openFile() {
  fileSelector.value?.open({
    title: t('view.base.plzSelectDir'),
    filter: FileTreeFilters.dirFilter,
    callBack: (fileInfo: FileInfo) => {
      warpFile.path = fileInfo.fullPath
      warpFile.isDir = fileInfo.size === BigInt(0)
      setInputDisplayTail(pathInputRef)
    }
  })
}

function generateWarpFile(form: FormInstance | undefined) {
  if (!form) return
  form.validate((valid) => {
    if (valid) {
      if (cardsData.length === 0) {
        ElMessage({
          message: t('view.base.atLeastOneTarget'),
          type: "error"
        })
        return
      }
      let config: WarpConfig = {
        fileName: warpFile.fileName,
        warpTargets: cardsData.map(val => val.warpTarget)
      }
      generating.value = true
      createWarp(warpFile.path, [config]).then(data => {
        generating.value = false
        createResult.value = data as unknown as CreateWarpResponse
        setMessageConfig(messageDialog, createResult.value)
        messageDialog.value.visible = true
      }, () => {
        generating.value = false
      })
    }
  })
}

function addTarget() {
  let cardData = {
    seq: cardsData.length + 1,
    warpTarget: new WarpTarget,
    isDisable: false,
    fileTotalSize: BigInt(0)
  }
  cardsData.push(cardData)
}

function remove(seq: number) {
  for (let i = seq; i < cardsData.length; i++)
    cardsData[i].seq -= 1
  cardsData.splice(seq - 1, 1)
}

function validatePath(_: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error(t('view.base.requireSavePath')))
  } else if (!warpFile.isDir) {
    callback(new Error(t('view.base.savePathIsDir')))
  } else {
    callback()
  }
}

function validateFileName(_: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error(t('view.base.fileName')))
  } else if (!value.match(fileNameRegex)) {
    callback(new Error(t('view.base.invalidFileName')))
  } else {
    callback()
  }
}
</script>
<template>
  <el-form ref="formRef" :model="warpFile" :rules="validateRule" label-position="right" label-width="auto">
    <el-row class="warp-row" justify="start" align="middle">
      <el-form-item :label="$t('view.base.savePath') + ':'" class="warp-form-item" prop="path">
        <el-col :span="12">
          <el-input
              class="warp-input"
              v-model="warpFile.path"
              ref="pathInputRef"
              disabled
              :placeholder="$t('view.base.savePathPH')">
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="openFile" type="primary" class="warp-button">{{ $t('action.open') }}</el-button>
        </el-col>
      </el-form-item>
    </el-row>
    <el-row class="warp-row" justify="start" align="middle">
      <el-form-item :label="$t('view.base.fileName') + ':'" class="warp-form-item" prop="fileName">
        <el-col :span="12">
          <el-input
              class="warp-input"
              v-model="warpFile.fileName"
              clearable
              :placeholder="$t('view.base.fileNamePH')">
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="generateWarpFile(formRef)" type="success" class="warp-button" :loading="generating">{{
              $t('action.generate')
            }}
          </el-button>
        </el-col>
      </el-form-item>
    </el-row>
  </el-form>

  <div style="padding-top: 20px">
    <el-tooltip
        effect="light"
        :content="$t('view.base.addTarget')"
        placement="top">
      <el-button type="primary" :icon="Plus" @click="addTarget" :disabled="currentEditingSeq!=0" circle></el-button>
    </el-tooltip>
  </div>
  <div>
    <el-space style="padding-top: 20px;" alignment="normal" wrap>
      <div v-for="idx in cardsData.keys()" :key="idx" class="card-item">
        <warp-target-card v-model="cardsData[idx]" @remove="remove">
        </warp-target-card>
      </div>
    </el-space>
  </div>
  <FileSelector ref="fileSelector"></FileSelector>
  <MessageDialog :config="messageDialog">
    <WarpFileCreateResult v-bind="createResult"></WarpFileCreateResult>
  </MessageDialog>
</template>
<style scoped>
.warp-button {
  width: 90px;
  margin-left: 25px;
}

.warp-input {
  max-width: 500px;
}

.warp-row {
  padding: 10px;
  max-width: 1200px;
}

.warp-form-item {
  width: 95%;
  max-width: 900px;
}
</style>
