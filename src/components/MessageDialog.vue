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
import {getIconTitle, MessageDialogState} from "@/common/data/messageDialog.ts";
import {computed, toRefs} from "vue";

const prop = defineProps<{ state: MessageDialogState }>();
const state = toRefs(prop.state)
const resultTitle = computed(() => getIconTitle(state.icon.value))
</script>
<template>
  <el-dialog v-model="state.visible.value" :title="state.title.value" :close-on-click-modal=false>
    <el-row justify="start" align="middle" :gutter="25">
      <el-col :span="2" style="max-width: min-content">
        <el-result :icon="state.icon.value" :title="resultTitle" :sub-title="state.description.value"
                   style="max-width: fit-content">
        </el-result>
      </el-col>
      <el-col :span="12" style="overflow: auto;max-height: 60vh;">
        <slot></slot>
      </el-col>
    </el-row>
    <el-row :justify="'end'" :align="'middle'" style="padding-top: 25px">
      <el-button type="primary" @click="state.visible.value=false">{{ $t('action.confirm') }}</el-button>
    </el-row>
  </el-dialog>
</template>
<style scoped>

</style>