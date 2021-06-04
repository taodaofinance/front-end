<template>
  <footer>
    <div class="footer-row">
      <div class="footer-icon">
        <img src="~/@/assets/tao_dao_logo-02.png" class="logo-tao" />
      </div>

      <div class="footer-menu">
        <div class="footer-menu-column">
          <h4>Developers</h4>
          <a target="_blank" href="https://taodao.gitbook.io/taodao/">Gitbook</a>
          <a target="_blank" href="https://github.com/Taoist-DAO/TaoDAO">Github</a>
        </div>
        <div class="footer-menu-column">
          <h4>Learn</h4>
          <router-link :to="{ hash: '#what' }"> What is Tao? </router-link>
          <router-link :to="{ hash: '#how' }"> How it works </router-link>
          <a target="_blank" href="https://taodao-finance.medium.com"> Blog </a>
        </div>
        <div class="footer-menu-column">
          <h4>Community</h4>
          <a target="_blank" href="https://twitter.com/TaoDAO_Finance">Twitter</a>
          <a target="_blank" href="https://discord.gg/vFTCUZ7mpJ">Discord</a>
          <a target="_blank" href="https://taodao-finance.medium.com">Blog</a>
        </div>
      </div>

      <div class="footer-app-button">
        <router-link :to="{ name: 'dashboard' }" class="button button-primary"> Enter App </router-link>
      </div>
    </div>
    <ModalLogin :open="modalLoginOpen" @close="modalLoginOpen = false" />
  </footer>
</template>

<script>
import { mapState } from 'vuex';
import { shorten } from '@/helpers/utils';
//import useSound from 'vue-use-sound'
//import buttonSfx from '../assets/stakebutton.mp3'

export default {
  //setup() {d
  //  const [play] = useSound(buttonSfx)

  //  return {
  //    play,
  //  }
  //},
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
