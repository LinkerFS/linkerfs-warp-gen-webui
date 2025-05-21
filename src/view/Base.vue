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
import {ElForm, ElInput, ElMessage, FormInstance} from "element-plus";
import {createWarp, CreateWarpResponse, WarpConfig} from "@/common/api/warp.ts";
import {useI18n} from 'vue-i18n'
import FileSelector from "@/components/FileSelector.vue";
import {CardData} from "@/common/data/warpTargetCard.ts";
import {getWarpFileSaveInfoValidator, WarpFileSaveInfo} from "@/common/data/warpFile.ts";
import CreateWarpResultDialog from "@/components/CreateWarpResultDialog.vue";

const {t} = useI18n({useScope: 'global'})
const saveInfo = ref(new WarpFileSaveInfo)
const cardsData = reactive(Array<CardData>())
const pathInputRef = useTemplateRef('pathInputRef')
const formRef = ref<FormInstance>()
const currentEditingSeq = ref(0)
const fileSelector = useTemplateRef('fileSelector')
provide("currentEditingSeq", currentEditingSeq)
provide(fileSelectorSymbol, fileSelector)
const resultDialogRef = useTemplateRef('resultDialog')
const generating = ref<boolean>(false);
const validateRule = getWarpFileSaveInfoValidator(saveInfo)

function openFile() {
  fileSelector.value?.open({
    title: t('view.base.plzSelectDir'),
    filter: FileTreeFilters.dirFilter,
    callBack: (fileInfo: FileInfo) => {
      saveInfo.value.savePath = fileInfo.fullPath
      saveInfo.value.savePathIsDir = fileInfo.size === BigInt(0)
      setInputDisplayTail(pathInputRef)
    }
  })
}

function generateWarpFile() {
  if (cardsData.length === 0) {
    ElMessage({
      message: t('view.base.atLeastOneTarget'),
      type: "error"
    })
    return
  }
  formRef.value!.validate((valid) => {
    if (valid) {
      let config: WarpConfig = {
        fileName: saveInfo.value.warpFileName,
        warpTargets: cardsData.map(val => val.warpTarget)
      }
      generating.value = true
      createWarp(saveInfo.value.savePath, [config]).then(data => {
        generating.value = false
        resultDialogRef.value?.open(data as unknown as CreateWarpResponse)
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

</script>
<template>
  <el-form ref="formRef" :model="saveInfo" :rules="validateRule" label-position="right" label-width="auto">
    <el-row class="warp-row" justify="start" align="middle">
      <el-form-item :label="$t('view.base.savePath') + ':'" class="warp-form-item" prop="savePath">
        <el-col :span="12">
          <el-input
              class="warp-input"
              v-model="saveInfo.savePath"
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
      <el-form-item :label="$t('view.base.fileName') + ':'" class="warp-form-item" prop="warpFileName">
        <el-col :span="12">
          <el-input
              class="warp-input"
              v-model="saveInfo.warpFileName"
              clearable
              :placeholder="$t('view.base.fileNamePH')">
          </el-input>
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
  <CreateWarpResultDialog ref="resultDialog"></CreateWarpResultDialog>
</template>
<style scoped>
@import "@/assets/css/warp.css";
</style>
