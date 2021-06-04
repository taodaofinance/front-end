<template>
  <div class="dapp-sidebar">
    <div class="dapp-menu-top">
      <div class="branding-header">
        <router-link :to="{ name: 'home' }" class="branding-header-logo-link">
          <img class="branding-header-icon" src="~/@/assets/taodao_logo.png" alt="" />
        </router-link>
      </div>
      <div class="branding-menu h-hidden-desktop">
        <div @click="$store.state.settings.menuOpened = !$store.state.settings.menuOpened">
          <b-icon
            v-if="$store.state.settings.menuOpened == false"
            icon="list"
            style="width: 30px; height: 30px"
          ></b-icon>
          <b-icon
            v-if="$store.state.settings.menuOpened == true"
            icon="x"
            style="width: 30px; height: 30px"
          ></b-icon>
        </div>
      </div>
      <div class="wallet-menu h-hidden-mobile">
        <a
          v-if="address"
          class="disconnect-button button-primary button"
          @click="$store.state.settings.address = ''"
          >Disconnect</a
        >
        <a v-if="address" class="dapp-sidebar-button-connected button button-info">
          <span class="login-bullet mr-2 ml-n2" />
          {{ shorten(address) }}
        </a>
        <a
          v-else
          class="button button-primary"
          @click="$store.state.settings.modalLoginOpen = true"
        >
          Connect wallet
        </a>
      </div>
    </div>
    <div class="dapp-menu-links h-hidden-mobile">
      <Dav />
    </div>
    <div class="dapp-menu-social h-hidden-mobile">
      <Social />
    </div>
    <div
      class="dapp-menu-mobile-fs h-hidden-desktop"
      v-if="$store.state.settings.menuOpened == true"
      v-bind:style="{
        height: $store.state.settings.menuOpened == true ? 'calc(100vh - 80px)' : '0px',
      }"
    >
      <Dav />
      <Social />
      <a
        v-if="address"
        class="disconnect-button button-primary button"
        @click="$store.state.settings.address = ''"
        >Disconnect</a
      >
      <a v-if="address" class="dapp-sidebar-button-connected button button-info">
        <span class="login-bullet mr-2 ml-n2" />
        {{ shorten(address) }}
      </a>
      <a v-else class="button button-primary" @click="$store.state.settings.modalLoginOpen = true">
        Connect wallet
      </a>
    </div>
    <ModalLogin
      :open="$store.state.settings.modalLoginOpen"
      @close="$store.state.settings.modalLoginOpen = false"
    />
  </div>
</template>


<script>
import { mapState, mapActions } from 'vuex';
import { shorten } from '@/helpers/utils.ts';
import { ethers } from 'ethers';
export default {
  data() {
    return {
      myOptions: {
        layout: {
          color: 'white',
          backgroundColor: '#282828',
          selectedColor: 'white',
          selectedBackgroundColor: 'green',
          borderColor: 'white',
          fontFamily: 'Arial',
          fontWeight: 'normal',
          lineHeight: '1',
          fontWeightSelected: 'bold',
          squareCorners: false,
          noBorder: false,
        },
        size: {
          fontSize: 1,
          height: 2.5,
          padding: 0.3,
          width: 15,
          borderRadius: 5,
        },
        items: {
          delay: 0.4,
          preSelected: 'unknown',
          disabled: false,
          labels: [
            { name: 'Bond', color: 'black', backgroundColor: 'white' },
            { name: 'Redeem', color: 'black', backgroundColor: 'white' },
          ],
        },
      },
      selectedMapOption: 'Bond',
      bondToggle: true,
    };
  },  
  computed: {
    ...mapState(['settings']),

    address() {
      if (this.$store.state.settings.address) return this.settings.address;
      return null;
    },
    disconnect() {
      if (this.$store.state.settings.address) return this.$store.state.address.initial;
      return null;
    },
  },
  methods: {
    shorten,

    trim(number, precision) {
      if (number == undefined) {
        number = 0;
      }
      const array = number.toString().split('.');
      array.push(array.pop().substring(0, precision));
      const trimmedNumber = array.join('.');
      return trimmedNumber;
    },
  },
};
</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>