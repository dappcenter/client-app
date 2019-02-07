/* eslint-disable */
import { FETCH_TRANSACTIONS, FETCH_TX} from './action.type'
import { SET_TRANSACTIONS,SET_TX } from './mutation.type'
import axios from 'axios'
import CONFIG from '../config'
import Vue from 'vue'

const state = {
  transactions: {},
  tx: {}
}

const getters = {
  transactions(state) {
    return state.transactions
  },
  tx(state) {
    return state.tx
  }
}

const actions = {
  [FETCH_TRANSACTIONS]({ commit },{start}) {
    return axios.get(`${CONFIG.api}/transactions?start=${start}`).then((res) => {
      commit(SET_TRANSACTIONS,res.data)
    }).catch((e) => {
      console.error(e)
    })
  },
  [FETCH_TX]({ commit },{hash}) {
    return axios.get(`${CONFIG.api}/transaction/${hash}`).then((res) => {
      commit(SET_TX, res.data)
    }).catch((e) => {
      console.error(e)
    })
  }
}

const mutations = {
  [SET_TRANSACTIONS](state, txs) {
    state.transactions = txs
  },
  [SET_TX](state, tx) {
    state.tx = tx
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}