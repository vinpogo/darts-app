import { createRouter, createWebHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHistory(),
  routes: [{
    path: '/',
    component: () => import('./LandingPage.vue'),
    children: [
      {
        path: '/profile',
        component: () => import('./profile/ProfilePage.vue'),
      },
      {
        path: '/profile/new',
        component: () => import('./profile/NewProfilePage.vue'),
      },
      {
        path: '/game',
        component: () => import('./game/GamePage.vue'),
      },
    ],
  }],
})
