<script setup lang="ts">
import {  IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/vue";
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
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Header</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <h1>Animal Facts</h1>

    </ion-content>
  </template>

