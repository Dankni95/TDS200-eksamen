<script lang="ts" setup>
import {authService, directus} from '@/services/directus.service';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonSpinner,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  onIonViewDidEnter,
  toastController
} from '@ionic/vue';
import {ref} from 'vue';
import {useRouter} from 'vue-router';
import {Camera, CameraResultType} from '@capacitor/camera';
import Image from "@/components/AdvertisementImage.vue";
import {ICurrentUser} from '@/models/IAdvertisementResponse';

const userResponse = ref<ICurrentUser>({
  id: "",
  first_name: '',
  last_name: '',
  email: '',
  avatar: ""
});

const router = useRouter();
const isLoadingProfile = ref(true);


onIonViewDidEnter(() => {
  getSignedInUser()
})


const getSignedInUser = async () => {
  userResponse.value = await authService.currentUser()
  isLoadingProfile.value = false
}
1
const logout = async () => {
  await authService.logout()

  const successToast = await toastController.create({
    message: "You are now logged out!",
    duration: 1500,
    position: 'bottom',
    color: 'success'
  });

  await successToast.present()
  await router.push({name: 'Home'})
  localStorage.clear()
}

const isUploadingAvatar = ref(false);


// Handle data POST
const postNewAvatar = async (webPath: string) => {


  try {
    isUploadingAvatar.value = true;
    const response = await fetch(webPath);
    const imageBlob = await response.blob();

    const formData = new FormData();
    formData.append('file', imageBlob);
    const fileUpload = await directus.files.createOne(formData);

    if (fileUpload) {
      await directus.users.me.update({
        avatar: fileUpload.id
      });

      userResponse.value.avatar = fileUpload.id

      const successToast = await toastController.create({
        message: 'Avatar updated!',
        duration: 1500,
        position: 'bottom',
        color: 'success'
      });

      await successToast.present();
    }

    isUploadingAvatar.value = false;

  } catch (error) {
    const errorToast = await toastController.create({
      message: 'Something went wrong while uploading!',
      duration: 2500,
      position: 'bottom',
      color: 'danger'
    });

    await errorToast.present();
    console.error(error);
    isUploadingAvatar.value = false;
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
    await postNewAvatar(photo.webPath)
  }
}

</script>

<template>
  <ion-page :style="{backgroundImage:'url(assets/images/bg-1.jpg)'}">
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>
          <ion-spinner v-if="isLoadingProfile"/>
          <ion-title v-if="!isLoadingProfile">Profile page</ion-title>
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content v-if="userResponse && !isLoadingProfile" :fullscreen="true">


      <ion-card v-if="userResponse">
        <IonThumbnail v-if="userResponse.avatar" v-model="userResponse">
          <Image :image-id="userResponse.avatar"/>
        </IonThumbnail>
        <IonThumbnail v-if="!userResponse.avatar">
          <img alt="avatar" src="assets/images/placeholder.jpg"/>
        </IonThumbnail>
        <ion-card-header>
          <ion-card-title>{{ userResponse.first_name }} {{ userResponse.last_name }}</ion-card-title>
        </ion-card-header>

        <ion-card-content style="color: yellow">
          {{ userResponse.email }}
        </ion-card-content>

      </ion-card>
      <div style=" text-align: center;">
        <ion-button color="secondary" fill="solid" @click="triggerCamera">Upload avatar image</ion-button>
        <ion-button color="secondary" fill="solid" @click="logout">Logout</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content {
  --ion-background-color: transparent;
  display: flex;
}

ion-header > * {
  display: flex;
  height: 10vh;


}

ion-card {
  background-color: purple;
  opacity: 0.8;
  border-radius: 300px;
}

ion-card > * {
  display: block;
  text-align: center;
  margin: 0 auto;

}

ion-card-title {
  --color: #52ffe4;
}

ion-thumbnail {
  display: block;
  margin-top: 5%;
  margin-left: auto;
  margin-right: auto;
}

/* iOS places the subtitle above the title */
ion-card-header.ios {
  display: flex;
  flex-flow: column-reverse;
}


</style>

