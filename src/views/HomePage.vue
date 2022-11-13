<script setup lang="ts">
import CampingSpotCard from '@/components/CampingSpotCard.vue';
import { IAdvertisement, IAdvertisementsResponse } from '@/models/IAdvertisementResponse';
import { directus } from '@/services/directus.service';
import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, onIonViewDidEnter, RefresherCustomEvent } from '@ionic/vue';
import { ref } from 'vue';

const advertisements = ref<IAdvertisement[]>([]);

onIonViewDidEnter(() => {
  fetchCampingSpots();
})

const refreshCampingSpotsView = async (event: RefresherCustomEvent) => {
  await fetchCampingSpots();
  event.target.complete();
}

const fetchCampingSpots = async () => {
  const response = await directus.graphql.items<IAdvertisementsResponse>(`
      query Advertisements {
      images {
        title
        description
        id
        map
        platform
        price
        condition
        date_created
        images {
          directus_files_id{
            id
          }
        }
      }
    }

  `);

  if (response.status === 200 && response.data) {
    advertisements.value = [...response.data.images];
    console.log(advertisements.value);
  }
}

</script>
  

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Baal 🏕</ion-title>
        <ion-buttons slot="end">
          <ion-button router-link="/new-spot">+</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <ion-refresher slot="fixed" @ionRefresh="refreshCampingSpotsView($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <camping-spot-card v-for="advertisement in advertisements" :key="advertisement.id" :advertisement="advertisement" />


    </ion-content>
  </ion-page>
</template>