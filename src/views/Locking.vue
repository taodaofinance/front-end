<template>
  <div>
    <div id="dapp" class="dapp">
      <!-- <VueLoadingIndicator v-if="settings.loading" class="overlay big" /> 
      <div v-else>
      </div>-->

      <Navbar />
      <div class="wrapper">
        <div class="dapp-center-modal">
          <div class="dapp-modal-wrapper">
            <div class="swap-input-column">
              <div class="stake-toggle-row">
                <toggle-switch
                  :options="myOptions"
                  v-model="selectedMapOption"
                  :value="selectedMapOption"
                />
              </div>

              <div class="swap-input-row">
                <div class="stake-input-container">
                  <input
                    v-model="quantity"
                    placeholder="Type an amount"
                    class="stake-input"
                    type="text"
                  />
                </div>
                <div class="cur-max-box">
                  <div class="max-button" @click="setStake(100)">100%</div>
                </div>
              </div>

              <div class="stake-price-data-column">
                <div class="stake-price-data-row">
                  <p class="price-label">Balance</p>
                  <p class="price-data">{{ trim($store.state.settings.ohmBalance, 4) }} TAO</p>
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">Locked</p>
                  <p class="price-data">{{ trim($store.state.settings.sohmBalance, 4) }} TAO</p>
                </div>         
              </div>

              <div v-if="hasAllowance" class="stake-button-container">
                <div class="stake-button" @click="executeStake">{{ selectedMapOption }}</div>
              </div>
              <div v-else class="stake-button-container">
                <div class="stake-button" @click="seekApproval">Approve</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <ModalLogin :open="modalLoginOpen" @close="modalLoginOpen = false" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { shorten } from '@/helpers/utils.ts';
import { ethers } from 'ethers';

export default {
  async mounted() {
    this.$store.state.settings.menuOpened = false;
  },
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
          noBorder: false
        },
        size: {
          fontSize: 1,
          height: 2.5,
          padding: 0.3,
          width: 15,
          borderRadius: 5
        },
        items: {
          delay: 0.4,
          preSelected: 'unknown',
          disabled: false,
          labels: [
            { name: 'Lock', color: 'black', backgroundColor: 'white' },
            { name: 'Unlock', color: 'black', backgroundColor: 'white' }
          ]
        }
      },
      selectedMapOption: 'Lock',
      quantity: '',
      stakeToggle: true,
      modalLoginOpen: false
    };
  },
  computed: {
    ...mapState(['settings']),
    isValid() {
      return parseFloat(this.form.quantity);
    },
    address() {
      if (this.$store.state.settings.address) return this.$store.state.settings.address;
      return null;
    },
    hasAllowance() {
      if (parseFloat(this.quantity)) {
        switch (this.selectedMapOption) {
          case 'Stake':
            return (
              parseInt(this.$store.state.settings.stakeAllowance) >=
              parseInt(ethers.utils.parseUnits(this.quantity.toString(), 'gwei'))
            );
          case 'Unstake':
            return (
              parseInt(this.$store.state.settings.unstakeAllowance) >=
              parseInt(ethers.utils.parseUnits(this.quantity.toString(), 'gwei'))
            );
        }
      }
      return false;
    }
  },

  methods: {
    ...mapActions([
      'SendDai',
      'getStakeApproval',
      'stakeTAO',
      'unstakeTAO',
      'getunStakeApproval',
      'getStakingAPY'
    ]),
    async executeStake() {
      console.log(this.selectedMapOption);
      switch (this.selectedMapOption) {
        case 'Stake':
          await this.stakeTAO(this.quantity.toString());
          break;
        case 'Unstake':
          await this.unstakeTAO(this.quantity.toString());
      }
      //updatestats
    },
    setStake(value) {
      console.log(`Set stake ${value}`);
      switch (this.selectedMapOption) {
        case 'Stake':
          this.quantity = this.$store.state.settings.ohmBalance;
          break;
        case 'Unstake':
          this.quantity = this.$store.state.settings.sohmBalance;
      }
    },

    trim(number, precision) {
      if (number == undefined) {
        number = 0;
      }
      const array = number.toString().split('.');
      array.push(array.pop().substring(0, precision));
      const trimmedNumber = array.join('.');
      return trimmedNumber;
    },

    async seekApproval() {
      switch (this.selectedMapOption) {
        case 'Stake':
          await this.getStakeApproval(this.quantity.toString());
          break;
        case 'Unstake':
          await this.getunStakeApproval(this.quantity.toString());
      }
    },
    shorten(addr) {
      return shorten(addr);
    },
    maxStake() {
      this.form.quantity = this.$store.state.settings.balance;
    },
    disconnect() {
      if (this.$store.state.settings.address) return this.$store.state.address.initial;
      return null;
    }
  }
};
</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>
