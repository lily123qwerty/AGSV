const routes = [
  {
    path: '/user',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'register',
        meta: { authRequired: false },
        component: () => import('pages/RegisterPage.vue'),
      },
      {
        path: 'login',
        meta: { authRequired: false },
        component: () => import('pages/LoginPage.vue'),
      },
    ],
  },

  {
    path: '/graph',
    component: () => import('layouts/GraphLayout.vue'),
    children: [{ path: '', component: () => import('pages/GraphPage.vue') }],
  },
  {
    path: '/',
    component: () => import('layouts/LandingLayout.vue'),
    children: [{ path: '', component: () => import('pages/LandingPage.vue') }],
  },

  {
    path: '/home',
    component: () => import('layouts/HomeLayout.vue'),
    children: [{ path: '', component: () => import('pages/HomePage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
