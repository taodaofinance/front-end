<template>
  <nav>
    <div class="bg-topnav">
      <div class="container-lg p-responsive d-flex">
        <div class="home-tao-dao-logo">
          <router-link :to="{ name: 'home' }">
            <div class="row">
              <img src="~/@/assets/tao_dao_logo-02.png" class="logo-tao mt-4" />
              <h1 class="py-4"></h1>
            </div>
          </router-link>
        </div>
        <div class="mainnav">
          <!-- <div class="drop-menu-item">
            <h4>/test: routes</h4>
            <div class="drop-menu-hidden">
              <router-link :to="{ name: 'dashboard' }" class="">
                <p>dashboard</p>
              </router-link>
              <router-link :to="{ name: 'stake' }" class="">
                <p>stake</p>
              </router-link>
              <router-link :to="{ name: 'bond' }" class="">
                <p>bond</p>
              </router-link>
              <router-link :to="{ name: 'lpstake' }" class="">
                <p>lpstake</p>
              </router-link>
              <router-link :to="{ name: 'migrate' }" class="">
                <p>migrate</p>
              </router-link>
              <router-link :to="{ name: 'app' }" class="">
                <p>app</p>
              </router-link>
            </div>
          </div> -->
          <!--
          <a
            class="button button-dapp-menu"
            target="_blank"
            href="https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x7065dda3f8ec5f6c155648bdee4420c0525d93c6"
            style="height: 2rem; font-size: 16px; font-weight: 600; line-height: 32px"
            >Buy TAO
            </a>
            -->
          <div class="drop-menu-item">
            <h4>Developers</h4>
            <div class="drop-menu-hidden">
              <a target="_blank" href="https://taodao.gitbook.io/taodao/">Gitbook</a>
              <a target="_blank" href="https://github.com/Taoist-DAO/TaoDAO">Github</a>
            </div>
          </div>
          <div class="drop-menu-item">
            <h4>Learn</h4>
            <div class="drop-menu-hidden">
              <router-link :to="{ hash: '#what' }"> What is Tao? </router-link>
              <router-link :to="{ hash: '#how' }"> How it works </router-link>
              <a target="_blank" href="https://taodao-finance.medium.com/"> Blog </a>
            </div>
          </div>
          <!--<div class="drop-menu-item">
            <h4>Governance</h4>
            <div class="drop-menu-hidden">
              <router-link :to="{ name: 'vote' }" class="">
                <p>Vote</p>
              </router-link>
              <router-link :to="{ name: 'forum' }" class="">
                <p>Forum</p>
              </router-link>
            </div>
          </div>-->
          <div class="drop-menu-item">
            <h4>Community</h4>
            <div class="drop-menu-hidden">
              <a target="_blank" href="https://twitter.com/TaoDAO_Finance">Twitter</a>
              <a target="_blank" href="https://discord.gg/vFTCUZ7mpJ">Discord</a>
              <a target="_blank" href="https://taodao-finance.medium.com/">Blog</a>
              <a target="_blank" href="https://www.youtube.com/channel/UCS4Zgjb4lqB8v5RPgrOq1Cw/">Youtube</a>
            </div>
          </div>
        </div>
        <!-- 
      <div class="py-4">
         <div class="py-4">
          <a v-if="address" class="button button-info">
            <span class="login-bullet mr-2 ml-n2" />
            {{ name || shorten(address) }}
          </a>
          <a v-else class="circle-button button button-primary" @click="modalLoginOpen = true">
            Connect wallet
          </a>
        </div> -->
      </div>
    </div>
    <ModalLogin :open="modalLoginOpen" @close="modalLoginOpen = false" />
  </nav>
</template>

<script>
import { mapState } from 'vuex';
import { shorten } from '@/helpers/utils';

export default {
  data() {
    return {
      modalLoginOpen: false,
    };
  },

  computed: mapState({
    name: (state) => state.settings.name,
    address: (state) => state.settings.address,
  }),
  methods: {
    shorten,
  },
};
</script>
