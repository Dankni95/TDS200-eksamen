<script lang="ts" setup>
import Advertisement from '@/components/AdbertisementCard.vue';
import {IAdvertisement, IAdvertisementsResponse} from '@/models/IAdvertisementResponse';
import {authService, directus} from '@/services/directus.service';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonToolbar,
    IonLabel,
  onIonViewDidEnter,
  RefresherCustomEvent
} from '@ionic/vue';
import {ref} from 'vue';
import {add, logIn, personOutline} from 'ionicons/icons';


const advertisements = ref<IAdvertisement[]>([]);
const currentUser = ref<any>();
const isLoading = ref(true);
const userAccessToken = ref()


onIonViewDidEnter(() => {
   userAccessToken.value = localStorage.getItem('auth_token');
    if (userAccessToken.value) getSignedInUser()

  fetchCampingSpots();
})


const refreshCampingSpotsView = async (event: RefresherCustomEvent) => {
  await fetchCampingSpots();
  event.target.complete();
}

const getSignedInUser = async () => {
  currentUser.value = await authService?.currentUser()
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
        address
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
    isLoading.value = false
  }

}

</script>


<template>
  <ion-page :style="{backgroundImage:'url(assets/images/bg-1.jpg)'}"  >
    <ion-header v-if="!isLoading" :translucent="true">
      <ion-toolbar>
        <ion-title>
          <ion-title v-if="!isLoading"><ion-label text-wrap>Retro Games</ion-label></ion-title>
          <ion-spinner v-if="isLoading"/>
        </ion-title>

        <ion-buttons v-if="!userAccessToken" slot="end" router-link="/authentication">
          <ion-button router-link="/new-advertisement">
            <ion-icon :icon="logIn"></ion-icon>
            <ion-label text-wrap>Log in</ion-label>
          </ion-button>
        </ion-buttons>
        <ion-buttons v-if="userAccessToken" slot="end">
          <ion-button router-link="/new-advertisement">
            <ion-icon :icon="add"></ion-icon>
            <ion-label text-wrap>Publish add</ion-label>
          </ion-button>
          <ion-button class="remove-image-preview" color="danger" router-link="/profile">
            <ion-icon :icon="personOutline"></ion-icon>
            <ion-card>
              <ion-label v-if="currentUser" text-wrap>
                {{ currentUser.first_name }}
              </ion-label>
            </ion-card>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content v-if="!isLoading" :fullscreen="true">

      <ion-refresher slot="fixed" @ionRefresh="refreshCampingSpotsView($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>


      <advertisement v-for="advertisement in advertisements" :key="advertisement.id"
                         :advertisement="advertisement"/>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content {
  --ion-background-color: transparent;
  display: flex;
}

ion-toolbar > ion-title{
  padding: 10px;
}

ion-header > * {
  display: flex;
  height: 10vh;

}


</style>