<script setup lang="ts">
import CampingSpotCard from '@/components/CampingSpotCard.vue';
import { IAdvertisement, IAdvertisementsResponse } from '@/models/IAdvertisementResponse';
import {authService, directus} from '@/services/directus.service';
import {IonCard, IonCardTitle, IonCardHeader, IonCardContent, IonCardSubtitle, IonIcon,IonButton, IonButtons, IonContent, IonHeader, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar, onIonViewDidEnter, RefresherCustomEvent } from '@ionic/vue';
import { ref } from 'vue';
import {add, personOutline} from 'ionicons/icons';


const advertisements = ref<IAdvertisement[]>([]);
const currentUser = ref<object>();


onIonViewDidEnter(() => {
  fetchCampingSpots();
  getSignedInUser()
})

const refreshCampingSpotsView = async (event: RefresherCustomEvent) => {
  await fetchCampingSpots();
  event.target.complete();
}

const getSignedInUser = async() =>{
  currentUser.value = await authService.currentUser()
  console.log(currentUser)
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
        <ion-buttons v-if="currentUser" slot="end">
          <ion-button router-link="/new-spot">
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
          <ion-button  class="remove-image-preview" color="danger" @click="removeImagePreview(image)">
            <ion-icon  :icon="personOutline"></ion-icon>
            <ion-card>

              {{currentUser.first_name + " " + currentUser.last_name }}

            </ion-card>
          </ion-button>
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

<style scoped>
ion-content {
  --ion-background-color: black;

  display: flex;
}

ion-header > *{
  display: flex;
  height: 10vh;

}


.location-button {
  position: absolute;
  right: 0;
  z-index: 1;
}


</style>