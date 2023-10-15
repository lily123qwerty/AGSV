const routes = [
  {
    path: '/user',
    component: () => import('layouts/BlankLayout.vue'),
    children: [
      {
        path: 'register',
        component: () => import('pages/RegisterPage.vue'),
      },
      {
        path: 'login',
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
