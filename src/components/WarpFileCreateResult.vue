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
import {CreateWarpResponse} from "@/common/api/warp.ts"

const prop = defineProps<CreateWarpResponse>()
</script>
<template>
  <div v-if="prop.failedFiles.length>0">
    <el-text tag="div" size="large" type="danger">{{ $t('data.warpCreateResult.failedFiles') }}</el-text>
    <el-text tag="div" v-for="file in prop.failedFiles" :key="file">{{ file }}</el-text>
    <br>
  </div>
  <div v-if="prop.warpFiles.length>0">
    <el-text tag="div" size="large" type="success">{{ $t('data.warpCreateResult.createdWarpFiles') }}</el-text>
    <el-text tag="div" v-for="file in prop.warpFiles" :key="file">{{ file }}</el-text>
    <br>
  </div>
  <el-text v-if="prop.hardlinkFiles.length>0">
    <el-text tag="div" size="large" type="primary">{{ $t('data.warpCreateResult.createdHardlinks') }}</el-text>
    <el-text tag="div" v-for="file in prop.hardlinkFiles" :key="file">{{ file }}</el-text>
    <br>
  </el-text>
</template>

<style scoped>

</style>