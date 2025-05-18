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
import {onMounted, ref} from 'vue'
import {router} from "@/router";
import {Feature, getServerFeature} from "@/common/api/feature.ts";

const activeIndex = ref('base')
const serverFeature = ref<Feature>(0)
const handleSelect = (_: string, keyPath: string[]) => {
  let route: string = ''
  keyPath.forEach(key => {
    route += `/${key}`
  })
  router.push(route)
}
onMounted(() => {
  getServerFeature().then((response) => {
    serverFeature.value = response as unknown as number
  })
})
</script>
<template>
  <el-menu
      :default-active="activeIndex"
      class="menu"
      mode="vertical"
      @select="handleSelect"
      router:true
  >
    <el-menu-item index="base">{{ $t('view.menu.base') }}</el-menu-item>
  </el-menu>
</template>
