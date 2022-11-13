<script setup lang="ts">

interface Props {
	imageId: string;
}

const userAccessToken = localStorage.getItem('auth_token');

defineProps<Props>();

</script>

<template>
	<img :src="`https://zguhw62p.directus.app/assets/${imageId}`" />
</template>