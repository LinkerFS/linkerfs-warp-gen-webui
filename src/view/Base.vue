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
import {reactive, Ref, ref, toRefs} from "vue";
import WarpTargetCard from "@/components/WarpTargetCard.vue";
import {Plus} from "@element-plus/icons-vue";
import {WarpTarget} from "@/data/warpFile.ts";

const warpSavePath = ref('')
const cardsData = reactive(Array<CardData>())

interface CardData {
  seq: Ref<number>
  target: Ref<WarpTarget>
  isDisable: Ref<boolean>
  fileTotalSize: Ref<number>
}

function openFile() {

}

function generateWarpFile() {

}

function addTarget() {
  let cardData = {
    seq: cardsData.length + 1,
    target: new WarpTarget,
    isDisable: false,
    fileTotalSize: 0
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
  <el-form :inline="true" label-position="right">
    <el-form-item :label="$t('Warp File Path')+':'" style="width: 60%;max-width: 500px">
      <el-input
          v-model="warpSavePath"
          disabled
          :placeholder="$t('Please select the path to save wrap file.')">
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button @click="openFile" type="primary" class="warp-file">{{ $t("Open") }}</el-button>
    </el-form-item>
    <el-form-item>
      <el-button @click="generateWarpFile" type="success" class="warp-file">{{ $t("Generate") }}</el-button>
    </el-form-item>
  </el-form>
  <div>
    <el-tooltip
        effect="light"
        :content="$t('Add Target')"
        placement="top"
    >
      <el-button type="primary" :icon="Plus" @click="addTarget" circle></el-button>
    </el-tooltip>
  </div>
  <div>
    <el-space style="padding-top: 10px" wrap>
      <div v-for="item in cardsData" :key="cardsData.length" class="card-item">
        <warp-target-card v-bind="toRefs(item)" @save="save" @edit="edit" @remove="remove">
        </warp-target-card>
      </div>
    </el-space>
  </div>
</template>
<style scoped>
.warp-file {
  width: 90px;
}
</style>
