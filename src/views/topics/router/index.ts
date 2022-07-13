import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/topicList',
  },
  {
    path: '/topicList',
    name: 'topicList',
    component: () => import('@/views/topics/topicsList/TopicList.vue'),
    meta: {
      title: '话题列表',
    },
  },
  {
    path: '/topicEdit',
    name: 'topicEdit',
    component: () => import('@/views/topics/topicsEdit/TopicEdit.vue'),
    meta: {
      title: '话题新增或编辑',
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  if (typeof to.meta.title === 'string') document.title = to.meta.title;
  next();
});

export default router;
