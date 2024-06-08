<!--
  - linkerfs-warp-gen-webui: warp configuration file generator webui for project linkerfs
  - Copyright (C) 2024  kaedeair <kaedeair@outlook.com>
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
import {reactive, ref, Ref, toRefs} from "vue";
import WarpTargetCard from "@/components/WarpTargetCard.vue";
import {Plus} from "@element-plus/icons-vue";
import {WarpTarget} from "@/common/data/warpFile.ts";
import {EventBus} from "@/common/utils/mitt.ts";
import {FileInfo} from "@/common/data/fileTree.ts";
import {FileTreeFilters} from "@/common/data/fileSelector.ts";
import {setInputDisplayTail} from "@/common/utils/dom.ts";
import {ElInput, FormInstance, FormRules} from "element-plus";
import {fileNameRegex} from "@/common/utils/validator.ts";
import {createWarp, CreateWarpResponse, WarpConfig} from "@/common/api/warp.ts";
import {useI18n} from 'vue-i18n'
import MessageDialog from "@/components/MessageDialog.vue";
import {IconType, MessageDialogConfig} from "@/common/data/messageDialog.ts";
import WarpFileCreateResult from "@/components/WarpFileCreateResult.vue";

const {t} = useI18n({useScope: 'global'})
const warpFile = reactive({path: "", fileName: "", isDir: false})
const cardsData = reactive(Array<CardData>())
const pathInputRef = ref<InstanceType<typeof ElInput>>()
const disableAdd = ref(false)
const formRef = ref<FormInstance>()
const messageDialog = ref<MessageDialogConfig>({
  title: t('Create Result'),
  visible: false,
  icon: IconType.SUCCESS,
  description: ""
})
const createResult = ref<CreateWarpResponse>({
  warpFiles: [],
  hardlinkFiles: [],
  failedFiles: []
})

interface CardData {
  seq: Ref<number>
  target: Ref<WarpTarget>
  isDisable: Ref<boolean>
  fileTotalSize: Ref<bigint>
}

const validateRule = reactive<FormRules<typeof warpFile>>({
  path: [{validator: validatePath, trigger: "blur"}],
  fileName: [{validator: validateFileName, trigger: "blur"}]
})

const fileCallback = (fileInfo: FileInfo | null) => {
  if (fileInfo) {
    warpFile.path = fileInfo.fullPath
    warpFile.isDir = fileInfo.size === BigInt(0)
    setInputDisplayTail(pathInputRef)
  }
  EventBus.off('FileSelected', fileCallback)
}

function openFile() {
  EventBus.on('FileSelected', fileCallback)
  EventBus.emit('SelectFile', {
    title: t("Please select a dir"),
    filter: FileTreeFilters.dirFilter
  })
}

function generateWarpFile(form: FormInstance | undefined) {
  if (!form) return
  form.validate((valid) => {
    if (valid) {
      let config: WarpConfig = {
        fileName: warpFile.fileName,
        warpTargets: cardsData.map(val => val.target)
      }
      createWarp(warpFile.path, [config]).then(data => {
        createResult.value = data as unknown as CreateWarpResponse
        if (createResult.value.failedFiles.length > 0) {
          if (createResult.value.warpFiles.length > 0 || createResult.value.hardlinkFiles.length > 0) {
            messageDialog.value.icon = IconType.WARNING
            messageDialog.value.description = t('Some file failed to create ')
          } else {
            messageDialog.value.icon = IconType.ERROR
            messageDialog.value.description = t('All failed to create')
          }
        } else {
          messageDialog.value.icon = IconType.SUCCESS
          messageDialog.value.description = t('file created successfully')
        }
        messageDialog.value.visible = true
      })
    }
  })
}

function addTarget() {
  let cardData = {
    seq: cardsData.length + 1,
    target: new WarpTarget,
    isDisable: false,
    fileTotalSize: BigInt(0)
  }
  cardsData.push(reactive(cardData))
}

function remove(seq: number) {
  for (let i = seq; i < cardsData.length; i++)
    cardsData[i].seq -= 1
  cardsData.splice(seq - 1, 1)
}

function save(seq: number) {
  lockOtherTargets(seq, false)
}

function edit(seq: number) {
  lockOtherTargets(seq, true)
}

function lockOtherTargets(seq: number, isLock: boolean) {
  for (let i = 0; i < cardsData.length; i++) {
    if (cardsData[i].seq != seq) {
      cardsData[i].isDisable = isLock
    }
  }
  disableAdd.value = isLock
}

function validatePath(_: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error(t('Save Path required')))
  } else if (!warpFile.isDir) {
    callback(new Error(t('Save path must be a directory')))
  } else {
    callback()
  }
}

function validateFileName(_: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error(t('File name required')))
  } else if (!value.match(fileNameRegex)) {
    callback(new Error(t('File name is invalid')))
  } else if (cardsData.length === 0) {
    callback(new Error(t('Please add target below')))
  } else {
    callback()
  }
}
</script>
<template>
  <el-form ref="formRef" :model="warpFile" :rules="validateRule" label-position="right" label-width="auto">
    <el-row class="warp-row" justify="start" align="middle">
      <el-form-item :label="$t('Warp File Path') + ':'" class="warp-form-item" prop="path">
        <el-col :span="12">
          <el-input
              class="warp-input"
              v-model="warpFile.path"
              ref="pathInputRef"
              disabled
              :placeholder="$t('Please select the path to save wrap file')">
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="openFile" type="primary" class="warp-button">{{ $t("Open") }}</el-button>
        </el-col>
      </el-form-item>
    </el-row>
    <el-row class="warp-row" justify="start" align="middle">
      <el-form-item :label="$t('Warp File Name') + ':'" class="warp-form-item" prop="fileName">
        <el-col :span="12">
          <el-input
              class="warp-input"
              v-model="warpFile.fileName"
              clearable
              :placeholder="$t('Please input file name')">
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="generateWarpFile(formRef)" type="success" class="warp-button">{{
              $t("Generate")
            }}
          </el-button>
        </el-col>
      </el-form-item>
    </el-row>
  </el-form>

  <div style="padding-top: 20px">
    <el-tooltip
        effect="light"
        :content="$t('Add Target')"
        placement="top">
      <el-button type="primary" :icon="Plus" @click="addTarget" :disabled="disableAdd" circle></el-button>
    </el-tooltip>
  </div>
  <div>
    <el-space style="padding-top: 20px;" alignment="normal" wrap>
      <div v-for="item in cardsData" :key="cardsData.length" class="card-item">
        <warp-target-card v-bind="toRefs(item)" @save="save" @edit="edit" @remove="remove">
        </warp-target-card>
      </div>
    </el-space>
  </div>
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
