<script lang="ts" setup>

import {IonButton, IonButtons, IonIcon, IonLabel, IonSearchbar, IonSpinner} from "@ionic/vue";
import {navigateCircle} from 'ionicons/icons';
import {ref, toRaw} from "vue";
import {Geolocation} from "@capacitor/geolocation";

const isGettingLocation = ref(false);


interface ICreateMap {
  lon: number;
  lat: number;
  formatted: string;
}

const addresses: string[] = [];
const coords: ICreateMap[] = [];


const emit = defineEmits<{
  (e: 'myEvent', address: object): void
}>()


const newAddress = ref(addresses);
const coordinates = ref(coords);


const selectedAddress = ref("");

// https://capacitorjs.com/docs/android/configuration#setting-permissions

const getUserLocation = async () => {

  isGettingLocation.value = true

  selectedAddress.value = ""
  newAddress.value = []


  const location = await Geolocation.getCurrentPosition({enableHighAccuracy: true});

  console.log('Current position:', location.coords.longitude + " " + location.coords.latitude);


  const response = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${location.coords.latitude}&lon=${location.coords.longitude}&format=json&apiKey=9fa2f9495b1a45bd8735bdd259500594`);

  const data = await response.json();

  selectedAddress.value = data.results[0].formatted

  coordinates.value = [{
    lon: location.coords.longitude,
    lat: location.coords.latitude,
    formatted: selectedAddress.value
  }]


  returnAddress(selectedAddress.value)

}

const searchForAddress = async (event: any) => {
  isGettingLocation.value = true

  const response = await fetch(`  https://api.geoapify.com/v1/geocode/autocomplete?text=${event.detail.value}&format=json&apiKey=9fa2f9495b1a45bd8735bdd259500594`);
  const data = await response.json();
  coordinates.value = data.results
  const addresses = [...data.results]

  isGettingLocation.value = false
  newAddress.value = addresses.map((address) => {
    return address.formatted
  })
}


const returnAddress = (address: string) => {
  isGettingLocation.value = false
  selectedAddress.value = address

  let coordsResult = coordinates.value.filter(obj => {
    if (obj.formatted === address) {
      return obj
    }
  })

  emit("myEvent", toRaw(coordsResult[0]))

  newAddress.value = []
}


</script>

<template>
  <section>
    <ion-searchbar v-model="selectedAddress" color="success" debounce="700" type="text"
                   @ionChange="searchForAddress($event)">
      <ion-button class="location-button" color="danger" @click="getUserLocation">
        <ion-icon :icon="navigateCircle"></ion-icon>
      </ion-button>
    </ion-searchbar>
    <ion-spinner v-if="isGettingLocation" name="dots"></ion-spinner>

    <div v-if="newAddress">
      <ion-buttons v-for="item in newAddress" :key="item" :model-value="item">
        <ion-button @click="returnAddress(item)">
          <ion-label class="address" text-wrap>{{ item }}</ion-label>
        </ion-button>
      </ion-buttons>
    </div>


    <ion-item lines="none">
      <ion-label v-if="selectedAddress" :key="searchForAddress"
                 :model-value="selectedAddress" text-wrap>Your address: {{ selectedAddress }}
      </ion-label>
    </ion-item>
  </section>
</template>

<style scoped>


.address, ion-buttons {
  padding-top: 10px;
  padding-bottom: 10px;
}


.location-button {
  position: absolute;
  right: 0;
  z-index: 1;
}


</style>
