import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import UserProfile from "../views/AdvertisementUserProfile.vue";
import DetailPage from "@/views/SingleAdvertisementPage.vue";
import AuthenticationPage from "@/views/AuthenticationPage.vue";
import NewAdvertisement from "@/views/NewAdvertisementPage.vue";
import { authService } from "@/services/directus.service";
import { toastController } from "@ionic/vue";

const authenticationRequiredRouteGuard = async () => {
  const userAccessToken = localStorage.getItem("auth_token");

  if (!userAccessToken) {
    return { name: "Login" }
  }

  const userAccessTokenExpiresAt = localStorage.getItem("auth_expires_at") as unknown as number;

  if (userAccessTokenExpiresAt < new Date().getTime()) {

    const errorToast = await toastController.create({
      message: "Your session is expired",
      duration: 3000,
      color: "warning"
    });

    await errorToast.present();
    
    await authService.logout();
    return { name: "Login" }
  }


}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/profile",
    name: "Profile",
    component: UserProfile,
    beforeEnter: [authenticationRequiredRouteGuard]
  },
  {
    path: "/authentication",
    name: "Login",
    component: AuthenticationPage,
  },
  {
    path: "/new-advertisement",
    name: "NewAdvertisement",
    component: NewAdvertisement,
    beforeEnter: [authenticationRequiredRouteGuard]
  },
  {
    path: "/detail/:id",
    name: "Detail",
    component: DetailPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
