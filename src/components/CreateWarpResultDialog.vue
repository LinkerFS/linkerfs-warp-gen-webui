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
import MessageDialog from "@/components/MessageDialog.vue";
import WarpFileCreateResult from "@/components/WarpFileCreateResult.vue";
import {ref} from "vue";
import {IconType, MessageDialogState} from "@/common/data/messageDialog.ts";
import {defaultTitle, setMessageConfig} from "@/common/data/warpCreateResult.ts";
import {CreateWarpResponse} from "@/common/api/warp.ts";

const messageDialogsState = ref<MessageDialogState>({
  title: defaultTitle,
  visible: false,
  icon: IconType.SUCCESS,
  description: ""
})
const createResult = ref<CreateWarpResponse>({
  warpFiles: [],
  hardlinkFiles: [],
  failedFiles: []
})

function open(createWarpResponse: CreateWarpResponse) {
  createResult.value = createWarpResponse
  setMessageConfig(messageDialogsState, createResult.value)
  messageDialogsState.value.visible = true
}

defineExpose({open})
</script>
<template>
  <MessageDialog :state="messageDialogsState">
    <WarpFileCreateResult v-bind="createResult"></WarpFileCreateResult>
  </MessageDialog>
</template>

<style scoped>

</style>