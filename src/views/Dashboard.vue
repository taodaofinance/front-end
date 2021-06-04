<template>
  <div>
    <div id="dapp" class="dapp">
      <!-- <VueLoadingIndicator v-if="settings.loading" class="overlay big" /> 
      <div v-else>
      </div>-->

      <Navbar />
      <div class="wrapper">
        <div class="dapp-center-modal-dash">
          <b-container class="container-fullwidth">
            <b-row>
              <b-col lg="6" md="6" style="padding-right: 40px;border-right: 1px solidrgba(0, 0, 0, 0.623); ">
                <h2 class="stats-title">TAO Stats</h2>

                <div class="dapp-center-stats-row">
                  <div class="dapp-center-stats-logo">
                    <b-icon icon="people" class="logos"></b-icon>
                  </div>
                  <div class="dapp-center-stats-content">
                    <div class="dapp-center-stats-title">TAOists</div>
                    <div class="dapp-center-stats-subtitle">
                      {{ $store.state.settings.taoists | formatInteger }}
                    </div>
                  </div>
                </div>

                <div class="dapp-center-stats-row">
                  <div class="dapp-center-stats-logo">
                    <b-icon class="logos" icon="circle-fill"></b-icon>
                  </div>
                  <div class="dapp-center-stats-content">
                    <div class="dapp-center-stats-title">Total Supply</div>
                    {{ $store.state.settings.totalSupply | formatNumber }} TAO
                  </div>
                </div>

                <div class="dapp-center-stats-row">
                  <div class="dapp-center-stats-logo">
                    <b-icon class="logos" icon="circle-half"></b-icon>
                  </div>
                  <div class="dapp-center-stats-content">
                    <div class="dapp-center-stats-title">Circulating Supply</div>
                    
                    {{ $store.state.settings.circSupply | formatNumber }} TAO
                  </div>
                </div>

                <div class="dapp-center-stats-row">
                  <div class="dapp-center-stats-logo">
                    <img src="~/@/assets/coin.png" class="logos" alt="" />
                  </div>
                  <div class="dapp-center-stats-content">
                    <div class="dapp-center-stats-title">TAO Price</div>
                    <div class="dapp-center-stats-subtitle">
                      {{ $store.state.settings.marketPrice | formatCurrency }}
                    </div>
                  </div>
                </div>

                <div class="dapp-center-stats-row">
                  <div class="dapp-center-stats-logo">
                    <b-icon class="logos" icon="percent"></b-icon>
                  </div>
                  <div class="dapp-center-stats-content">
                    <div class="dapp-center-stats-title">APY Staking</div>
                    <div class="dapp-center-stats-subtitle">
                      {{ $store.state.settings.stakingAPY | formatNumber }} %
                    </div>
                  </div>
                </div>

                <div class="dapp-center-stats-row">
                  <div class="dapp-center-stats-logo">
                    <b-icon class="logos" icon="percent"></b-icon>
                  </div>
                  <div class="dapp-center-stats-content">
                    <div class="dapp-center-stats-title">APR LP Staking</div>
                    <div class="dapp-center-stats-subtitle">
                      {{ $store.state.settings.lpStakingAPY | formatNumber }} %
                    </div>
                  </div>
                </div>
              </b-col>
              <b-col lg="6" md="6" class="protocol-stats">
                <h2 class="stats-title">Protocol Stats</h2>
                <div class="dapp-center-stats-row">
                  <div class="dapp-center-stats-logo">
                    <b-icon class="logos" icon="cash-stack"></b-icon>
                  </div>
                  <div class="dapp-center-stats-content">
                    <div class="dapp-center-stats-title">Circ. Market Cap</div>
                    <div class="dapp-center-stats-subtitle">
                      {{                        
                          parseFloat($store.state.settings.circSupply) *
                            $store.state.settings.marketPrice,
                          | formatCurrency
                      }}
                    </div>
                  </div>
                </div>

                <div class="dapp-center-stats-row">
                  <div class="dapp-center-stats-logo">
                    <b-icon icon="circle-square" class="logos"></b-icon>
                  </div>
                  <div class="dapp-center-stats-content">
                    <div class="dapp-center-stats-title">Risk free treasury assets</div>
                    <div class="dapp-center-stats-subtitle">
                      {{ $store.state.settings.principleValuation | formatCurrency }}
                    </div>
                  </div>
                </div>

                <div class="dapp-center-stats-row">
                  <div class="dapp-center-stats-logo">
                    <b-icon icon="droplet" class="logos"></b-icon>
                  </div>
                  <div class="dapp-center-stats-content">
                    <div class="dapp-center-stats-title">Protocol owned liquidity</div>
                    <div class="dapp-center-stats-subtitle">
                      {{
                        ((parseFloat($store.state.settings.lpInVault) +
                          parseFloat($store.state.settings.lpLocked)) *
                          $store.state.settings.lpPrice)
                          | formatCurrency
                      }}
                    </div>
                  </div>
                </div>

                <div class="dapp-center-stats-row">
                  <div class="dapp-center-stats-logo">
                    <b-icon icon="shield-lock-fill" class="logos"></b-icon>
                  </div>
                  <div class="dapp-center-stats-content">
                    <div class="dapp-center-stats-title">TVL</div>
                    <div class="dapp-center-stats-subtitle">
                      {{
                        ($store.state.settings.taoStaked * $store.state.settings.marketPrice +
                          $store.state.settings.totalLPStaked * $store.state.settings.lpPrice)
                          | formatCurrency
                      }}
                    </div>
                  </div>
                </div>

                <div class="dapp-center-stats-row">
                  <div class="dapp-center-stats-logo">
                    <b-icon icon="percent" class="logos"></b-icon>
                  </div>
                  <div class="dapp-center-stats-content">
                    <div class="dapp-center-stats-title">Bonding Debt Ratio</div>
                    <div class="dapp-center-stats-subtitle">
                      {{ ($store.state.settings.debtRatio / 10000000) | formatNumber }} %
                    </div>
                  </div>
                </div>

                <div class="dapp-center-stats-row">
                  <div class="dapp-center-stats-logo">
                    <b-icon icon="percent" class="logos"></b-icon>
                  </div>
                  <div class="dapp-center-stats-content">
                    <div class="dapp-center-stats-title">Bonding Discount</div>
                    <div class="dapp-center-stats-subtitle">
                      {{ ($store.state.settings.bondDiscount * 100) | formatNumber }} %
                    </div>
                  </div>
                </div>
              </b-col>
            </b-row>
            <hr style="background: #fff" />
            <b-row style="margin-top: 40px; margin-left: 10px; margin-right: 10px">
              <b-col sm="5">
                <h2 class="stats-title" style="margin-top: 15px">Your stats</h2>
              </b-col>
              <b-col sm="3">
                <div class="dapp-center-stats-row">
                  <div class="dapp-center-stats-content">
                    <div class="dapp-center-stats-title">Balance</div>
                    <div class="dapp-center-stats-subtitle">
                      {{ $store.state.settings.ohmBalance | formatNumber }} TAO
                    </div>
                    <div class="dapp-center-stats-subtitle">
                      {{ $store.state.settings.lpBalance | formatLP }} LP
                    </div>
                  </div>
                </div>
              </b-col>
              <b-col sm="3">
                <div class="dapp-center-stats-row">
                  <div class="dapp-center-stats-content">
                    <div class="dapp-center-stats-title">Staked</div>
                    <div class="dapp-center-stats-subtitle">
                      {{ $store.state.settings.sohmBalance | formatNumber }} TAO
                    </div>
                    <div class="dapp-center-stats-subtitle">
                      {{ $store.state.settings.lpStaked | formatLP }} LP
                    </div>
                  </div>
                </div>
              </b-col>
              <b-col sm="3">
                <div class="dapp-center-stats-row">
                  <div class="dapp-center-stats-content">
                    <div class="dapp-center-stats-title">Total Value</div>
                    <div class="dapp-center-stats-subtitle"></div>
                    <div class="dapp-center-stats-subtitle">
                      {{
                        ((parseFloat($store.state.settings.ohmBalance) +
                          parseFloat($store.state.settings.sohmBalance)) *
                          parseFloat($store.state.settings.marketPrice) +
                          (parseFloat($store.state.settings.lpBalance) +
                            parseFloat($store.state.settings.lpStaked)) *
                            parseFloat($store.state.settings.lpPrice))
                          | formatCurrency
                      }}
                    </div>
                  </div>
                </div>
              </b-col>
            </b-row>
          </b-container>

          <!-- 
          <div class="dapp-modal-wrapper">
            <div class="swap-input-column">
              <div class="stake-price-data-column"> -->
          <!-- <div class="stake-price-data-row">
                  <p class="price-label">Token Price</p>
                  <p class="price-data">{{ trim($store.state.settings.MetaMask, 4) }} $</p>
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">Token Supply</p>
                  <p class="price-data">{{ trim($store.state.settings.ohmBalance, 4) }} TAO</p>
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">Total PCV</p>
                  <p class="price-data">{{ trim($store.state.settings.ohmBalance, 4) }} TAO</p>
                </div>

                <div class="stake-price-data-row">
                  <p>&#10524;</p>
                  <p>&#10523;</p>
                </div>

                <div class="stake-price-data-row">
                  <p class="price-label">Balance</p>
                  <p class="price-data">
                    {{ trim($store.state.settings.ohmBalance, 4) }} TAO +
                    {{ trim($store.state.settings.lpBalance, 4) }} SLP
                  </p>
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">Staked</p>
                  <p class="price-data">
                    {{ trim($store.state.settings.sohmBalance, 4) }} TAO +
                    {{ trim($store.state.settings.lpStaked, 4) }} SLP
                  </p>
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">APY Staking</p>
                  <p class="price-data">{{ trim($store.state.settings.stakingAPY, 2) }}%</p>
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">APY LP Staking</p>
                  <p class="price-data">{{ trim($store.state.settings.lpStakingAPY, 4) }}%</p>
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">Bonding Debt Ratio</p>
                  <p class="price-data">23.5%</p>
                </div>
                <div class="stake-price-data-row">
                  <p class="price-label">Bonding Discount</p>
                  <p class="price-data">99%</p>
                </div> -->
          <!-- </div>
            </div> -->
          <!-- </div> -->
        </div>
      </div>
    </div>
    <ModalLogin :open="modalLoginOpen" @close="modalLoginOpen = false" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import { shorten } from '@/helpers/utils.ts';

export default {
  async mounted() {
    this.$store.state.settings.menuOpened = false;
  },
  data() {
    return {
      form: {
        quantity: ''
      },
      modalLoginOpen: false,
      modalMakepotionOpen: false
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
    maxStrike() {
      const exchangeRate = this.settings.exchangeRates[this.form.asset];
      return exchangeRate && exchangeRate.usd ? exchangeRate.usd : 1e9;
    }
  },
  methods: {
    ...mapActions(['SendDai']),
    handleSubmit() {
      this.SendDai({
        //address: '0xb72027693a5B717B9e28Ea5E12eC59b67c944Df7',
        value: this.form.quantity
      });
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
