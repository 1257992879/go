<script lang="ts" setup>

import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

defineProps<{
    iconClass: string,
    titleName: string
}>()

</script>


<template>
    <div id="titleBar" class="unselectable">
    <span id="titleBarContext">
        <font-awesome-icon :icon="iconClass" style="font-size: 15px; margin-right: 4px"></font-awesome-icon>
        <span>{{ titleName }}</span>
    </span>
    </div>
</template>


<style scoped>
#titleBar {
    color: white;
}

#titleBarContext {
    display: inline-block;
    padding: 0 7px 0 5px;
    font-size: 17px;
    background: rgba(240, 240, 240, 0.35);
    color: black;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    border-radius: 6px;
}
</style>
