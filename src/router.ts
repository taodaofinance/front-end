import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import Dapp from './views/Dapp.vue';
import Dashboard from './views/Dashboard.vue';
import Stake from './views/Stake.vue';
import Bond from './views/Bond.vue';
import Migrate from './views/Swap.vue';
import LPStaking from './views/LPStaking.vue';
import Presale from './views/Presale.vue';
import Vested from './views/Vested.vue';
//import Presale3 from './views/Presale3.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  { path: '/', name: 'home', component: Home },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/stake', name: 'stake', component: Stake },
  { path: '/bond', name: 'bond', component: Bond },
  { path: '/lpstake', name: 'lpstake', component: LPStaking },
  { path: '/vested', name: 'vested', component: Vested },
  { path: '/app', name: 'dapp', component: Dapp }
];

const router = new VueRouter({
  routes,
  mode: 'history',

  scrollBehavior(to) {
    if (to.hash) {
      const element = document.getElementById(to.hash.slice(1));
      if (element) {
        return window.scrollTo({
          top: element.offsetTop,
          behavior: 'smooth'
        });
      }
    }
    return window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

export default router;
