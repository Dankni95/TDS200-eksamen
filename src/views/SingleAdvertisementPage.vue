<script lang="ts" setup>

import AdvertisementImage from "@/components/AdvertisementImage.vue";
import {IAdvertisement, IAdvertisementResponse} from "@/models/IAdvertisementResponse";
import {directus} from "@/services/directus.service";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter
} from "@ionic/vue";
import {chatboxOutline} from 'ionicons/icons';
import {ref} from 'vue';
import {useRoute} from 'vue-router';
import {MapboxMap, MapboxMarker} from '@studiometa/vue-mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


/* Using the route object, we can get data for the user's current route */
const route = useRoute();
const map = ref();


/* Retrieve the id parameter from the current route's query string (/detail/:id) */
const {id} = route.params;

/* State */
const isModalOpen = ref(false);
const isLoadingAdvertisement = ref(true);

/* "Dummy data" for displaying in the UI until we connect the app to an API */
const advertisement = ref<IAdvertisement | null>(null);

onIonViewDidEnter(() => {
  fetchCampingSpot();
})


/* Fetch data for the specified advertisement from Directus by ID. Cancel the loading spinner when the data has been fetched successfully. */
const fetchCampingSpot = async () => {
  const response = await directus.graphql.items<IAdvertisementResponse>(`
    query {
      images_by_id(id: ${id}) {
          id
          title
          condition
          date_created
          description
          map
          address
          platform
          price
          user_created {
            id
            first_name
            last_name
            email
          }
          images {
            directus_files_id {
              id
            }
            id
          }
        }
       }
  `);


  if (response.status === 200 && response.data) {
    advertisement.value = response.data.images_by_id;
    console.log(response.data.images_by_id)
    isLoadingAdvertisement.value = false;
  }
}

const addNewComment = () => {
  /* campingSpot.value.comments.unshift({
    id: 2,
    username: "N/A",
    text: newCommentText.value
  });

  isModalOpen.value = false;
  newCommentText.value = ''; */
}

//https://vue-mapbox-gl.studiometa.dev/guide/usage/


</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title v-if="isLoadingAdvertisement">
          <ion-spinner></ion-spinner>
        </ion-title>
        <ion-title v-if="advertisement">{{ advertisement.title }} ({{ id }})</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="isModalOpen = true">
            <ion-icon :icon="chatboxOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content v-if="advertisement && !isLoadingAdvertisement"
                 :fullscreen="true" :style="{backgroundImage:'url(assets/images/bg-2.jpg)'}">


      <!--<ion-chip v-for="condition in advertisement.condition" :key="condition" color="tertiary">#{{ condition }}</ion-chip> -->

      <!-- Camping spot info section -->
      <ion-card>
        <ion-card-title style="text-align: center; padding: 50px">
          <h2>{{ advertisement.title }}</h2>
        </ion-card-title>
        <section>
          <ion-grid>
            <ion-row>
              <ion-col v-for="images in advertisement.images" :key="images.id" color="tertiary" size="6" size-lg="2"
                       size-md="5">
                <advertisement-image :image-id="images.directus_files_id.id"/>
              </ion-col>
            </ion-row>
          </ion-grid>
        </section>
        <ion-card-header style="color: #52ffe4">
          Price: {{ advertisement.price }}
          <br>
          <h4 style="color: white">Description</h4>
          <ion-card-subtitle>
            {{ advertisement.description }}
          </ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>

          <h4 style="color: white">Address </h4>
          <ion-label>
            {{ advertisement.address }}
          </ion-label>
          <br>
          <MapboxMap
              :center="[10.775847, 59.926306]"
              :zoom="10"
              access-token="pk.eyJ1IjoiZGFua25pOTUiLCJhIjoiY2t3cmE0OXlsMGQ3bzMxbHNjMm82bDkzeCJ9.1XATyS82VYWyaSB5NQ3j9g"
              map-style="mapbox://styles/mapbox/streets-v11"
              style="height: 300px"
              @mb-created="(mapboxInstance) => map = mapboxInstance">
            <MapboxMarker :lng-lat="advertisement.map.coordinates"/>
          </MapboxMap>

        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>
</template>


<style scoped>
ion-content {
  --ion-background-color: transparent;
  display: flex;
}

ion-list {
  display: flex;
  flex-direction: column;
}

ion-card {
  opacity: 0.9;
}


</style>