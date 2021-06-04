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

              <div v-if="isUnstake == false" class="swap-input-row">
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
              <div v-if="isUnstake == true"></div>

              <div class="stake-price-data-column">
                <div class="stake-price-data-row">
                  <p class="price-label">Balance</p>
                  <p class="price-data">
                    {{ trim($store.state.settings.lpBalance, 4) }} TAO / BUSD LP
                  </p>
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">Staked</p>
                  <p class="price-data">
                    {{ trim($store.state.settings.lpStaked, 4) }} TAO / BUSD LP
                  </p>
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">Pending Rewards</p>
                  <p class="price-data">{{ trim($store.state.settings.pendingRewards, 4) }} TAO</p>
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">APR</p>
                  <p class="price-data">{{ trim($store.state.settings.lpStakingAPY, 4) }}%</p>
                  <!-- 1+rebase^1095-1 -->
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">Total Staked</p>
                  <p class="price-data">
                    {{ trim($store.state.settings.totalLPStaked, 4) }} TAO / BUSD LP
                  </p>
                </div>
              </div>

              <div v-if="hasAllowance" class="stake-button-container">
                <div class="stake-button" @click="executeStake">{{ selectedMapOption }}</div>
              </div>
              <div v-else-if="isUnstake == true" class="stake-button-container">
                <div class="stake-button" @click="executeStake">
                  {{ selectedMapOption }} / Claim
                </div>

                <div class="stake-button" @click="claimLPRewards">Claim Rewards</div>
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
            { name: 'Stake', color: 'black', backgroundColor: 'white' },
            { name: 'Unstake', color: 'black', backgroundColor: 'white' }
          ]
        }
      },
      selectedMapOption: 'Stake',
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
              parseInt(this.$store.state.settings.lpStakeAllowance) >=
              parseInt(ethers.utils.parseUnits(this.quantity.toString(), 'ether'))
            );
          case 'Unstake':
            return true;
        }
      }
      return false;
    },

    isUnstake() {
      if (this.selectedMapOption) {
        switch (this.selectedMapOption) {
          case 'Unstake':
            return true;
        }
      }
      return false;
    }
  },

  methods: {
    ...mapActions(['getLPStakeApproval', 'stakeLP', 'unstakeLP', 'claimRewards']),
    async executeStake() {
      console.log(this.selectedMapOption);
      switch (this.selectedMapOption) {
        case 'Stake':
          await this.stakeLP(this.quantity.toString());
          break;
        case 'Unstake':
          await this.unstakeLP();
      }
      //updatestats
    },

    async claimLPRewards() {
      await this.claimRewards();
    },

    setStake(value) {
      switch (this.selectedMapOption) {
        case 'Stake':
          this.quantity = this.$store.state.settings.lpBalance;
          break;
      }
    },
    async seekApproval() {
      switch (this.selectedMapOption) {
        case 'Stake':
          await this.getLPStakeApproval(this.quantity.toString());
          break;
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

    shorten(addr) {
      return shorten(addr);
    },
    maxStake() {
      this.form.quantity = this.$store.state.settings.lpBalance;
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
