import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import DashboardView from './views/DashboardView.vue';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
  },
];
export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});