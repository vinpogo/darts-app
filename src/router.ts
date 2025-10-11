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
        path: '/game',
        component: () => import('./GamePage.vue'),
      },
    ],
  }],
})
