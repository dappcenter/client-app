
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: '/blocks', component: () => import('pages/Blocks.vue') },
      { path: '/block/:block', component: () => import('pages/Block.vue') },
      { path: '/transactions', component: () => import('pages/Transactions.vue') },
      { path: '/tx/:hash', component: () => import('pages/Transaction.vue') },
      { path: '/accounts', component: () => import('pages/Accounts.vue') },
      { path: '/address/:address', component: () => import('pages/Account.vue') },
      { path: '/tokens', component: () => import('pages/Tokens.vue') },
      { path: '/token/:id', component: () => import('pages/Token.vue') },
      { path: '/search', component: () => import('pages/Search.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
