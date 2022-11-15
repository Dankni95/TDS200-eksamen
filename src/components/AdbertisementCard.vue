<script lang="ts" setup>
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonLabel
} from "@ionic/vue";
import AdvertisementImage from "@/components/AdvertisementImage.vue";


interface Props {
  advertisement: {
    id: number;
    title: string;
    platform: string[];
    price: number
    description: string;
    condition: string;
    address: string
    images: {
      directus_files_id: any
    }
  }
}


defineProps<Props>();


</script>

<template>
  <ion-card :router-link="'/detail/' + advertisement.id">
      <advertisement-image v-if="advertisement.images[0]" :image-id="advertisement.images[0].directus_files_id.id"/>
        <ion-card-header>
        <ion-card-title>
            {{advertisement.title}}
        </ion-card-title>
          <ion-label color="primary" text-wrap>
            Price: {{ advertisement.price }}
          </ion-label>
        <ion-card-subtitle>{{ advertisement.condition }}</ion-card-subtitle>

      </ion-card-header>

      <ion-card-content>
        {{advertisement.description}}
      </ion-card-content>
    <ion-label style="color: blue;" text-wrap>ADDRESS:  </ion-label>
    <ion-label text-wrap>
        {{ advertisement.address }}
      </ion-label>
    </ion-card>

</template>

<style scoped>
ion-card{
  padding: 20px;
  color: #52ffe4;
  opacity: 0.9;
}

ion-card > img {
  height: 200px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}


.button-add {
  margin-top: 50px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>