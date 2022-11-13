<script lang="ts" setup>

import CampingSpotImage from "@/components/CampingSpotImage.vue";
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
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonModal,
  IonPage,
  IonRow,
  IonSpinner,
  IonTextarea,
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
const newCommentText = ref('');
const isLoadingAdvertisement = ref(true);

/* "Dummy data" for displaying in the UI until we connect the app to an API */
const advertisement = ref<IAdvertisement | null>(null);

onIonViewDidEnter(() => {
  fetchCampingSpot();
})


/* Fetch data for the specified camping spot from Directus by ID. Cancel the loading spinner when the data has been fetched successfully. */
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
          <ion-back-button default-href="/"></ion-back-button>
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

    <ion-content v-if="advertisement && !isLoadingAdvertisement" :fullscreen="true">


      <!-- Hero image section -->


      <section>
        <ion-grid>
          <ion-row>
            <ion-col v-for="images in advertisement.images" :key="images.id" color="tertiary" size="6" size-lg="2"
                     size-md="5">
              <camping-spot-image :image-id="images.directus_files_id.id"/>
            </ion-col>
          </ion-row>
        </ion-grid>
      </section>

      <!--<ion-chip v-for="condition in advertisement.condition" :key="condition" color="tertiary">#{{ condition }}</ion-chip> -->

      <!-- Camping spot info section -->
      <ion-card>
        <ion-card-header>
          <ion-card-subtitle>Turbeskrivelse</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          {{ advertisement.description }}
        </ion-card-content>
      </ion-card>

      <ion-label>
        {{advertisement.address}}
      </ion-label>
      <MapboxMap
          :center="[10.775847, 59.926306]"
          :zoom="10"
          access-token="pk.eyJ1IjoiZGFua25pOTUiLCJhIjoiY2t3cmE0OXlsMGQ3bzMxbHNjMm82bDkzeCJ9.1XATyS82VYWyaSB5NQ3j9g"
          map-style="mapbox://styles/mapbox/streets-v11"
          style="height: 200px"
          @mb-created="(mapboxInstance) => map = mapboxInstance">
        <MapboxMarker :lng-lat="advertisement.map.coordinates"/>
      </MapboxMap>

      <!-- Comment section -->
      <ion-card>
        <ion-list>
          <ion-list-header>
            <ion-label>
              Kommentarfelt
              <ion-icon :icon="chatboxOutline"></ion-icon>
            </ion-label>
          </ion-list-header>
          <!-- <ion-item v-for="comment in campingSpot.comments" :key="comment.id" lines="none">
            <ion-avatar slot="start">
              <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAAAAACH5BAAAAAAALAAAAAABAAEAAAICTAEAOw==">
            </ion-avatar>
            <ion-label class="ion-text-wrap">
              <ion-text>
                <b>{{comment.username}} </b>
              </ion-text>
              <ion-text>
                <p>{{comment.text}}</p>
              </ion-text>
            </ion-label>
          </ion-item> -->


        </ion-list>
      </ion-card>

      <ion-modal :breakpoints="[0, 0.25, 0.5, 0.75]" :initial-breakpoint="0.25" :is-open="isModalOpen"
                 @did-dismiss="isModalOpen = false">
        <ion-content>
          <ion-item lines="none">
            <ion-label position="floating">Ny kommentar</ion-label>
            <ion-textarea v-model="newCommentText"></ion-textarea>
            <ion-button @click="addNewComment">Legg til kommentar</ion-button>
          </ion-item>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>


<style scoped>
ion-content {
  --ion-background-color: black;
  display: flex;
}

ion-list {
  display: flex;
  flex-direction: column;
}

.label-mild {
  --color: #8a8a8a !important;
}

.image-picker {
  height: 10vh;
  margin: 10px;
  border: 2px #8a8a8a dashed;
  border-radius: 8px;
  font-size: medium;
}

.remove-image-preview {
  position: absolute;
  right: 0;
  z-index: 1;
}


.button-add {
  margin-top: 50px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>