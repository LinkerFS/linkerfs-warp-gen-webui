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

<script lang="ts" setup>

import {ElTree} from "element-plus";
import {FileTree} from "@/common/data/fileTree.ts";
import {useTemplateRef} from "vue";

const prop = defineProps<{ treeData: FileTree[], volumeId: string }>()
const treeProps = {
  label: "name",
  children: "children",
  isLeaf: (data: any, _: any) => {
    return data?.children === null
  }
}
const treeRef = useTemplateRef('treeRef')

function getSelectNode() {
  return treeRef.value!.getCheckedNodes(false, false)
}

defineExpose({getSelectNode})
</script>
<template>
  <el-card class="warp-form-item">
    <template #header>
      <span>{{ volumeId }}</span>
    </template>
    <el-tree
        ref="treeRef"
        :data="prop.treeData"
        :empty-text="$t('component.udfContent.noData')"
        :props="treeProps"
        class="warp-form-item"
        highlight-current
        node-key="fullPath"
        show-checkbox
    />
  </el-card>
</template>

<style scoped>
@import "@/assets/css/warp.css";
</style>