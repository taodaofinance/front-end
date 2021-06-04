<template>
  <div class="column">
    <Nav />
    <div class="block hero">
      <h1 class="mb-4 main-title ">An Algorithmic Currency Protocol</h1>
      <p class="centered-text hero-desc">
        TAO DAO utilizes Protocol Owned Value to enable price consistency and scarcity within an
        infinite supply system. Forked from OHM with additional improvements.
      </p>
      <router-link
        :to="{ name: 'dashboard' }"
        style="margin:2rem auto;max-width:200px;"
        class="button button-primary button-centered fade-in"
      >
        Enter App
      </router-link>
       <button 
       onClick="(function(){
      window.open('https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x7065DdA3f8Ec5F6C155648BdeE4420c0525D93C6', '_blank');
})();"
       class="button button-primary button-centered fade-in" id="buynow-btn">Buy Now</button>

    
    </div>
    



    <div class="block" style="background: #000;" id="what">
      <!--<div class="row-responsive flex-centered" >
        <h3 class="centered-text py-8">Tao Is</h3>
      </div>-->
      <div class="row-responsive flex-centered">
        <div class="feature-box-module" style="">
          <div class="feature-block-image">
            <img src="~/@/assets/taoism-0.jpg" alt="" />
          </div>
          <div class="feature-block-desc">
            <h3>Backed by Assets</h3>
            <p>
              {{
                'Every TAO is backed by BUSD and TAO-BUSD LP in the treasury. This intrinsic value cannot' +
                  ' be diluted, providing a fundamental check on inflation.'
              }}
            </p>
          </div>
        </div>
        <div class="feature-box-module" style="">
          <div class="feature-block-image">
            <img src="~/@/assets/taoism-2.jpg" alt="" />
          </div>
          <div class="feature-block-desc">
            <h3>Algorithmically Managed</h3>
            <p>
              TAO has an adjustable policy state, allowing the DAO to adjust parameters and
              algorithmically optimize for stability or growth.
            </p>
          </div>
        </div>
        <div class="feature-box-module" style="">
          <div class="feature-block-image">
            <img src="~/@/assets/taoism-1.jpg" alt="" />
          </div>
          <div class="feature-block-desc">
            <h3>Community Governed</h3>
            <p>
              TAO is a DAO first project actively working toward complete distribution of the system
              to the community.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="block row-responsive no-pad">
      <div class="row-flex-max feature-row">
        <div class="row-flex-desc">
          <h2>What makes TAO unique?</h2>
          <p>
            TAO is a floating algorithmic currency. This means that it has mechanisms to promote
            stability and predictablility without directly pegging to any asset. However, we take it
            one step further with the introduction of adjustable policy; the DAO can move certain
            variables up and down to target growth and profitability or stability and
            predictability.
          </p>
        </div>
      </div>
      <div class="row-flex-image feature-image">
        <img src="~/@/assets/taoism-4.jpg" alt="" />
      </div>
    </div>
    <div class="block" style="background: #000; padding-bottom: 100px !important" id="how">
      <div class="row-responsive flex-centered">
        <h3 class="centered-text py-8">How It Works</h3>
      </div>
      <div class="row-responsive flex-centered">
        <div class="works-module-responsive">
          <div class="works-icon"><img src="~/@/assets/coin.png" alt="" /></div>
          <div class="works-desc">
            <h3>Reserves</h3>
            <p>
              TAO is always backed by one BUSD or one TAO backed by one BUSD. This creates a
              demand-based constraint on issuance of supply.
            </p>
          </div>
        </div>
        <div class="works-module-responsive">
          <div class="works-icon"><img src="~/@/assets/market.png" alt="" /></div>
          <div class="works-desc">
            <h3>Market Operations</h3>
            <p>
              New TAO is created via direct sales into the market. These sales increase linearly
              with the market premium and produce profits for stakers.
            </p>
          </div>
        </div>
      </div>
      <div class="row-responsive flex-centered">
        <div class="works-module-responsive">
          <div class="works-icon"><img src="~/@/assets/governance.png" alt="" /></div>
          <div class="works-desc">
            <h3>Governance</h3>
            <p>
              The DAO controls policy tools that allow us to loosen, increasing profitability and
              volatility, or tighten, increasing stability and predictability.
            </p>
          </div>
        </div>
        <div class="works-module-responsive">
          <div class="works-icon"><img src="~/@/assets/bond.png" alt="" /></div>
          <div class="works-desc">
            <h3>Bonding</h3>
            <p>
              New TAO is created via deferred sales for LP. Bonders lock their LP for a vesting term
              and receive a discount on TAO when the trade ultimately occurs.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="block row-responsive no-pad">
      <div class="row-flex-image feature-image">
        <img src="~/@/assets/taoism-3.jpg" alt="" />
      </div>

      <div class="row-flex-max feature-row">
        <div class="row-flex-desc">
          <h2>A world of opportunity</h2>
          <p>
            The TAO reserve system enables new implementations of a multitude of DeFi primitives.
            Interest and liquidation-free leverage and borrowing, counterparty-free options and
            derivatives, trustless undercollateralized lending and more are possible. The future is
            bright.
          </p>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import { mapState } from 'vuex';

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
  methods: {}
};
</script>
<style scoped>
.hasEffect {
  cursor: pointer;
}
</style>
