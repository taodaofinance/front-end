import Vue from 'vue';
import { ethers } from 'ethers';
import store from '@/store';
//import provider from '@/helpers/provider';
import addresses from '@/helpers/addresses';
import {
  getExchangeRatesFromCoinGecko,
  getPotions,
  getAllowances,
  revitalisePotion,
  withdrawPotion
} from '@/helpers/utils';
import {
  ETHER,
  EPOCH_INTERVAL,
  BLOCK_RATE_SECONDS,
  BLOCKS_PER_DAY,
  EPOCH_STARTED
} from '@/helpers/constants';
import assets from '@/helpers/assets.json';
import { abi as ierc20Abi } from '@/helpers/abi/IERC20.json';
import { abi as mimirTokenSale } from '@/helpers/abi/mimirTokenSale.json';
import { abi as pOlyTokenSale } from '@/helpers/abi/pOlyTokenSale.json';
import { abi as OHMPreSale } from '@/helpers/abi/OHMPreSale.json';
import { abi as OlympusStaking } from '@/helpers/abi/OlympusStaking.json';
import { abi as MigrateToOHM } from '@/helpers/abi/MigrateToOHM.json';
import { abi as sOHM } from '@/helpers/abi/sOHM.json';
import { abi as LPStaking } from '@/helpers/abi/LPStaking.json';
import { abi as DistributorContract } from '@/helpers/abi/DistributorContract.json';
import { abi as BondContract } from '@/helpers/abi/BondContract.json';
import { abi as BondCalcContract } from '@/helpers/abi/BondCalcContract.json';
import { abi as PairContract } from '@/helpers/abi/PairContract.json';
import { abi as PreTaoSales } from '@/helpers/abi/PreTaoSales.json';
import { abi as ExercisePtao } from '@/helpers/abi/ExercisePtao.json';
import cheerio from 'cheerio';

import { whitelist } from '@/helpers/whitelist.json';

const parseEther = ethers.utils.parseEther;

let provider;

const ethereum = window['ethereum'];
if (ethereum) {
  ethereum.on('accountsChanged', () => store.dispatch('init'));
  ethereum.on('networkChanged', network => {
    store.dispatch('init');
  });
}

const state = {
  approval: 0,
  loading: false,
  address: null,
  name: '',
  whitelisted: false,
  balance: 0,
  ohmBalance: 0,
  claim: 0,
  minimumEth: 0,
  providedEth: 0,
  amount: 0,
  remainingEth: 0,
  network: { chainId: 0 },
  exchangeRates: {},
  allowance: 0,
  stakeAllowance: 0,
  unstakeAllowance: 0,
  balances: {},
  authorized: false,
  allowanceTx: 0,
  saleTx: 0,
  confirmations: 1,
  allotment: 0,
  maxPurchase: 0,
  price: 0,
  maxSwap: 0,
  amountSwap: 0,
  boughtTao: false,
  claimUnlocked: false,
  claimable: false,
  isInitialized: false,
  blocksPerDay: BLOCKS_PER_DAY,
  epochStarted: EPOCH_STARTED,
  epochInterval: EPOCH_INTERVAL,
  totalSupply: 0,
  taoCircSupply: 0,
  totalBusdLP: 0,
  vaultBusd: 0,
  taoStaked: 0,
  lpPrice: 0,
  lpInVault: 0,
  lpLocked: 0,
  taoists: 0,
  principleValuation: 0,
  menuOpened: false,
  modalLoginOpen: false,
  whitelistPretao: false,
  allowancePretao: 0,
  initializedPretao: false,
  pretaoBalance: 0,
  fiveDayRate: 0,
  nextEpochRewards: 0,
  exerciseMaxAllowedClaim: 0,
  exerciseAbleToClaim: 0,
  exercisePtaoAllowance: 0,
  exerciseBusdAllowance: 0
};

const mutations = {
  set(_state, payload) {
    Object.keys(payload).forEach(key => {
      Vue.set(_state, key, payload[key]);
    });
  }
};

