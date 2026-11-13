import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

import PublicLayout from '../layouts/PublicLayout.vue';
import AdminLayout from '../layouts/AdminLayout.vue';

import LoginView from '../views/auth/LoginView.vue';
import RegisterView from '../views/auth/RegisterView.vue';
import VerifyAccountView from '../views/auth/VerifyAccountView.vue';
import Verify2FAView from '../views/auth/Verify2FAView.vue';
import BookAppointmentView from '../views/client/BookAppointmentView.vue';
import ProductsShopView from '../views/client/ProductsShopView.vue';
import CartCheckoutView from '../views/client/CartCheckoutView.vue';
import LandingView from '../views/client/LandingView.vue';
import AboutView from '../views/client/AboutView.vue';

import DashboardView from '../views/admin/DashboardView.vue';
import CalendarView from '../views/admin/CalendarView.vue';
import AppointmentsTableView from '../views/admin/AppointmentsTableView.vue';
import ServicesView from '../views/admin/ServicesView.vue';
import ServiceCategoriesView from '../views/admin/ServiceCategoriesView.vue';
import ProductsAdminView from '../views/admin/ProductsAdminView.vue';
import OffersAdminView from '../views/admin/OffersAdminView.vue';
import SalesAdminView from '../views/admin/SalesAdminView.vue';
import ProductCategoriesView from '../views/admin/ProductCategoriesView.vue';
import UsersView from '../views/admin/UsersView.vue';
import ReportsView from '../views/admin/ReportsView.vue';
import AuditLogsView from '../views/admin/AuditLogsView.vue';
import SessionsView from '../views/admin/SessionsView.vue';
import LandingAdminView from '../views/admin/LandingAdminView.vue';

import ProfileView from '../views/profile/ProfileView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'landing', component: LandingView },
      { path: 'about', name: 'about', component: AboutView },
      { path: 'login', name: 'login', component: LoginView },
      { path: 'register', name: 'register', component: RegisterView },
      { path: 'verify-account', name: 'verify-account', component: VerifyAccountView },
      { path: 'verify-2fa', name: 'verify-2fa', component: Verify2FAView },
      {
        path: 'shop',
        redirect: '/client/shop',
      },
      {
        path: 'cart',
        redirect: '/client/cart',
      },
      {
        path: 'client/book',
        name: 'book-appointment',
        component: BookAppointmentView,
        meta: { requiresAuth: true },
      },
      {
        path: 'client/shop',
        name: 'client-shop',
        component: ProductsShopView,
        meta: { requiresAuth: false },
      },
      {
        path: 'client/cart',
        name: 'client-cart',
        component: CartCheckoutView,
        meta: { requiresAuth: false },
      },
      {
        path: 'client/profile',
        name: 'client-profile',
        component: ProfileView,
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'admin-dashboard', component: DashboardView },
      {
        path: 'calendar',
        name: 'admin-calendar',
        component: CalendarView,
        meta: { module: 'appointments', action: 'view' },
      },
      {
        path: 'appointments',
        name: 'admin-appointments',
        component: AppointmentsTableView,
        meta: { module: 'appointments', action: 'view' },
      },
      {
        path: 'services',
        name: 'admin-services',
        component: ServicesView,
        meta: { module: 'services', action: 'view' },
      },
      {
        path: 'service-categories',
        name: 'admin-service-categories',
        component: ServiceCategoriesView,
        meta: { module: 'services', action: 'view' },
      },
      {
        path: 'products',
        name: 'admin-products',
        component: ProductsAdminView,
        meta: { module: 'products', action: 'view' },
      },
      {
        path: 'products/offers',
        name: 'admin-products-offers',
        component: OffersAdminView,
        meta: { module: 'products', action: 'manage_offers' },
      },
      {
        path: 'products/sales',
        name: 'admin-products-sales',
        component: SalesAdminView,
        meta: { module: 'orders', action: 'view' },
      },
      {
        path: 'product-categories',
        name: 'admin-product-categories',
        component: ProductCategoriesView,
        meta: { module: 'products', action: 'view' },
      },
      {
        path: 'orders',
        name: 'admin-orders',
        component: SalesAdminView,
        meta: { module: 'orders', action: 'view' },
      },
      {
        path: 'users',
        name: 'admin-users',
        component: UsersView,
        meta: { module: 'admin', action: 'users' },
      },
      {
        path: 'reports',
        name: 'admin-reports',
        component: ReportsView,
        meta: { module: 'reports', action: 'view' },
      },
      {
        path: 'audit-logs',
        name: 'admin-audit-logs',
        component: AuditLogsView,
        meta: { requiresSuperAdmin: true },
      },
      {
        path: 'sessions',
        name: 'admin-sessions',
        component: SessionsView,
        meta: { module: 'admin', action: 'sessions' },
      },
      {
        path: 'profile',
        name: 'admin-profile',
        component: ProfileView,
      },
      {
        path: 'landing',
        name: 'admin-landing',
        component: LandingAdminView,
        meta: { module: 'landing', action: 'edit' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

/**
  * Navigation Guard Global
  * Ejecuta authStore.initAuth() (Silent Refresh) antes de resolver la navegación inicial.
  */
router.beforeEach(async (to, _from, next) => {
  const authStore = useAuthStore();

  // Silent Refresh al cargar/refrescar la app
  if (!authStore.isInitialized) {
    await authStore.initAuth();
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' });
    return;
  }

  if (to.meta.requiresSuperAdmin && authStore.userRole !== 'superadmin') {
    next({ name: 'admin-dashboard' });
    return;
  }

  if (to.meta.module && to.meta.action) {
    const hasPerm = authStore.hasPermission(to.meta.module as string, to.meta.action as string);
    if (!hasPerm) {
      next({ name: 'admin-dashboard' });
      return;
    }
  }

  next();
});

export default router;
