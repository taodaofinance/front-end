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
                  <p class="price-label">Staked</p>
                  <p class="price-data">{{ trim($store.state.settings.sohmBalance, 4) }} TAO</p>
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">Next Epoch Rewards</p>
                  <p class="price-data">
                    {{ trim($store.state.settings.nextEpochRewards, 4) }} TAO
                  </p>
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">Current Epoch</p>
                  <p class="price-data">
                    <!-- <vue-countdown
                      :time="
                        ($store.state.settings.currentBlock -
                        $store.state.settings.epochStarted) *
                        3 *
                        1000
                      "
                      v-slot="{ days, hours, minutes, seconds }"
                    >
                      {{ days }}d, {{ hours }}h, {{ minutes }}m, {{ seconds }} seconds
                    </vue-countdown> -->

                    {{
                      Math.floor(
                        ($store.state.settings.currentBlock - $store.state.settings.epochStarted) /
                          $store.state.settings.epochInterval
                      ) + 1
                    }}
                  </p>
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">Next Epoch</p>
                  <p class="price-data">
                    <vue-countdown
                      :time="
                        ($store.state.settings.nextEpochBlock -
                          $store.state.settings.currentBlock) *
                          3 *
                          1000
                      "
                      v-slot="{ days, hours, minutes, seconds }"
                    >
                      {{ days }}d, {{ hours }}h, {{ minutes }}m, {{ seconds }} seconds
                    </vue-countdown>
                  </p>
                </div>

                <div class="stake-price-data-row">
                  <p class="price-label">Upcoming rebase</p>
                  <p class="price-data">
                    {{ ($store.state.settings.stakingRebase * 100) | formatNumber }} %
                  </p>
                  <!-- profit / staked supply -->
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">5 days rate</p>
                  <p class="price-data">
                    {{ ($store.state.settings.fiveDayRate * 100) | formatNumber }} %
                  </p>
                  <!-- profit / staked supply -->
                </div>

                <div class="stake-price-data-row">
                  <p class="price-label">Upcoming APY</p>

                  <p class="price-data">
                    {{
                      $store.state.settings.stakingAPY !== 0 &&
                      $store.state.settings.stakingAPY !== 100
                        ? ($store.state.settings.stakingAPY | formatNumber) + '%'
                        : 'Double reward last epoch, Reward will return epoch after'
                    }}
                  </p>
                  <!-- 1+rebase^1095-1 -->
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">Current index</p>
                  <p class="price-data">{{ trim($store.state.settings.currentIndex, 4) }} TAO</p>
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
