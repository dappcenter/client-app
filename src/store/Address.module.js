/* eslint-disable */
import { FETCH_ACCOUNTS, FETCH_ADDRESS_DETAIL, FETCH_ADDRESS_TRANSACTIONS,FETCH_ADDRESS_TRANSFERS } from './action.type'
import { SET_ACCOUNTS, SET_ADDRESS_DETAIL, SET_ADDRESS_TRANSACTIONS,SET_ADDRESS_TRANSFERS } from './mutation.type'
import axios from 'axios'
import CONFIG from '../config'
import Vue from 'vue'

const state = {
  addressDetail: {},
  addressTxs: {},
  addressTransfers: {},
  accounts: {}
}

const getters = {
  addressDetail(state) {
    return state.addressDetail
  },
  addressTxs(state) {
    return state.addressTxs
  },
  addressTransfers(state) {
    return state.addressTransfers
  },
  accounts(state){
    return state.accounts
  }
}

const actions = {
  [FETCH_ADDRESS_DETAIL]({ commit },{address}) {
    return axios.get(`${CONFIG.api}/account/${address}`).then((res) => {
      const addressData = res.data
      if (!addressData.frozenBalance) addressData.frozenBalance = 0
      commit(SET_ADDRESS_DETAIL, addressData)
    }).then(()=>{
      
    }).catch((e) => {
      console.error(e)
    })
  },
  [FETCH_ADDRESS_TRANSACTIONS]({ commit },{start, address}) {
    return axios.get(`${CONFIG.api}/account/${address}/transactions?start=${start}`).then((res) => {
      commit(SET_ADDRESS_TRANSACTIONS,res.data)
    }).catch((e) => {
      console.error(e)
    })
  },
  [FETCH_ADDRESS_TRANSFERS]({ commit },{start, address}) {
    return axios.get(`${CONFIG.api}/account/${address}/transfers?start=${start}`).then((res) => {
      commit(SET_ADDRESS_TRANSFERS,res.data)
    }).catch((e) => {
      console.error(e)
    })
  },
  [FETCH_ACCOUNTS]({ commit },{start}) {
    return axios.get(`${CONFIG.api}/accounts?start=${start}`).then((res) => {
      commit(SET_ACCOUNTS,res.data)
    }).catch((e) => {
      console.error(e)
    })
  },
}

const mutations = {
  [SET_ADDRESS_DETAIL](state, address) {
    state.addressDetail = address
  },
  [SET_ADDRESS_TRANSACTIONS](state, txs) {
    state.addressTxs = txs
  },
  [SET_ADDRESS_TRANSFERS](state, txs) {
    state.addressTransfers = txs
  },
  [SET_ACCOUNTS](state, accounts) {
    state.accounts = accounts
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}