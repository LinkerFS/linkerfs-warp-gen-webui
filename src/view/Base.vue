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
import {ElInput} from "element-plus";

const warpFile = reactive({path: "", fileName: ""})
const cardsData = reactive(Array<CardData>())
const pathInputRef = ref<InstanceType<typeof ElInput>>()

interface CardData {
  seq: Ref<number>
  target: Ref<WarpTarget>
  isDisable: Ref<boolean>
  fileTotalSize: Ref<bigint>
}

const fileCallback = (fileInfo: FileInfo | null) => {
  if(fileInfo)
  {
    warpFile.path = fileInfo.fullPath
    setInputDisplayTail(pathInputRef)
  }
  EventBus.off('FileSelected', fileCallback)
}

function openFile() {
  EventBus.on('FileSelected', fileCallback)
  EventBus.emit('SelectFile', {
    title: "Please select a dir",
    filter: FileTreeFilters.dirFilter
  })
}

function generateWarpFile() {

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
}

</script>
<template>
  <el-row class="warp-row" justify="start" align="middle">
    <el-col :span="3">
      <el-text truncated line-clamp="1">{{ $t('Warp File Path') + ':' }}</el-text>
    </el-col>
    <el-col :span="8">
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
  </el-row>
  <el-row class="warp-row" justify="start" align="middle">
    <el-col :span="3">
      <el-text truncated line-clamp="1">{{ $t('Warp File Name') + ':' }}</el-text>
    </el-col>
    <el-col :span="8">
      <el-input
          class="warp-input"
          v-model="warpFile.fileName"
          clearable
          :placeholder="$t('Please input file name')">
      </el-input>
    </el-col>
    <el-col :span="4">
      <el-button @click="generateWarpFile" type="success" class="warp-button">{{ $t("Generate") }}</el-button>
    </el-col>
  </el-row>

  <div style="padding-top: 20px">
    <el-tooltip
        effect="light"
        :content="$t('Add Target')"
        placement="top"
    >
      <el-button type="primary" :icon="Plus" @click="addTarget" circle></el-button>
    </el-tooltip>
  </div>
  <div>
    <el-space style="padding-top: 20px" wrap>
      <div v-for="item in cardsData" :key="cardsData.length" class="card-item">
        <warp-target-card v-bind="toRefs(item)" @save="save" @edit="edit" @remove="remove">
        </warp-target-card>
      </div>
    </el-space>
  </div>
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
</style>
