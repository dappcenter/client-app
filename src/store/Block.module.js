/* eslint-disable */
import { FETCH_BLOCKS, FETCH_BLOCK,FETCH_BLOCK_TRANSACTIONS } from './action.type'
import { SET_BLOCKS,SET_BLOCK,SET_BLOCK_TRANSACTIONS } from './mutation.type'
import axios from 'axios'
import CONFIG from '../config'
import Vue from 'vue'

const state = {
  blocks: [],
  block: {},
  blockTxs: []
}

const getters = {
  blocks(state) {
    return state.blocks
  },
  block(state) {
    return state.block
  },
  blockTxs(state) {
    return state.blockTxs
  }
}

const actions = {
  [FETCH_BLOCKS]({ commit },{start}) {
    return axios.get(`${CONFIG.api}/blocks?start=${start}`).then((res) => {
      commit(SET_BLOCKS,res.data)
    }).catch((e) => {
      console.error(e)
    })
  },
  [FETCH_BLOCK]({ commit },{height}) {
    return axios.get(`${CONFIG.api}/block/${height}`).then((res) => {
      commit(SET_BLOCK, res.data)
    }).catch((e) => {
      console.error(e)
    })
  },
  [FETCH_BLOCK_TRANSACTIONS]({ commit },{start, height}) {
    return axios.get(`${CONFIG.api}/block/${height}/transactions?start=${start}`).then((res) => {
      commit(SET_BLOCK_TRANSACTIONS, res.data)
    }).catch((e) => {
      // console.error(e)
    }).then(() => {
      // 
    });

  }
}

const mutations = {
  [SET_BLOCKS](state, blocks) {
    state.blocks = blocks
  },
  [SET_BLOCK](state, block) {
    state.block = block
  },
  [SET_BLOCK_TRANSACTIONS](state, txs) {
    state.blockTxs = txs
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}