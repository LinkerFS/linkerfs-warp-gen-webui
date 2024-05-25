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
import {FileSelectorState} from "@/common/data/fileSelector.ts";
import {onMounted, onUnmounted, reactive, ref} from "vue";
import {FileInfo, FileTree} from "@/common/data/file.ts";
import {EventBus} from "@/common/utils/mitt.ts";
import {ElTree} from "element-plus";
import {TreeNodeData, TreeOptionProps} from "element-plus/es/components/tree/src/tree.type";

const state = reactive(new FileSelectorState)
const data = reactive(new Array<FileTree>())
const treeRef = ref<InstanceType<typeof ElTree>>()
const treeProps: TreeOptionProps = {
  label: "name",
  children: "children",
  isLeaf: (data: TreeNodeData, _): boolean => {
    data = data as FileTree
    return !!data.childDir
  },
}

function fileSelected() {
  let current = treeRef.value?.getCurrentNode() as FileInfo
  if (current) {
    EventBus.emit('FileSelected', {
      name: current.name,
      parentDir: current.parentDir,
      size: current['size'] ? current.size : 0
    })
    state.visible = false
  } else {
    //todo inform not select
  }
}

onMounted(() => {
  EventBus.on('SelectFile', () => {
    state.visible = true
  })
})

onUnmounted(() => {
  EventBus.off('SelectFile')
})
</script>
<template>
  <el-dialog v-model="state.visible" :title="$t(state.title)" width="800">
    <el-tree
        ref="treeRef"
        style="max-width: 600px"
        :filter-node-method="!!state.filter?state.filter:undefined"
        :data="data"
        :props="treeProps"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="state.visible = false">{{ $t("Cancel") }}</el-button>
        <el-button type="primary" @click="fileSelected">
          {{ $t("Confirm") }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<style scoped>

</style>