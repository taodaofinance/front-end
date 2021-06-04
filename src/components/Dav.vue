<template>
  <div class="dapp-nav">
    <div style="
      color:#ffb703;
     

       " onClick="(function(){
      window.open('https://exchange.pancakeswap.finance/#/swap?outputCurrency=0x7065DdA3f8Ec5F6C155648BdeE4420c0525D93C6', '_blank');
})();" class="button button-dapp-menu">
      Buy Tao
    </div>
    <router-link
      :to="{ name: 'vested' }"
      class="button button-dapp-menu"
      v-if="
        1 == 0 &&
        $store.state.settings.exerciseMaxAllowedClaim > 0 &&
        $store.state.settings.pretaoBalance > 0
      "
    >
      Exercise pTao
    </router-link>
    <router-link :to="{ name: 'stake' }" class="button button-dapp-menu"> Staking </router-link>
    <router-link :to="{ name: 'lpstake' }" class="button button-dapp-menu">
      LP Staking
    </router-link>
    <router-link :to="{ name: 'bond' }" class="button button-dapp-menu"> Bonding </router-link>
    <router-link :to="{ name: 'dashboard' }" class="button button-dapp-menu">
      Dashboard
    </router-link>

    
  </div>
</template>

<script>
export default {};
</script>
