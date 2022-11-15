<script setup lang="ts">

interface Props {
	imageId: string;
}


defineProps<Props>();

</script>

<template>
	<img :src="`https://zguhw62p.directus.app/assets/${imageId}`"  alt="image"/>
</template>