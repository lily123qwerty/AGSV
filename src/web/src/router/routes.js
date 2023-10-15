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
    path: '/',
    component: () => import('layouts/GraphLayout.vue'),
    children: [{ path: '', component: () => import('pages/GraphPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
