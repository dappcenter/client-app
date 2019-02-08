/* eslint-disable */
import { FETCH_TRX_PRICE } from './action.type'
import { SET_TRX_PRICE } from './mutation.type'
import axios from 'axios'
import CONFIG from '../config'
import Vue from 'vue'

const state = {
  trxPrice: {}
}

const getters = {
  trxPrice(state) {
    return state.trxPrice
  }
}

const actions = {
  [FETCH_TRX_PRICE]({ commit }) {
    return axios.get(`https://api.coinmarketcap.com/v1/ticker/tronix/`).then((res) => {
      commit(SET_TRX_PRICE,res.data[0])
    }).catch((e) => {
      console.error(e)
    })
  }
}

const mutations = {
  [SET_TRX_PRICE](state, data) {
    state.trxPrice = data
  }}
export default {
  state,
  getters,
  actions,
  mutations
}