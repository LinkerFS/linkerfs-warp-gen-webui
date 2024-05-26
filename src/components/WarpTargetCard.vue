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
import {Ref, ref, toRef} from "vue";
import {WarpTarget} from "@/common/data/warpFile.ts";
import {Check, Delete, Edit} from "@element-plus/icons-vue";
import {EventBus} from "@/common/utils/mitt.ts";
import {FileInfo} from "@/common/data/file.ts";


const props = defineProps<{
  target: Ref<WarpTarget>,
  seq: Ref<number>,
  isDisable: Ref<boolean>,
  fileTotalSize: Ref<number>
}>()
const emit = defineEmits<{
  edit: [seq: number],
  save: [seq: number],
  remove: [seq: number]
}>()
const seq = toRef(props.seq)
const warpTarget = toRef(props.target)
const fileTotalSize = toRef(props.fileTotalSize)
const isDisable = toRef(props.isDisable)
const isEditable = ref(false)

const fileCallback = (fileInfo: FileInfo) => {
  warpTarget.value.filePath = fileInfo.fullPath
  fileTotalSize.value = fileInfo.size
  EventBus.off('FileSelected', fileCallback)
}

function selectFile() {
  EventBus.on('FileSelected', fileCallback)
  EventBus.emit('SelectFile', {title: "Please select a File"})
}

function edit() {
  isEditable.value = true
  emit('edit', seq.value)
}

function save() {
  isEditable.value = false
  emit('save', seq.value)
}
</script>
<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>Part {{ seq }}</span>
      </div>
    </template>
    <el-form label-position="right" label-width="auto" style="max-width: 400px">
      <el-form-item :label="$t('File Path:')">
        <el-input v-model="warpTarget.filePath" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Data Offset')+'(Byte):'">
        <el-input v-model="warpTarget.dataOffset" :disabled="!isEditable" :type="'number'"></el-input>
      </el-form-item>
      <el-form-item :label="$t('Data Size')+'(Byte):'">
        <el-input v-model="warpTarget.sizeToRead" :disabled="!isEditable" :type="'number'"></el-input>
      </el-form-item>
      <el-form-item v-if="isEditable">
        <el-button @click="selectFile" type="primary"
                   style="margin-left: auto;margin-right: auto;width: 50%">
          {{ "Open" }}
        </el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button-group style="display:flex;justify-content: end">
        <el-tooltip
            v-if="isEditable"
            effect="light"
            :content="$t('Save')"
            placement="top"
        >
          <el-button type="success" :icon="Check" @click="save" :disabled="isDisable"></el-button>
        </el-tooltip>
        <el-tooltip
            v-if="!isEditable"
            effect="light"
            :content="$t('Edit')"
            placement="top"
        >
          <el-button type="primary" :icon="Edit" @click="edit" :disabled="isDisable"></el-button>
        </el-tooltip>
        <el-tooltip
            v-if="!isEditable"
            effect="light"
            :content="$t('Remove')"
            placement="top"
        >
          <el-button type="danger" :icon="Delete" @click="emit('remove',seq)" :disabled="isDisable"></el-button>
        </el-tooltip>
      </el-button-group>
    </template>
  </el-card>
</template>
<style scoped>
</style>