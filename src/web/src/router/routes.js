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
    component: () => import('layouts/MainLayout.vue'),
    props: { showLeftDrawer: true },
    children: [
      {
        path: '',
        components: {
          default: () => import('pages/GraphPage.vue'),
          title: () => import('pages/GraphPageToolbar.vue'),
          left: () => import('pages/GraphPageTreeView.vue'),
          right: () => import('pages/GraphPageEditView.vue'),
        },
      },
    ],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/LandingPage.vue') }],
  },

  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    props: { titleText: 'My Graphs' },
    children: [{ path: '', component: () => import('pages/HomePage.vue') }],
  },

  {
    path: '/category/:key',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/CategoryPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
