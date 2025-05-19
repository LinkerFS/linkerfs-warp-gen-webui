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
import {FileSelectConfig, FileSelectorState, FileTreeFilters, SelectedCallBack} from "@/common/data/fileSelector.ts";
import {reactive, ref, useTemplateRef, watch} from "vue";
import {LazyFileTree} from "@/common/data/fileTree.ts";
import {ElTree} from "element-plus";
import {listDir, ListDirResp} from "@/common/api/file.ts";
import type Node from 'element-plus/es/components/tree/src/model/node'
import {ElMessage} from "element-plus"
import {useI18n} from 'vue-i18n'

const {t} = useI18n({useScope: 'global'})
const state = reactive(new FileSelectorState)
const data = ref<LazyFileTree[]>()
const treeRef = useTemplateRef('treeRef')
const treeProps = {
  label: "name",
  children: "children",
  isLeaf: (data: any, _: any) => {
    return data?.children === null
  }
}
let selectCallback: SelectedCallBack | null = null
watch(() => state.filterFunc, () => {
  treeRef.value?.filter(null)
})

function open(config: FileSelectConfig) {

  state.title = config.title
  selectCallback = config.callBack
  state.filterFunc = config.filter
  state.visible = true
}

function fileSelected() {
  let current = treeRef.value?.getCurrentNode() as LazyFileTree
  if (current) {
    selectCallback?.({
      name: current.name,
      fullPath: current.fullPath,
      size: current.size
    })
    state.visible = false
  } else {
    ElMessage({
      message: state.title,
      type: 'error'
    })
  }
}

function handleClose(_: () => void) {
  cancel()
}

function cancel() {
  state.visible = false
}

function loadData(node: Node, resolve: (data: LazyFileTree[]) => void, reject: () => void) {
  if (node.level == 0) {
    resolve([{
      name: t('component.fileSelector.filesystem'),
      fullPath: "",
      size: null,
      children: new Array<LazyFileTree>()
    }])
  } else {
    let nodeData = node.data as LazyFileTree
    listDir(nodeData.fullPath).then((response: object) => {
      const resp = response as ListDirResp
      let dataArray = new Array<LazyFileTree>()
      let dirPath = node.level > 2 ? resp.dirPath + '/' : resp.dirPath
      resp.dirList.forEach((val) => {
        dataArray.push({
          name: val.name,
          fullPath: dirPath + val.name,
          size: null,
          children: val.isEmpty ? null : new Array<LazyFileTree>
        })
      })
      resp.fileList.forEach((val) => {
        dataArray.push({
          name: val.name,
          fullPath: dirPath + val.name,
          size: BigInt(val.size),
          children: null
        })
      })
      resolve(dataArray)
      if (state.filterFunc != FileTreeFilters.noFilter) {
        node.childNodes.forEach((val) => {
          val.visible = treeRef!.value!.store.filterNodeMethod(null, val.data, val)
        })
      }
    }, () => {
      reject()
    })
  }
}

defineExpose({open})
</script>
<template>
  <el-dialog v-model="state.visible" :title="state.title" :before-close="handleClose">
    <div style="overflow: auto;max-height: 60vh">
      <el-tree
          class="file-selector-tree"
          ref="treeRef"
          node-key="fullPath"
          :load="loadData"
          :filter-node-method="state.filter"
          :data="data"
          :props="treeProps"
          highlight-current
          lazy
      />
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">{{ $t('action.cancel') }}</el-button>
        <el-button type="primary" @click="fileSelected">
          {{ $t('action.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped>
.file-selector-tree {
  min-width: 100%;
  display: inline-block;
}
</style>