<template>
  <div>
    <div id="dapp" class="dapp">
      <!-- <VueLoadingIndicator v-if="settings.loading" class="overlay big" /> 
      <div v-else>
      </div>-->

      <Navbar />
      <div class="wrapper">
        <div class="dapp-center-modal">
          <div class="dapp-modal-wrapper" v-if="$store.state.settings.isInitialized == true">
            <div style="text-align: center; margin: 20px 0px; font-size: 20px" v-if="$store.state.settings.whitelisted == true">
              The presale period is over.
            </div>
            <span v-else style="text-align: center; margin: 20px 0px; font-size: 20px"
              >You are not whitelisted for the presale.</span
            >
            <div class="swap-input-column" v-if="$store.state.settings.boughtTao == true">
              <div class="presale-body">
                <h2 class="presale-claim-title">Thanks for participating the presale</h2>
                <div class="presale-body" v-if="parseFloat($store.state.settings.claimable) > 0">
                  <div class="presale-content">
                    You have <b>{{ Math.floor($store.state.settings.claimable) }} TAO</b> to claim
                  </div>

                  <span v-if="$store.state.settings.claimUnlocked == true">
                    <div class="swap-button-container">
                      <div class="swap-button" @click="claim">Claim</div>
                    </div>
                  </span>
                  <span v-else style="text-align: center; margin: 20px 0px; font-size: 20px"
                    >Presale claim is not unlocked yet.</span
                  >
                </div>
                <div v-else class="presale-content">You already have claimed your TAO</div>
              </div>
            </div>
          </div>
          <div class="dapp-modal-wrapper" v-if="$store.state.settings.isInitialized == false">
            Presale not started.
          </div>
        </div>
      </div>
    </div>
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
      value: '',
      modalLoginOpen: false,
      modalMakepotionOpen: false,
    };
  },
  computed: {
    ...mapState(['settings']),
    isValid() {
      return parseFloat(this.value);
    },
    maxStrike() {
      const exchangeRate = this.settings.exchangeRates[this.form.asset];
      return exchangeRate && exchangeRate.usd ? exchangeRate.usd : 1e9;
    },
    hasAllowance() {
      if (parseFloat(this.value)) {
        this.updateQuote();
        return (
          parseInt(this.$store.state.settings.allowance) >=
          parseInt(ethers.utils.parseEther(this.value))
        );
      }
      return false;
    },
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
    ...mapActions(['buy', 'getApproval', 'calculateSaleQuote', 'getMaxPurchase', 'claimPresale']),
    shorten,
    async seekApproval() {
      await this.getApproval(this.value);
    },
    async claim() {
      await this.claimPresale();
    },
    async sendBusd() {
      await this.buy(this.value);
    },
    async updateQuote() {
      await this.calculateSaleQuote(this.value);
    },
    async maxAlloc() {
      const settings = this.$store.state.settings;
      // await this.getMaxPurchase();
      console.log(settings.balance);
      console.log(settings.allotment);

      this.value =
        parseFloat(settings.balance) >= parseFloat(settings.allotment)
          ? settings.allotment
          : settings.balance;
      await this.updateQuote();
    },
  },
};
</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>

<!--




<template>
  <div class="block">
    <h1 class="mb-4 main-title">OLYMPUS</h1>
    <p class="mb-4"><b class="warn">This is a private presale. The price of each pOLY is 0.01 DAI.</b>  If you have not been invited, your transaction will fail and waste your transaction fee!</p>    
    <p class="mb-2">
      Dai Balance: <span class="hasEffect" @click="maxStake">{{ Math.floor($store.state.settings.balance * 100) / 100 }}</span>
    </p>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="mb-0">
    
        <input
          v-if = "settings.authorized && settings.address && settings.allowanceTx<1"
          type="number"
          class="input mb-4"
          placeholder="Quantity"
          step="0.000000000000000001"
          v-model="form.quantity"
        />
        <div class="d-flex"></div>
      </div>
      <button
        v-if="settings.authorized && settings.address && settings.allowanceTx<1"
        :disabled="!isValid"
        type="submit"
        class="button button-primary mb-2"
      >
        Enter Presale
      </button>
      <a v-if="!settings.address" class="button button-primary mb-2" @click="modalLoginOpen = true">Connect wallet</a>
      <p v-if="!settings.authorized && settings.address"><b class="warn">Your account is not on the Pre-sale list. You cannot participate in this sale.</b></p>
    </form>
    <p v-if="settings.allowanceTx===1">Please wait. Waiting for {{$store.state.settings.confirmations}} confirmations</p>
    <p v-if="settings.saleTx===1"><b>Transaction submitted. Waiting for {{$store.state.settings.confirmations}} confirmations...</b></p>
    <p v-if="settings.saleTx===2"><b>Token Purchase Complete!</b></p>
    <ModalLogin :open="modalLoginOpen" @close="modalLoginOpen = false" />
    <ModalMakepotion
      v-if="isValid"
      :open="modalMakepotionOpen"
      :form="form"
      @close="modalMakepotionOpen = false"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
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
    maxStake() {
      this.form.quantity = this.$store.state.settings.balance;
    }
  }
};
</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>
-->
