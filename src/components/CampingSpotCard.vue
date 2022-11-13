<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent } from "@ionic/vue";
import CampingSpotImage from "@/components/CampingSpotImage.vue";




interface Props {
	advertisement: {
    id: number;
    title: string;
    platform: string[];
    description: string;
    condition: string;
    maps: string;
    image: {
      id: string;
    };
    user_created: {
      first_name: string;
    };
  }
}

defineProps<Props>();



</script>

<template>
	<ion-card :router-link="'/detail/' + advertisement.id">


    <camping-spot-image v-for="image in advertisement.image" :image-id="image.id" :key="image.id" />


    <ion-card-header>
			<ion-card-subtitle>{{ advertisement.condition }}</ion-card-subtitle>
			<ion-card-title>{{ advertisement.title }}</ion-card-title>
		</ion-card-header>

		<ion-card-content>
			{{ advertisement.description }}
		</ion-card-content>

	</ion-card>
</template>