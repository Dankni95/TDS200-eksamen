<script lang="ts" setup>
import {authService} from '@/services/directus.service';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToggle,
  IonToolbar,
  toastController
} from '@ionic/vue';
import {ref} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();


// The user can toggle between login and register mode in the form to show/hide additional fields
const inRegisterMode = ref(false);

// Provides two-way data binding between Vue and the input fields in the form
const userDetails = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
});

const login = async () => {
  try {
    await authService.login(userDetails.value.email, userDetails.value.password);
    await router.push({name: 'Home'})

  } catch (error) {

    const errorToast = await toastController.create({
      message: error?.message,
      duration: 2500,
      position: 'bottom',
      color: 'danger'
    });

    await errorToast.present();
    console.error(error);
  }
}

const register = async () => {
  try {
    await authService.register(userDetails.value.firstName, userDetails.value.lastName, userDetails.value.email, userDetails.value.password);
    await login();

    const successToast = await toastController.create({
      message: 'Annonsen ble publisert!',
      duration: 1500,
      position: 'bottom',
      color: 'success'
    });

    await successToast.present();
  } catch (error) {
    const errorToast = await toastController.create({
      message: error?.message,
      duration: 2500,
      position: 'bottom',
      color: 'danger'
    });

    await errorToast.present();
    console.error(error);
  }
}

</script>

<template>

  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Log in or register</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>


        <ion-item lines="none">
          <ion-label class="label-mild">Create account?</ion-label>
          <ion-toggle color="dark" @ion-change="inRegisterMode = !inRegisterMode"></ion-toggle>
        </ion-item>

        <hr/>


        <ion-item v-if="inRegisterMode">
          <ion-label class="label-mild" position="floating">First name</ion-label>
          <ion-input v-model="userDetails.firstName"></ion-input>
        </ion-item>

        <ion-item v-if="inRegisterMode">
          <ion-label class="label-mild" position="floating">Last name</ion-label>
          <ion-input v-model="userDetails.lastName"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label class="label-mild" position="floating">Email</ion-label>
          <ion-input v-model="userDetails.email" type="email"></ion-input>
        </ion-item>

        <ion-item>
          <ion-label class="label-mild" position="floating">Password</ion-label>
          <ion-input v-model="userDetails.password" type="password"></ion-input>
        </ion-item>

        <ion-button v-if="inRegisterMode" class="button-auth" color="dark" fill="solid" size="default"
                    @click="register">
          Create account
        </ion-button>

        <ion-button v-else class="button-auth" color="dark" fill="solid" size="default" @click="login">
          Log in
        </ion-button>

      </ion-list>

    </ion-content>
  </ion-page>
</template>

<style scoped>
ion-content {
  --ion-background-color: #f4f4f4;
  display: flex;
}

ion-list {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.label-mild {
  --color: #8a8a8a !important;
}

.hero-image {
  width: 80vw;
  align-self: center;
}

.button-auth {
  margin-top: 50px;
  margin-left: 10px;
  margin-right: 10px;
}
</style>