const actions = {
  init: async ({ commit, dispatch }) => {
    // commit('set', { loading: true });
    // @ts-ignore
    if (typeof window.ethereum !== 'undefined') {
      const ethereum = window['ethereum'];
      provider = new ethers.providers.Web3Provider(ethereum);
    }

    if (provider) {
      try {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        if (address) await dispatch('login');
      } catch (e) {
        console.log(e);
      }
    }

    commit('set', { loading: false });
  },
  login: async ({ commit, dispatch }) => {
    const startAt = Date.now()
    if (provider) {
      try {
        let ohmContract,
          ohmBalance = 0,
          allowance = 0;
        let sohmContract,
          sohmMainContract,
          sohmBalance = 0,
          stakeAllowance = 0,
          unstakeAllowance = 0,
          circSupply = 0;
        let stakingContract,
          profit = 0;
        let lpStakingContract,
          totalLPStaked = 0,
          lpStaked = 0,
          pendingRewards = 0,
          lpStakingAPY;
        let lpContract,
          lpBalance = 0,
          lpStakeAllowance;
        let distributorContract,
          stakingAPY = 0,
          stakingRebase = 0,
          stakingReward = 0,
          nextEpochBlock = 0;
        let distributorContractSigner,
          currentIndex = 0,
          currentBlock = 0;

        let bondingCalcContract,
          bondValue = 0;
        let bondingContract,
          marketPrice = 0,
          bondPrice = 0,
          debtRatio = 0,
          lpBondAllowance = 0,
          interestDue = 0,
          vestingPeriodInBlocks,
          bondMaturationBlock = 0,
          bondDiscount = 0,
          pendingPayout = 0,
          taoTotalSupply = 0,
          taoCircSupply = 0,
          taoStaked = 0,
          totalBusd = 0,
          totalVaultLP = 0,
          lpLocked = 0,
          principleValuation = 0,
          vaultBUSD = 0,
          lpPrice = 0,
          nextEpochRewards = 0,
          fiveDayRate = 0;
        let pairContract;

        await ethereum.enable();
        provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const blockNumber = await provider.getBlockNumber();
        const address = await signer.getAddress();
        const network = await provider.getNetwork();
        store.commit('set', { network: network });

        const aOHMBalance = 0;

        const daiContract = new ethers.Contract(
          addresses[network.chainId].DAI_ADDRESS,
          ierc20Abi,
          provider
        );
        const balance = await daiContract.balanceOf(address);

        commit('set', { address, balance: ethers.utils.formatEther(balance) });
        try {
          const preTaoallowance = await daiContract.allowance(
            address,
            addresses[network.chainId].PRETAO_SALES
          )!;

          const pretaoSales = await new ethers.Contract(
            addresses[state.network.chainId].PRETAO_SALES,
            PreTaoSales,
            provider
          );
          const whitelistedPretao = await pretaoSales.approvedBuyers(address);
          const initializedPretao = await pretaoSales.initialized();

          const ptaoContract = new ethers.Contract(
            addresses[network.chainId].PTAO_ADDRESS,
            ierc20Abi,
            provider
          );
          const pretaoBalance = await ptaoContract.balanceOf(address);

          commit('set', {
            whitelistPretao: whitelistedPretao,
            allowancePretao: preTaoallowance,
            initializedPretao,
            pretaoBalance: ethers.utils.formatEther(pretaoBalance)
          });
        } catch (ex) {
          console.log(ex);
        }

        try {
          allowance = await daiContract.allowance(
            address,
            addresses[network.chainId].PRESALE_ADDRESS
          )!;
          console.log('Allowance', allowance);

          const presaleContract = await new ethers.Contract(
            addresses[state.network.chainId].PRESALE_ADDRESS,
            OHMPreSale,
            provider
          );
          const presaleWhitelisted = await presaleContract.whitelistedAddresses(address);
          const boughtTao = await presaleContract.boughtTAO(address);
          const claimUnlocked = await presaleContract.claimUnlocked();
          const claimable = await presaleContract.claimable(address);
          const isInitialized = await presaleContract.startUnlocked();

          commit('set', {
            whitelisted: presaleWhitelisted,
            claimUnlocked,
            boughtTao,
            claimable: ethers.utils.formatUnits(claimable, 'gwei'),
            isInitialized,
            allowance
          });
        } catch (ex) {
          console.log(ex);
        }

        if (addresses[network.chainId].BONDINGCALC_ADDRESS) {
          bondingCalcContract = new ethers.Contract(
            addresses[network.chainId].BONDINGCALC_ADDRESS,
            BondCalcContract,
            provider
          );
          lpContract = new ethers.Contract(
            addresses[network.chainId].LP_ADDRESS,
            ierc20Abi,
            provider
          );
        }

        if (addresses[network.chainId].BOND_ADDRESS) {
          bondingContract = new ethers.Contract(
            addresses[network.chainId].BOND_ADDRESS,
            BondContract,
            provider
          );
          bondingCalcContract = new ethers.Contract(
            addresses[network.chainId].BONDINGCALC_ADDRESS,
            BondCalcContract,
            provider
          );
          pairContract = new ethers.Contract(
            addresses[network.chainId].LP_ADDRESS,
            PairContract,
            provider
          );
          lpContract = new ethers.Contract(
            addresses[network.chainId].LP_ADDRESS,
            ierc20Abi,
            provider
          );
          ohmContract = new ethers.Contract(
            addresses[network.chainId].OHM_ADDRESS,
            ierc20Abi,
            provider
          );

          lpBalance = await lpContract.balanceOf(address);
          totalVaultLP = await lpContract.balanceOf(addresses[network.chainId].VAULT_ADDRESS);
          lpLocked = await lpContract.balanceOf('0xff45135267bb266f93eb55b1215353b7f6efa94e');

          const totalLP = await lpContract.totalSupply();

          taoTotalSupply = await ohmContract.totalSupply();

          const distributorBalance = await ohmContract.balanceOf(
            addresses[network.chainId].DISTRIBUTOR_ADDRESS
          );
          const rewardPoolBalance = await ohmContract.balanceOf(
            addresses[network.chainId].REWARD_POOL_ADDRESS
          );
          const bondBalance = await ohmContract.balanceOf(addresses[network.chainId].BOND_ADDRESS);
          const presaleBalance = await ohmContract.balanceOf(
            addresses[network.chainId].PRESALE_ADDRESS
          );

          taoCircSupply =
            taoTotalSupply - distributorBalance - rewardPoolBalance - bondBalance - presaleBalance;

          const vestingPeriodInBlocks = await bondingContract.vestingPeriodInBlocks();

          const totalDebtDo = await bondingContract.totalDebt();
          debtRatio = await bondingCalcContract.calcDebtRatio(totalDebtDo, taoTotalSupply);

          const reserves = await pairContract.getReserves();

          totalBusd = reserves[1];
          marketPrice = reserves[1].div(reserves[0]);

          bondValue = await bondingContract.calculateBondInterest(
            ethers.utils.parseEther('0.0001').toString()
          );
          bondPrice =
            (2 * totalBusd * (ethers.utils.parseEther('0.0001').toNumber() / totalLP)) / bondValue;
          bondDiscount = 1 - bondPrice / marketPrice;

          const totalLPValue = totalBusd * 2;
          lpPrice = totalLPValue / totalLP;

          console.log('LpPrice', lpPrice.toString());
          taoTotalSupply = await ohmContract.totalSupply();

          const vaultPrincipleValuation = await bondingCalcContract.principleValuation(
            addresses[network.chainId].LP_ADDRESS,
            totalVaultLP.toString()
          );

          const totalVaultBUSD = await daiContract.balanceOf(
            addresses[network.chainId].VAULT_ADDRESS
          );
          vaultBUSD = totalVaultBUSD;

          const waultPrincipleValuation = await bondingCalcContract.principleValuation(
            addresses[network.chainId].LP_ADDRESS,
            lpLocked.toString()
          );

          principleValuation =
            parseFloat(ethers.utils.formatUnits(vaultPrincipleValuation, 'ether')) +
            parseFloat(ethers.utils.formatUnits(vaultBUSD, 'ether')) +
            parseFloat(ethers.utils.formatUnits(waultPrincipleValuation, 'ether'));

          console.log(
            'vaultPrincipleValuation',
            ethers.utils.formatUnits(vaultPrincipleValuation, 'ether')
          );
          console.log('vaultBUSD', ethers.utils.formatUnits(vaultBUSD, 'ether'));
          console.log(
            'waultPrincipleValuation',
            ethers.utils.formatUnits(waultPrincipleValuation, 'ether')
          );

          lpBondAllowance = await lpContract.allowance(
            address,
            addresses[network.chainId].BOND_ADDRESS
          );

          const bondDetails = await bondingContract.depositorInfo(address);

          currentBlock = await provider.getBlockNumber();

          console.log('currentBlock');
          console.log(currentBlock);

          interestDue = bondDetails[1];
          bondMaturationBlock = +bondDetails[3] + +bondDetails[2];
          pendingPayout = await bondingContract.calculatePendingPayout(address);
        }

        if (addresses[network.chainId].LP_ADDRESS) {
          lpContract = new ethers.Contract(
            addresses[network.chainId].LP_ADDRESS,
            ierc20Abi,
            provider
          );
          lpBalance = await lpContract.balanceOf(address);
        }

        if (addresses[network.chainId].LPSTAKING_ADDRESS) {
          lpStakingContract = new ethers.Contract(
            addresses[network.chainId].LPSTAKING_ADDRESS,
            LPStaking,
            provider
          );
          lpContract = new ethers.Contract(
            addresses[network.chainId].LP_ADDRESS,
            ierc20Abi,
            provider
          );
          ohmContract = new ethers.Contract(
            addresses[network.chainId].OHM_ADDRESS,
            ierc20Abi,
            provider
          );

          totalLPStaked = await lpStakingContract.totalStaked();
          lpStaked = await lpStakingContract.getUserBalance(address);
          pendingRewards = await lpStakingContract.pendingRewards(address);
          lpStakeAllowance = await lpContract.allowance(
            address,
            addresses[state.network.chainId].LPSTAKING_ADDRESS
          );

          const totalLP = await lpContract.totalSupply();
          const OHMInLP = await ohmContract.balanceOf(addresses[network.chainId].LP_ADDRESS);

          const rewardPerBlock = await lpStakingContract.rewardPerBlock();

          lpStakingAPY =
            (rewardPerBlock * BLOCKS_PER_DAY * 365 * 100) /
            (((totalLPStaked * OHMInLP) / totalLP) * 2);
        }

        if (addresses[network.chainId].OHM_ADDRESS) {
          ohmContract = new ethers.Contract(
            addresses[network.chainId].OHM_ADDRESS,
            ierc20Abi,
            provider
          );
          ohmBalance = await ohmContract.balanceOf(address);
          taoStaked = await ohmContract.balanceOf(addresses[network.chainId].STAKING_ADDRESS);

          stakeAllowance = await ohmContract.allowance(
            address,
            addresses[network.chainId].STAKING_ADDRESS
          )!;
        }
        if (addresses[network.chainId].SOHM_ADDRESS) {
          sohmContract = new ethers.Contract(
            addresses[network.chainId].SOHM_ADDRESS,
            ierc20Abi,
            provider
          );
          sohmMainContract = new ethers.Contract(
            addresses[network.chainId].SOHM_ADDRESS,
            sOHM,
            provider
          );

          sohmBalance = await sohmContract.balanceOf(address);
          unstakeAllowance = await sohmContract.allowance(
            address,
            addresses[network.chainId].STAKING_ADDRESS
          )!;
          circSupply = await sohmMainContract.circulatingSupply();
        }

        console.log('stakeAllowance', stakeAllowance);
        commit('set', { stakeAllowance, unstakeAllowance, lpStakeAllowance });


        if (addresses[network.chainId].STAKING_ADDRESS) {
          stakingContract = new ethers.Contract(
            addresses[network.chainId].STAKING_ADDRESS,
            OlympusStaking,
            provider
          );

          try {
            profit = await stakingContract.taoToDistributeNextEpoch();
          } catch (ex) {
            console.log('Erro');
            console.log(ex);
          }
        }

        if (addresses[network.chainId].DISTRIBUTOR_ADDRESS) {
          distributorContract = new ethers.Contract(
            addresses[network.chainId].DISTRIBUTOR_ADDRESS,
            DistributorContract,
            provider
          );
          sohmContract = new ethers.Contract(
            addresses[network.chainId].SOHM_ADDRESS,
            ierc20Abi,
            provider
          );

          circSupply = await sohmMainContract.circulatingSupply();

          stakingReward = await stakingContract.taoToDistributeNextEpoch(); //getCurrentRewardForNextEpoch();

          currentBlock = await provider.getBlockNumber();

          stakingRebase = stakingReward / circSupply;

          nextEpochRewards =
            parseFloat(ethers.utils.formatUnits(sohmBalance, 'gwei')) * stakingRebase;

          fiveDayRate = Math.pow(1 + stakingRebase, 5 * 4) - 1;

          const currentEpoch = Math.floor((currentBlock - EPOCH_STARTED) / EPOCH_INTERVAL);
          nextEpochBlock = EPOCH_STARTED + EPOCH_INTERVAL * (currentEpoch + 1);

          stakingAPY = Math.pow(1 + stakingRebase, 365 * 4);

          stakingAPY = stakingAPY * 100;

          currentIndex = await sohmContract.balanceOf(
            addresses[network.chainId].SOHM_INDEX_ADDRESS
          );
        }
        //const balance = balanceBefore.toFixed(2);
        
        await dispatch('getMaxPurchase');
        await dispatch('getAllotmentPerBuyer');
        await dispatch('getExerciseAllowance');

        await dispatch('getMaxPurchase');
        await dispatch('getAllotmentPerBuyer');
        await dispatch('getExerciseAllowance');

        commit('set', {
          // name,
          blockNumber: blockNumber,
          balance: ethers.utils.formatEther(balance),
          aOHMBalance: aOHMBalance,
          network,
          loading: false,
          ohmBalance: ethers.utils.formatUnits(ohmBalance, 'gwei'),
          sohmBalance: ethers.utils.formatUnits(sohmBalance, 'gwei'),
          totalLPStaked: ethers.utils.formatUnits(totalLPStaked, 'ether'),
          lpBalance: ethers.utils.formatUnits(lpBalance, 'ether'),
          lpStaked: ethers.utils.formatUnits(lpStaked, 'ether'),
          pendingRewards: ethers.utils.formatUnits(pendingRewards, 'gwei'),
          lpStakingAPY: lpStakingAPY,
          stakingReward: ethers.utils.formatUnits(stakingReward, 'gwei'),
          stakingAPY: stakingAPY,
          stakingRebase: stakingRebase,
          nextEpochBlock,
          currentIndex: ethers.utils.formatUnits(currentIndex, 'gwei'),
          bondValue: bondValue,
          bondPrice: bondPrice,
          marketPrice: marketPrice / 1000000000,
          debtRatio: debtRatio,
          interestDue: ethers.utils.formatUnits(interestDue, 'gwei'),
          bondMaturationBlock: bondMaturationBlock,
          currentBlock,
          bondDiscount,
          pendingPayout: ethers.utils.formatUnits(pendingPayout, 'gwei'),
          vestingPeriodInBlocks: vestingPeriodInBlocks,
          totalSupply: ethers.utils.formatUnits(taoTotalSupply, 'gwei'),
          circSupply: ethers.utils.formatUnits(taoCircSupply, 'gwei'),
          totalBusdLP: ethers.utils.formatUnits(totalBusd, 'ether'),
          taoStaked: ethers.utils.formatUnits(taoStaked, 'gwei'),
          lpInVault: ethers.utils.formatUnits(totalVaultLP, 'ether'),
          lpLocked: ethers.utils.formatUnits(lpLocked, 'ether'),
          vaultBUSD: ethers.utils.formatUnits(vaultBUSD, 'ether'),
          lpPrice,
          principleValuation,
          fiveDayRate,
          nextEpochRewards
        });
        const response = await fetch(`https://taodao-api.netlify.app/.netlify/functions/server`);
        const taoists = await response.json();
        commit('set', { taoists });
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('This website require MetaMask');
    }
    console.log(`Login done in ${Date.now() - startAt}ms`);
    setTimeout(() => dispatch('login'), 30000);
  },
  loading: ({ commit }, payload) => {
    commit('set', { loading: payload });
  },
  async getExchangeRates({ commit }) {
    const exchangeRates = await getExchangeRatesFromCoinGecko();
    commit('set', { exchangeRates });
  },

  async buy({ commit }, value) {
    const signer = provider.getSigner();
    const presale = await new ethers.Contract(
      addresses[state.network.chainId].PRESALE_ADDRESS,
      OHMPreSale,
      signer
    );
    const daiContract = new ethers.Contract(
      addresses[state.network.chainId].DAI_ADDRESS,
      ierc20Abi,
      signer
    );

    const presaleTX = await presale.buy(ethers.utils.parseEther(value).toString());
    await presaleTX.wait(console.log('Success'));
    const balance = await daiContract.balanceOf(state.address);

    commit('set', {
      // name,
      balance: ethers.utils.formatEther(balance)
    });

    const boughtTao = await presale.boughtTAO(state.address);
    const claimUnlocked = await presale.claimUnlocked();
    const claimable = await presale.claimable(state.address);

    commit('set', {
      claimUnlocked,
      boughtTao,
      claimable: ethers.utils.formatUnits(claimable, 'gwei')
    });
  },

  async buyPretao({ commit }, value) {
    const signer = provider.getSigner();

    const pretaoSales = await new ethers.Contract(
      addresses[state.network.chainId].PRETAO_SALES,
      PreTaoSales,
      signer
    );

    const ptaoContract = new ethers.Contract(
      addresses[state.network.chainId].PTAO_ADDRESS,
      ierc20Abi,
      signer
    );

    const daiContract = new ethers.Contract(
      addresses[state.network.chainId].DAI_ADDRESS,
      ierc20Abi,
      signer
    );

    const presaleTX = await pretaoSales.buypTao(ethers.utils.parseEther(value).toString());
    await presaleTX.wait(console.log('Success'));
    const balance = await daiContract.balanceOf(state.address);

    const pretaoBalance = await ptaoContract.balanceOf(state.address);

    commit('set', {
      // name,
      balance: ethers.utils.formatEther(balance),
      pretaoBalance: ethers.utils.formatEther(pretaoBalance)
    });
  },

  async calcBondDetails({ commit, dispatch }, amount) {
    let amountInWei;
    if (!amount || amount === '') {
      amountInWei = ethers.utils.parseEther('0.0001'); // Use a realistic SLP ownership
    } else {
      amountInWei = ethers.utils.parseEther(amount);
    }
    const pairContract = new ethers.Contract(
      addresses[state.network.chainId].LP_ADDRESS,
      PairContract,
      provider
    );
    // If the user hasn't entered anything, let's calculate a fraction of SLP
    const bondingContract = new ethers.Contract(
      addresses[state.network.chainId].BOND_ADDRESS,
      BondContract,
      provider
    );
    const lpContract = new ethers.Contract(
      addresses[state.network.chainId].LP_ADDRESS,
      ierc20Abi,
      provider
    );
    const bondingCalcContract = new ethers.Contract(
      addresses[state.network.chainId].BONDINGCALC_ADDRESS,
      BondCalcContract,
      provider
    );
    const ohmContract = new ethers.Contract(
      addresses[state.network.chainId].OHM_ADDRESS,
      ierc20Abi,
      provider
    );

    const totalLP = await lpContract.totalSupply();
    const ohmTotalSupply = await ohmContract.totalSupply();

    const vestingPeriodInBlocks = await bondingContract.vestingPeriodInBlocks();

    const totalDebtDo = await bondingContract.totalDebt();
    const debtRatio = await bondingCalcContract.calcDebtRatio(totalDebtDo, ohmTotalSupply);

    const reserves = await pairContract.getReserves();

    const totalBusd = reserves[1];
    const marketPrice = reserves[1].div(reserves[0]);

    const bondValue = await bondingContract.calculateBondInterest(amountInWei.toString());
    const bondPrice = (2 * totalBusd * (amountInWei / totalLP)) / bondValue;
    const bondDiscount = 1 - bondPrice / marketPrice;

    commit('set', {
      amount,
      bondValue,
      bondDiscount,
      debtRatio,
      bondPrice: bondPrice,
      vestingPeriodInBlocks,
      marketPrice: marketPrice / Math.pow(10, 9)
    });
  },

  async getExerciseAllowance({ commit }) {
    if (state.address) {
      const exerciseContract = await new ethers.Contract(
        addresses[state.network.chainId].EXERCISE_PTAO_ADDRESS,
        ExercisePtao,
        provider
      );

      const getpTAOAbleToClaim = await exerciseContract.getpTAOAbleToClaim(state.address);

      const maxAllowedToClaim = await exerciseContract.maxAllowedToClaim(state.address);

      const daiContract = await new ethers.Contract(
        addresses[state.network.chainId].DAI_ADDRESS,
        ierc20Abi,
        provider
      );

      const daiAllowance = await daiContract.allowance(
        state.address,
        addresses[state.network.chainId].EXERCISE_PTAO_ADDRESS
      );

      const ptaoContract = await new ethers.Contract(
        addresses[state.network.chainId].PTAO_ADDRESS,
        ierc20Abi,
        provider
      );

      const ptaoAllowance = await ptaoContract.allowance(
        state.address,
        addresses[state.network.chainId].EXERCISE_PTAO_ADDRESS
      );

      commit('set', {
        exercisePtaoAllowance: ptaoAllowance,
        exerciseBusdAllowance: daiAllowance,
        exerciseAbleToClaim: ethers.utils.formatEther(getpTAOAbleToClaim),
        exerciseMaxAllowedClaim: ethers.utils.formatEther(maxAllowedToClaim)
      });
    }
  },

  async getApprovalExerciseBusd({ commit, dispatch }, value) {
    const signer = provider.getSigner();
    const daiContract = await new ethers.Contract(
      addresses[state.network.chainId].DAI_ADDRESS,
      ierc20Abi,
      signer
    );

    if (value <= 0) return;

    const approveTx = await daiContract.approve(
      addresses[state.network.chainId].EXERCISE_PTAO_ADDRESS,
      ethers.utils.parseEther(value).toString()
    );
    commit('set', { allowanceTx: 1 });
    await approveTx.wait();
    await dispatch('getExerciseAllowance');
  },

  async getApprovalExercisePtao({ commit, dispatch }, value) {
    const signer = provider.getSigner();
    const ptaoContract = await new ethers.Contract(
      addresses[state.network.chainId].PTAO_ADDRESS,
      ierc20Abi,
      signer
    );

    if (value <= 0) return;

    const approveTx = await ptaoContract.approve(
      addresses[state.network.chainId].EXERCISE_PTAO_ADDRESS,
      ethers.utils.parseEther(value).toString()
    );
    commit('set', { allowanceTx: 1 });
    await approveTx.wait();
    await dispatch('getExerciseAllowance');
  },

  async exercisePtao({ commit, dispatch }, value) {
    
    const signer = provider.getSigner();

    const ptaoContract = new ethers.Contract(
      addresses[state.network.chainId].PTAO_ADDRESS,
      ierc20Abi,
      signer
    );
    
    const taoContract = new ethers.Contract(
      addresses[state.network.chainId].OHM_ADDRESS,
      ierc20Abi,
      signer
    );

    const daiContract = new ethers.Contract(
      addresses[state.network.chainId].DAI_ADDRESS,
      ierc20Abi,
      signer
    );

    const exerciseContract = await new ethers.Contract(
      addresses[state.network.chainId].EXERCISE_PTAO_ADDRESS,
      ExercisePtao,
      signer
    );


    const presaleTX = await exerciseContract.exercisepTAO(ethers.utils.parseEther(value).toString());
    await presaleTX.wait(console.log('Success'));

    const balance = await daiContract.balanceOf(state.
      address);
    const pretaoBalance = await ptaoContract.balanceOf(state.address);
    const taoBalance = await taoContract.balanceOf(state.address);


    commit('set', {
      balance: ethers.utils.formatEther(balance),
      pretaoBalance: ethers.utils.formatEther(pretaoBalance),
      ohmBalance: ethers.utils.formatUnits(taoBalance, 'gwei'),
    });


  },



  async getLPBondAllowance({ commit }) {
    if (state.address) {
      const lpContract = await new ethers.Contract(
        addresses[state.network.chainId].LP_ADDRESS,
        ierc20Abi,
        provider
      );
      const lpBondAllowance = await lpContract.allowance(
        state.address,
        addresses[state.network.chainId].BOND_ADDRESS
      );
      commit('set', { lpBondAllowance });
    }
  },

  async getLPBondApproval({ commit, dispatch }, value) {
    const signer = provider.getSigner();
    const lpContract = await new ethers.Contract(
      addresses[state.network.chainId].LP_ADDRESS,
      ierc20Abi,
      signer
    );
    if (value <= 0) {
      alert('Please enter a value greater than 0');
      return;
    }

    const approveTx = await lpContract.approve(
      addresses[state.network.chainId].BOND_ADDRESS,
      ethers.utils.parseUnits('1000000000', 'ether').toString()
    );
    await approveTx.wait();
    await dispatch('getLPBondAllowance');
  },

  async bondLP({ commit }, value) {
    const signer = provider.getSigner();
    const bonding = await new ethers.Contract(
      addresses[state.network.chainId].BOND_ADDRESS,
      BondContract,
      signer
    );

    // Deposit the bond
    let bondTx;
    try {
      bondTx = await bonding.depositBondPrinciple(ethers.utils.parseUnits(value, 'ether'));
    } catch (error) {
      if (error.code === -32603 && error.message.indexOf('ds-math-sub-underflow') >= 0) {
        alert(
          'You may be trying to bond more than your balance! Error code: 32603. Message: ds-math-sub-underflow'
        );
      } else {
        alert(error.message);
      }
      return;
    }

    // Wait for tx to be minted
    await bondTx.wait();
    const lpContract = new ethers.Contract(
      addresses[state.network.chainId].LP_ADDRESS,
      ierc20Abi,
      provider
    );
    const lpBalance = await lpContract.balanceOf(state.address);
    commit('set', {
      lpBalance: ethers.utils.formatUnits(lpBalance, 'ether')
    });
  },

  async redeemBond() {
    const signer = provider.getSigner();
    const bonding = await new ethers.Contract(
      addresses[state.network.chainId].BOND_ADDRESS,
      BondContract,
      signer
    );
    const redeemTx = await bonding.redeemBond();
    await redeemTx.wait();
  },

  async forfeitBond() {
    const signer = provider.getSigner();
    const bonding = await new ethers.Contract(
      addresses[state.network.chainId].BOND_ADDRESS,
      BondContract,
      signer
    );
    const forfeitTx = await bonding.withdrawPrincipleAndForfeitInterest();
    await forfeitTx.wait();
  },

  async claimPresale({ commit }) {
    const signer = provider.getSigner();
    const presale = await new ethers.Contract(
      addresses[state.network.chainId].PRESALE_ADDRESS,
      OHMPreSale,
      signer
    );

    const presaleTX = await presale.claim();
    await presaleTX.wait(console.log('Success'));
    commit('set', {
      claimable: 0
    });
  },

  async getApproval({ commit, dispatch }, value) {
    const signer = provider.getSigner();
    const daiContract = await new ethers.Contract(
      addresses[state.network.chainId].DAI_ADDRESS,
      ierc20Abi,
      signer
    );

    if (value <= 0) return;

    const approveTx = await daiContract.approve(
      addresses[state.network.chainId].PRESALE_ADDRESS,
      ethers.utils.parseEther(value).toString()
    );
    commit('set', { allowanceTx: 1 });
    await approveTx.wait();
    await dispatch('getAllowances');
  },

  async getApprovalPretao({ commit, dispatch }, value) {
    const signer = provider.getSigner();
    const daiContract = await new ethers.Contract(
      addresses[state.network.chainId].DAI_ADDRESS,
      ierc20Abi,
      signer
    );

    if (value <= 0) return;

    const approveTx = await daiContract.approve(
      addresses[state.network.chainId].PRETAO_SALES,
      ethers.utils.parseEther(value).toString()
    );
    commit('set', { allowanceTx: 1 });
    await approveTx.wait();
    await dispatch('getAllowancesPretao');
  },

  async getAllowances({ commit }) {
    if (state.address) {
      const diaContract = await new ethers.Contract(
        addresses[state.network.chainId].DAI_ADDRESS,
        ierc20Abi,
        provider
      );
      const allowance = await diaContract.allowance(
        state.address,
        addresses[state.network.chainId].PRESALE_ADDRESS
      );
      commit('set', { allowance });
    }
  },

  async getAllowancesPretao({ commit }) {
    if (state.address) {
      const diaContract = await new ethers.Contract(
        addresses[state.network.chainId].DAI_ADDRESS,
        ierc20Abi,
        provider
      );
      const allowance = await diaContract.allowance(
        state.address,
        addresses[state.network.chainId].PRETAO_SALES
      );
      commit('set', { allowancePretao: allowance });
    }
  },

  async getStakeApproval({ commit, dispatch }, value) {
    const signer = provider.getSigner();
    const ohmContract = await new ethers.Contract(
      addresses[state.network.chainId].OHM_ADDRESS,
      ierc20Abi,
      signer
    );
    if (value <= 0) return;

    const approveTx = await ohmContract.approve(
      addresses[state.network.chainId].STAKING_ADDRESS,
      ethers.utils.parseUnits('1000000000', 'gwei').toString()
    );
    await approveTx.wait();
    await dispatch('getStakeAllowances');
  },

  async getLPStakeApproval({ commit, dispatch }, value) {
    const signer = provider.getSigner();
    const lpContract = await new ethers.Contract(
      addresses[state.network.chainId].LP_ADDRESS,
      ierc20Abi,
      signer
    );
    if (value <= 0) return;

    const approveTx = await lpContract.approve(
      addresses[state.network.chainId].LPSTAKING_ADDRESS,
      ethers.utils.parseUnits('1000000000', 'ether').toString()
    );
    await approveTx.wait();
    await dispatch('getLPStakeAllowance');
  },

  async getStakeAllowances({ commit }) {
    if (state.address) {
      const ohmContract = await new ethers.Contract(
        addresses[state.network.chainId].OHM_ADDRESS,
        ierc20Abi,
        provider
      );
      const stakeAllowance = await ohmContract.allowance(
        state.address,
        addresses[state.network.chainId].STAKING_ADDRESS
      );
      commit('set', { stakeAllowance });
    }
  },

  async getLPStakeAllowance({ commit }) {
    if (state.address) {
      const lpContract = await new ethers.Contract(
        addresses[state.network.chainId].LP_ADDRESS,
        ierc20Abi,
        provider
      );
      const lpStakeAllowance = await lpContract.allowance(
        state.address,
        addresses[state.network.chainId].LPSTAKING_ADDRESS
      );
      commit('set', { lpStakeAllowance });
    }
  },

  async getunStakeApproval({ commit, dispatch }, value) {
    const signer = provider.getSigner();
    const sohmContract = await new ethers.Contract(
      addresses[state.network.chainId].SOHM_ADDRESS,
      ierc20Abi,
      signer
    );
    if (value <= 0) return;

    const approveTx = await sohmContract.approve(
      addresses[state.network.chainId].STAKING_ADDRESS,
      ethers.utils.parseUnits('1000000000', 'gwei').toString()
    );
    await approveTx.wait();
    await dispatch('getunStakeAllowances');
  },

  async getunStakeAllowances({ commit }) {
    if (state.address) {
      const sohmContract = await new ethers.Contract(
        addresses[state.network.chainId].SOHM_ADDRESS,
        ierc20Abi,
        provider
      );
      const unstakeAllowance = await sohmContract.allowance(
        state.address,
        addresses[state.network.chainId].STAKING_ADDRESS
      );
      commit('set', { unstakeAllowance });
    }
  },

  async calculatePreTaoSaleQuote({ commit }, value) {
    commit('set', { amount: value * 100 });
  },

  async calculateSaleQuote({ commit }, value) {
    commit('set', { amount: value / state.price });
  },

  async getAllotmentPerBuyer({ commit }) {
    try {
      const presale = await new ethers.Contract(
        addresses[state.network.chainId].PRESALE_ADDRESS,
        OHMPreSale,
        provider
      );
      const allotment = await presale.getAllotmentPerBuyer();
      commit('set', { allotment: ethers.utils.formatUnits(allotment, 'ether') });
    } catch (ex) {
      console.log(ex);
    }
  },

  async getMaxPurchase({ commit, dispatch }) {
    const presale = await new ethers.Contract(
      addresses[state.network.chainId].PRESALE_ADDRESS,
      OHMPreSale,
      provider
    );
    const salePrice = await presale.price();

    commit('set', {
      price: ethers.utils.formatUnits(salePrice.toString(), 'ether')
    });
  },

  async stakeTAO({ commit }, value) {
    const signer = provider.getSigner();
    const staking = await new ethers.Contract(
      addresses[state.network.chainId].STAKING_ADDRESS,
      OlympusStaking,
      signer
    );

    const stakeTx = await staking.stakeTAO(ethers.utils.parseUnits(value, 'gwei'));
    await stakeTx.wait();
    const ohmContract = new ethers.Contract(
      addresses[state.network.chainId].OHM_ADDRESS,
      ierc20Abi,
      provider
    );
    const ohmBalance = await ohmContract.balanceOf(state.address);
    const sohmContract = new ethers.Contract(
      addresses[state.network.chainId].SOHM_ADDRESS,
      ierc20Abi,
      provider
    );
    const sohmBalance = await sohmContract.balanceOf(state.address);
    commit('set', {
      ohmBalance: ethers.utils.formatUnits(ohmBalance, 'gwei'),
      sohmBalance: ethers.utils.formatUnits(sohmBalance, 'gwei')
    });
  },
  async unstakeTAO({ commit }, value) {
    const signer = provider.getSigner();
    const staking = await new ethers.Contract(
      addresses[state.network.chainId].STAKING_ADDRESS,
      OlympusStaking,
      signer
    );
    console.log(ethers.utils.parseUnits(value, 'gwei').toString());
    const stakeTx = await staking.unstakeTAO(ethers.utils.parseUnits(value, 'gwei'));
    await stakeTx.wait();
    const ohmContract = new ethers.Contract(
      addresses[state.network.chainId].OHM_ADDRESS,
      ierc20Abi,
      provider
    );
    const ohmBalance = await ohmContract.balanceOf(state.address);
    const sohmContract = new ethers.Contract(
      addresses[state.network.chainId].SOHM_ADDRESS,
      ierc20Abi,
      provider
    );
    const sohmBalance = await sohmContract.balanceOf(state.address);
    commit('set', {
      ohmBalance: ethers.utils.formatUnits(ohmBalance, 'gwei'),
      sohmBalance: ethers.utils.formatUnits(sohmBalance, 'gwei')
    });
  },

  async stakeLP({ commit }, value) {
    const signer = provider.getSigner();
    const staking = await new ethers.Contract(
      addresses[state.network.chainId].LPSTAKING_ADDRESS,
      LPStaking,
      signer
    );
    const stakeTx = await staking.stakeLP(ethers.utils.parseUnits(value, 'ether'));
    await stakeTx.wait();

    const lpContract = new ethers.Contract(
      addresses[state.network.chainId].LP_ADDRESS,
      ierc20Abi,
      provider
    );
    const lpBalance = await lpContract.balanceOf(state.address);
    const lpStakingContract = new ethers.Contract(
      addresses[state.network.chainId].LPSTAKING_ADDRESS,
      LPStaking,
      provider
    );
    const lpStaked = await lpStakingContract.getUserBalance(state.address);
    commit('set', {
      lpBalance: ethers.utils.formatUnits(lpBalance, 'ether'),
      lpStaked: ethers.utils.formatUnits(lpStaked, 'ether')
    });
  },

  async unstakeLP({ commit }, value) {
    const signer = provider.getSigner();
    const staking = await new ethers.Contract(
      addresses[state.network.chainId].LPSTAKING_ADDRESS,
      LPStaking,
      signer
    );
    const unstakeTx = await staking.unstakeLP();
    await unstakeTx.wait();

    const lpContract = new ethers.Contract(
      addresses[state.network.chainId].LP_ADDRESS,
      ierc20Abi,
      provider
    );
    const lpBalance = await lpContract.balanceOf(state.address);
    const lpStakingContract = new ethers.Contract(
      addresses[state.network.chainId].LPSTAKING_ADDRESS,
      LPStaking,
      provider
    );
    const lpStaked = await lpStakingContract.getUserBalance(state.address);
    commit('set', {
      lpBalance: ethers.utils.formatUnits(lpBalance, 'ether'),
      lpStaked: ethers.utils.formatUnits(lpStaked, 'ether')
    });
  },

  async claimRewards() {
    const signer = provider.getSigner();
    const staking = await new ethers.Contract(
      addresses[state.network.chainId].LPSTAKING_ADDRESS,
      LPStaking,
      signer
    );
    const claimTx = await staking.claimRewards();
    await claimTx.wait();
  },

  async getMaxSwap({ commit, dispatch }) {
    // const aOHMContract = await new ethers.Contract(
    //   addresses[state.network.chainId].AOHM_ADDRESS,
    //   ierc20Abi,
    //   provider
    // );
    // const aOHMBalanceBeforeDecimals = await aOHMContract.balanceOf(state.address);
    const aOHMBalance = 0 / 1000000000;

    commit('set', { maxSwap: aOHMBalance });
  },

  async migrateToOHM({ commit }, value) {
    // const signer = provider.getSigner();
    // const migrateContact = await new ethers.Contract(
    //   addresses[state.network.chainId].MIGRATE_ADDRESS,
    //   MigrateToOHM,
    //   signer
    // );

    // const aOHMContract = await new ethers.Contract(
    //   addresses[state.network.chainId].AOHM_ADDRESS,
    //   ierc20Abi,
    //   provider
    // );
    // const aOHMContractWithSigner = aOHMContract.connect(signer);

    // const allowance = await aOHMContract.allowance(
    //   state.address,
    //   addresses[state.network.chainId].MIGRATE_ADDRESS
    // );

    // if (allowance < value * 1000000000) {
    //   const approveTx = await aOHMContractWithSigner.approve(
    //     addresses[state.network.chainId].MIGRATE_ADDRESS,
    //     parseEther((1e9).toString())
    //   );
    //   commit('set', { allowanceTx: 1 });
    //   await approveTx.wait(state.confirmations);
    // }

    // const migrateTx = await migrateContact.migrate(value * 1000000000);
    // await migrateTx.wait();
    return null;
  }
};

export default {
  state,
  mutations,
  actions
};
