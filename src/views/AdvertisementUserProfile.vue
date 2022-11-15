<script lang="ts" setup>
import {authService, directus} from '@/services/directus.service';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
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


const router = useRouter();
const currentUser = ref<object>();
const isLoadingProfile = ref(true);


onIonViewDidEnter(() => {
  getSignedInUser()
})


const getSignedInUser = async () => {
  currentUser.value = await authService.currentUser()
  isLoadingProfile.value = false
}

const logout = async () => {
  await authService.logout()
  await router.push({name: 'Home'})
}

const isUploadingAvatar = ref(false);

const newAvatar = ref({
  image: currentUser.value?.avatar
});


// Handle data POSTing
const postNewAvatar = async () => {
  if (!newAvatar.value.image) {
    alert("Du må laste opp bilde");
    return;
  }

  try {
    isUploadingAvatar.value = true;
    const response = await fetch(newAvatar.value.image);
    const imageBlob = await response.blob();

    const formData = new FormData();
    formData.append('file', imageBlob);
    const fileUpload = await directus.files.createOne(formData);

    if (fileUpload) {
      await directus.users.me.update({
        avatar: fileUpload.id
      });

      const successToast = await toastController.create({
        message: 'Profilbildet ble lastet opp!',
        duration: 1500,
        position: 'bottom',
        color: 'success'
      });

      await successToast.present();
    }

    isUploadingAvatar.value = false;

  } catch (error) {
    const errorToast = await toastController.create({
      message: 'Noe gikk galt ved opplasting!',
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
    newAvatar.value.image = photo.webPath;
    await postNewAvatar()
    await getSignedInUser() // refresh
  }
}

</script>


<template>
  <ion-page>
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

    <ion-content v-if="currentUser && !isLoadingProfile" :fullscreen="true">


      <ion-card v-if="currentUser">
        <IonThumbnail v-if="currentUser.avatar" v-model="currentUser">
          <Image :image-id="currentUser.avatar"/>
        </IonThumbnail>
        <IonThumbnail v-if="!currentUser.avatar">
          <img alt="avatar" src="assets/images/placeholder.jpg"/>
        </IonThumbnail>
        <ion-card-header>
          <ion-card-title>{{ currentUser.first_name + " " + currentUser.last_name }}</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          {{ currentUser.email }}
        </ion-card-content>

        <ion-button fill="outline" @click="triggerCamera">Upload avatar image</ion-button>
        <ion-button fill="outline" @click="logout">Logout</ion-button>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content {

  display: flex;
}

ion-header > * {
  display: flex;
  height: 10vh;

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

ion-card-subtitle {
  --color: #d1fff8;
}

/* iOS places the subtitle above the title */
ion-card-header.ios {
  display: flex;
  flex-flow: column-reverse;
}


</style>

