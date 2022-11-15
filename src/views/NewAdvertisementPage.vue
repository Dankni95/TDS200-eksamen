<script lang="ts" setup xmlns:display="http://www.w3.org/1999/xhtml">

import {INewAdvertisement, INewMapPoint} from '@/models/IAdvertisementResponse';
import {directus} from '@/services/directus.service';
import {Camera, CameraResultType} from '@capacitor/camera';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTextarea,
  IonTitle,
  IonToolbar,
  toastController
} from '@ionic/vue';
import {add, closeCircleOutline} from 'ionicons/icons';
import {ref} from 'vue';
import AdvertisementAddressInput from '@/components/AdvertisementAddressInput.vue'


// Keeps track of the input field for new tags
const newPlatformTag = ref("");
const isUploadingAdvertisement = ref(false);


// Track all data from user input
const newAdvertisement = ref<INewAdvertisement>({
  title: "",
  description: "",
  platform: [],
  price: 0,
  condition: "",
  images: [],
  map: "",
  address: ""
});

const addNewPlatformType = () => {
  // Avoid adding empty hashtags
  if (newPlatformTag.value) {
    newAdvertisement.value.platform.push(newPlatformTag.value);
    newPlatformTag.value = "";
  }
}

// Handle data POSTing
const postNewCampSpot = async () => {


  const imageIds: any[] = []


  try {
    isUploadingAdvertisement.value = true;

    for (const image of newAdvertisement.value.images) {
      const formData = new FormData();

      const response = await fetch(image);
      const imageBlob = await response.blob();

      formData.append('file', imageBlob);
      const images = await directus.files.createOne(formData)
      imageIds.push(images)
    }


    let imageObjects = imageIds.map(uploaded => {
      return {
        "images_id": "+",
        "directus_files_id": {
          "id": `${uploaded.id}`
        }
      }
    })

    const createImage = {
      "create": [
        ...imageObjects
      ],
      "update": [],
      "delete": []
    }


    if (imageIds) {
      await directus.items('images').createOne({
        title: newAdvertisement.value.title,
        description: newAdvertisement.value.description,
        price: newAdvertisement.value.price,
        platform: newAdvertisement.value.platform,
        condition: newAdvertisement.value.condition,
        comments: [],
        map: newAdvertisement.value.map,
        address: newAdvertisement.value.address,
        images: createImage

      });

      const successToast = await toastController.create({
        message: 'Advertisement is now published!',
        duration: 1500,
        position: 'bottom',
        color: 'success'
      });

      await successToast.present();
    }

    isUploadingAdvertisement.value = false;

  } catch (error) {
    const errorToast = await toastController.create({
      message: 'Something went wrong!',
      duration: 2500,
      position: 'bottom',
      color: 'danger'
    });

    await errorToast.present();
    console.error(error);
    isUploadingAdvertisement.value = false;
  }
}


// Open the device's camera and/or file picker UI
const triggerCamera = async () => {
  const photo = await Camera.getPhoto({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.Uri
  });

  if (photo.webPath) {
    newAdvertisement.value.images.push(photo.webPath);
  }

}

const removeImagePreview = (image: string) => {

  newAdvertisement.value.images = newAdvertisement
      .value
      .images.filter(e => e !== image)
}

const getAddressFromChild = (location: INewMapPoint) => {

  newAdvertisement.value.address = ""
  newAdvertisement.value.map = ""

  const mapPoint = {
    "coordinates": [
      location.lon,
      location.lat
    ],
    "type": "Point"
  }

  newAdvertisement.value.map = JSON.stringify(mapPoint)
  console.log(newAdvertisement.value.map)
  newAdvertisement.value.address = location.formatted
}

const conditionSelect = (selectValue: string) => {
  newAdvertisement.value.condition = selectValue
}


</script>

<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Publish your advertisement!</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <ion-list>

        <!-- Logic for file picking / using camera will be added later -->
        <ion-button class="image-picker" color="light" @click="triggerCamera">
          Add an image
        </ion-button>


        <section v-if="newAdvertisement.images">
          <ion-grid>
            <ion-row>
              <ion-col v-for="image in newAdvertisement.images" :key=image :model-value="image" size="6" size-lg="2"
                       size-md="5">
                <ion-button class="remove-image-preview" color="danger" @click="removeImagePreview(image)">
                  <ion-icon :icon="closeCircleOutline"></ion-icon>
                </ion-button>
                <img :src="image"/>
              </ion-col>
            </ion-row>
          </ion-grid>
        </section>

        <ion-item>
          <ion-label class="label-mild" position="floating">Title</ion-label>
          <ion-input v-model="newAdvertisement.title" type="text"></ion-input>
        </ion-item>


        <ion-item>
          <ion-label position="stacked">Price:</ion-label>
          <ion-input v-model="newAdvertisement.price" inputmode="numeric" placeholder="Enter price"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label class="label-mild" position="floating">Description</ion-label>
          <ion-textarea v-model="newAdvertisement.description" class="description"></ion-textarea>
        </ion-item>

        <ion-item>
          <ion-label class="label-mild" position="floating">Platform type</ion-label>
          <ion-input v-model="newPlatformTag" type="text"></ion-input>

          <ion-button slot="end" color="dark" size="default" @click="addNewPlatformType">
            <ion-icon :icon="add"></ion-icon>
          </ion-button>
        </ion-item>

        <ion-item lines="none">
          <ion-chip v-for="platform in newAdvertisement.platform" :key="platform" color="primary">{{
              platform
            }}
          </ion-chip>
        </ion-item>

        <ion-item>
          <ion-label class="label-mild" position="floating">Item condition</ion-label>

          <ion-select
              placeholder="Select condition"
              @ionChange="conditionSelect($event.detail.value)"

          >
            <ion-select-option value="new">New</ion-select-option>
            <ion-select-option value="used">Used</ion-select-option>
            <ion-select-option value="broken or for parts">Broken or for parts</ion-select-option>
          </ion-select>
        </ion-item>


        <advertisement-address-input @my-event="getAddressFromChild"/>


        <ion-button :disabled="isUploadingAdvertisement" class="button-add" color="dark" fill="solid"
                    size="default" @click="postNewCampSpot">
          <ion-spinner v-if="isUploadingAdvertisement" name="dots"></ion-spinner>
          <span v-else>Publish advertisement 🏕</span>
        </ion-button>

      </ion-list>

    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content {
  background-color: #f4f4f4;
  display: flex;
}

ion-textarea {
  margin-top: 30px;
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

