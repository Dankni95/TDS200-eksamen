<script lang="ts" setup>

import {IonButton, IonContent, IonIcon, IonLabel, IonList, IonSearchbar} from "@ionic/vue";
import {navigateCircle} from 'ionicons/icons';
import {ref, toRaw} from "vue";
import {Geolocation} from "@capacitor/geolocation";

 interface ICreateMap{
  lon: number;
  lat: number;
  formatted: string;
}

const addresses: string[] = [];
const coords: ICreateMap[] = [];


const emit = defineEmits<{
  (e: 'myEvent', address: object): void
}>()


//find how to return value to parent from this prop

const newAddress = ref(addresses);
const coordinates = ref(coords);


const selectedAddress = ref("");

// https://capacitorjs.com/docs/android/configuration#setting-permissions

const getUserLocation = async () => {

  selectedAddress.value = ""
  newAddress.value = []


  const location = await Geolocation.getCurrentPosition();

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
  selectedAddress.value = ""

  const response = await fetch(`  https://api.geoapify.com/v1/geocode/autocomplete?text=${event.detail.value}&format=json&apiKey=9fa2f9495b1a45bd8735bdd259500594`);
  const data = await response.json();

  coordinates.value = data.results


  const addresses = [...data.results]

  newAddress.value = addresses.map((address) => {
    return address.formatted
  })
}


const returnAddress = (address: string) => {
  selectedAddress.value = address

  let coordsResult = coordinates.value.filter(obj => {
    if (obj.formatted === address) {
      return obj
    }
  })

  emit("myEvent", toRaw(coordsResult[0]))

  newAddress.value = []
}


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

//defineProps<Props>();


</script>

<template>
  <ion-content>
    <section>
      <ion-searchbar color="success" debounce="500" type="text" @ionChange="searchForAddress($event)">
        <ion-button class="location-button" color="danger" @click="getUserLocation">
          <ion-icon :icon="navigateCircle"></ion-icon>
        </ion-button>
      </ion-searchbar>


      <ion-list v-for="item in newAddress" :key="item" :slot="center" :model-value="item">
        <ion-item @click="returnAddress(item)">{{ item }}</ion-item>
      </ion-list>


      <ion-item lines="none">
        <ion-label v-if="selectedAddress" :key="searchForAddress"
                   :model-value="selectedAddress" text-wrap>Your address: {{ selectedAddress }}
        </ion-label>
      </ion-item>
    </section>
  </ion-content>
</template>

<style scoped>
ion-content, ion-searchbar {
  --ion-background-color: black;

  display: flex;
}

ion-list {
  display: flex;
  flex-direction: column;
}


.location-button {
  position: absolute;
  right: 0;
  z-index: 1;
}


</style>
