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
import {computed, reactive, Ref, ref, toRef} from "vue";
import {WarpTarget} from "@/common/data/warpFile.ts";
import {Check, Close, Delete, Edit} from "@element-plus/icons-vue";
import {EventBus} from "@/common/utils/mitt.ts";
import {FileInfo} from "@/common/data/fileTree.ts";
import {ElInput, FormInstance, FormRules} from "element-plus";
import {setInputDisplayTail} from "@/common/utils/dom.ts";
import {useI18n} from 'vue-i18n'

const {t} = useI18n({useScope: 'global'})

const props = defineProps<{
  target: Ref<WarpTarget>,
  seq: Ref<number>,
  isDisable: Ref<boolean>,
  fileTotalSize: Ref<bigint>
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
const pathInputRef = ref<InstanceType<typeof ElInput>>()
const targetNumStr = computed(() => {
  return `${t('component.warpTargetCard.target')} ${seq.value.toString()}`
})
const formRef = ref<FormInstance>()
const validateRule = reactive<FormRules<typeof warpTarget>>({
  filePath: [{validator: validateFilePath, trigger: 'blur'}],
  dataOffset: [{validator: validateDataOffset, trigger: 'blur'}, {validator: validateSize, trigger: 'blur'}],
  dataSize: [{validator: validateDataSize, trigger: 'blur'}, {validator: validateSize, trigger: 'blur'}]
})
const fileCallback = (fileInfo: FileInfo | null) => {
  if (fileInfo) {
    warpTarget.value.filePath = fileInfo.fullPath
    fileTotalSize.value = fileInfo.size
    setInputDisplayTail(pathInputRef)
  }
  EventBus.off('FileSelected', fileCallback)
}

function validateSize(_: any, value: any, callback: any) {
  if (BigInt(value) < BigInt(0)) {
    callback(new Error(t('component.warpTargetCard.valueNegative')))
  } else if (BigInt(value) > BigInt("9223372036854775807")) {
    callback(new Error(t('component.warpTargetCard.valueMoreThanInt64')))
  }
  callback()
}

function validateFilePath(_e: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error(t('component.warpTargetCard.requireFilePath')))
  } else if (fileTotalSize.value === BigInt(0)) {
    callback(new Error(t('component.warpTargetCard.mustBeFile')))
  } else {
    callback()
  }
}

function validateDataOffset(_: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error(t('component.warpTargetCard.requireDataOffset')))
  } else {
    if (BigInt(warpTarget.value.dataSize) > 0) {
      if (!formRef.value) return
      formRef.value.validateField('dataSize')
    }
    callback()
  }
}

function validateDataSize(_: any, value: any, callback: any) {
  if (value === '') {
    callback(new Error(t('component.warpTargetCard.requireDataSize')))
  } else if (BigInt(warpTarget.value.dataSize) === BigInt(0)) {
    callback(new Error(t('component.warpTargetCard.dataSizePositive')))
  } else if (BigInt(warpTarget.value.dataOffset) + BigInt(warpTarget.value.dataSize) > fileTotalSize.value) {
    callback(new Error(t('component.warpTargetCard.dataOutOfRange')))
  } else {
    callback()
  }
}

function selectFile() {
  EventBus.on('FileSelected', fileCallback)
  EventBus.emit('SelectFile', {title: t('component.warpTargetCard.titleSelectFile')})
}

function edit() {
  isEditable.value = true
  emit('edit', seq.value)
}

function save() {
  isEditable.value = false
  emit('save', seq.value)
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
    <el-form ref="formRef" :model="warpTarget" :rules="validateRule" label-position="right" label-width="auto"
             style="max-width: 400px">
      <el-form-item :label="$t('data.warpTarget.filePath')+':'" prop="filePath">
        <el-input v-model="warpTarget.filePath" ref="pathInputRef" disabled></el-input>
      </el-form-item>
      <el-form-item :label="$t('data.warpTarget.dataOffset')+':'" prop="dataOffset">
        <el-input v-model="warpTarget.dataOffset" :disabled="!isEditable" :type="'number'"><template #append>Byte</template></el-input>
      </el-form-item>
      <el-form-item :label="$t('data.warpTarget.dataSize')+':'" prop="dataSize">
        <el-input v-model="warpTarget.dataSize" :disabled="!isEditable" :type="'number'"><template #append>Byte</template></el-input>
      </el-form-item>
      <el-form-item v-if="isEditable">
        <el-button @click="selectFile" type="primary"
                   style="margin-left: auto;margin-right: auto;width: 50%">
          {{ $t('action.open') }}
        </el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button-group style="display:flex;justify-content: end">
        <el-tooltip
            v-if="isEditable"
            effect="light"
            :content="$t('action.save')"
            placement="top"
        >
          <el-button type="success" :icon="Check" @click="submit(formRef)" :disabled="isDisable"></el-button>
        </el-tooltip>
        <el-tooltip
            v-if="isEditable"
            effect="light"
            :content="$t('action.reset')"
            placement="top"
        >
          <el-button type="danger" :icon="Close" @click="reset(formRef)" :disabled="isDisable"></el-button>
        </el-tooltip>
        <el-tooltip
            v-if="!isEditable"
            effect="light"
            :content="$t('action.edit')"
            placement="top"
        >
          <el-button type="primary" :icon="Edit" @click="edit" :disabled="isDisable"></el-button>
        </el-tooltip>
        <el-tooltip
            v-if="!isEditable"
            effect="light"
            :content="$t('action.remove')"
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