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
import {computed, inject, ModelRef, Ref, ref, useTemplateRef} from "vue";
import {getWarpTargetValidator} from "@/common/data/warpTarget.ts";
import {Check, Close, Delete, Edit} from "@element-plus/icons-vue";
import {FileInfo} from "@/common/data/fileTree.ts";
import {ElInput, FormInstance} from "element-plus";
import {setInputDisplayTail} from "@/common/utils/dom.ts";
import {useI18n} from 'vue-i18n'
import {fileSelectorSymbol, FileTreeFilters} from "@/common/data/fileSelector.ts"
import {CardData} from "@/common/data/warpTargetCard.ts";

const {t} = useI18n({useScope: 'global'})
const cardData = defineModel<CardData>() as ModelRef<CardData>
const emit = defineEmits<{
  remove: [seq: number]
}>()
const pathInputRef = useTemplateRef('pathInputRef')
const targetNumStr = computed(() => {
  return `${t('component.warpTargetCard.target')} ${cardData.value.seq.toString()}`
})
const formRef = ref<FormInstance>()
const validateRule = getWarpTargetValidator(cardData)
const currentEditingSeq = inject("currentEditingSeq") as Ref<number>
const fileSelector = inject(fileSelectorSymbol)

function isEditable() {
  return currentEditingSeq.value == cardData.value.seq
}

function isDisabled() {
  if (currentEditingSeq.value == 0)
    return false
  return !isEditable()
}

function selectFile() {
  fileSelector?.value?.open({
    title: t('component.warpTargetCard.titleSelectFile'),
    filter: FileTreeFilters.noFilter,
    callBack: (fileInfo: FileInfo) => {
      cardData.value.warpTarget.filePath = fileInfo.fullPath
      cardData.value.fileTotalSize = fileInfo.size
      setInputDisplayTail(pathInputRef)
    }
  })
}

function edit() {
  currentEditingSeq.value = cardData.value.seq
}

function save() {
  currentEditingSeq.value = 0
}

function submit(form: FormInstance | undefined) {
  if (!form) return
  form.validate((valid) => {
    if (valid) {
      save()
    }
  })
}

function reset(form: FormInstance | undefined) {
  if (!form) return
  form.resetFields()
  save()
}
</script>
<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>{{ targetNumStr }}</span>
      </div>
    </template>
    <el-form ref="formRef" :model="cardData.warpTarget" :rules="validateRule" label-position="right" label-width="auto"
             style="max-width: 400px">
      <el-form-item :label="$t('data.warpTarget.filePath')+':'" prop="filePath">
        <el-input v-model="cardData.warpTarget.filePath" ref="pathInputRef" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('data.warpTarget.dataOffset')+':'" prop="dataOffset">
        <el-input v-model="cardData.warpTarget.dataOffset" :disabled="!isEditable()" :type="'number'"
                  @blur="formRef?.validateField('dataSize')">
          <template #append>Byte</template>
        </el-input>
      </el-form-item>
      <el-form-item :label="$t('data.warpTarget.dataSize')+':'" prop="dataSize">
        <el-input v-model="cardData.warpTarget.dataSize" :disabled="!isEditable()" :type="'number'">
          <template #append>Byte</template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="isEditable()">
        <el-button @click="selectFile" type="primary"
                   style="margin-left: auto;margin-right: auto;width: 50%">
          {{ $t('action.open') }}
        </el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button-group style="display:flex;justify-content: end">
        <el-tooltip
            v-if="isEditable()"
            effect="light"
            :content="$t('action.save')"
            placement="top"
        >
          <el-button type="success" :icon="Check" @click="submit(formRef)" :disabled="isDisabled()"></el-button>
        </el-tooltip>
        <el-tooltip
            v-if="isEditable()"
            effect="light"
            :content="$t('action.reset')"
            placement="top"
        >
          <el-button type="danger" :icon="Close" @click="reset(formRef)" :disabled="isDisabled()"></el-button>
        </el-tooltip>
        <el-tooltip
            v-if="!isEditable()"
            effect="light"
            :content="$t('action.edit')"
            placement="top"
        >
          <el-button type="primary" :icon="Edit" @click="edit" :disabled="isDisabled()"></el-button>
        </el-tooltip>
        <el-tooltip
            v-if="!isEditable()"
            effect="light"
            :content="$t('action.remove')"
            placement="top"
        >
          <el-button type="danger" :icon="Delete" @click="emit('remove',cardData.seq)"
                     :disabled="isDisabled()"></el-button>
        </el-tooltip>
      </el-button-group>
    </template>
  </el-card>
</template>
<style scoped>
</style>