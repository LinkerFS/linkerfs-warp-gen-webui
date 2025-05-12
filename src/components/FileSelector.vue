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
import {FileSelectConfig, FileSelectorState, FileTreeFilters} from "@/common/data/fileSelector.ts";
import {onMounted, onUnmounted, reactive, ref} from "vue";
import {FileInfo, FileTree} from "@/common/data/fileTree.ts";
import {EventBus} from "@/common/utils/mitt.ts";
import {ElTree} from "element-plus";
import {listDir, ListDirResp} from "@/common/api/file.ts";
import type Node from 'element-plus/es/components/tree/src/model/node'
import {ElMessage} from "element-plus"
import {useI18n} from 'vue-i18n'

const {t} = useI18n({useScope: 'global'})
const state = reactive(new FileSelectorState)
const data = ref<FileTree[]>()
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeProps = {
  label: "name",
  children: "children",
  isLeaf: "isEmpty",
}

function fileSelected() {
  let current = treeRef.value?.getCurrentNode() as FileInfo
  if (current) {
    EventBus.emit('FileSelected', {
      name: current.name,
      fullPath: current.fullPath,
      size: current['size'] ? current.size : BigInt(0)
    })
    state.visible = false
  } else {
    ElMessage({
      message:state.title,
      type:'error'
    })
  }
}

function handleClose(_: () => void) {
  cancel()
}

function cancel() {
  EventBus.emit('FileSelected', null)
  state.visible = false
}

function loadData(node: Node, resolve: (data: FileTree[]) => void, reject: () => void) {
  if (node.level == 0) {
    resolve([{
      name: t('component.fileSelector.filesystem'),
      fullPath: "",
      isEmpty: false
    }])
  } else {
    let nodeData = node.data as FileTree
    listDir(nodeData.fullPath).then((response: object) => {
      const resp = response as ListDirResp
      let dataArray = new Array<FileTree>()
      let dirPath = node.level > 2 ? resp.dirPath + '/' : resp.dirPath
      resp.dirList.forEach((val) => {
        dataArray.push({
          name: val.name,
          fullPath: dirPath + val.name,
          isEmpty: val.isEmpty
        })
      })
      resp.fileList.forEach((val) => {
        dataArray.push({
          name: val.name,
          fullPath: dirPath + val.name,
          size: BigInt(val.size),
          isEmpty: true
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

onMounted(() => {
  EventBus.on('SelectFile', (config: FileSelectConfig) => {
    state.title = config.title
    state.visible = true
    if (!config.filter)
      config.filter = FileTreeFilters.noFilter
    if (state.filterFunc != config.filter) {
      state.filterFunc = config.filter
      treeRef.value?.filter(null)
    }
  })
})

onUnmounted(() => {
  EventBus.off('SelectFile')
})
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