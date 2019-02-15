/* eslint-disable */
import { FETCH_TOKENS, FETCH_TOKEN, FETCH_TOKEN_HOLDERS, FETCH_TOKEN_TRANSFERS} from './action.type'
import { SET_TOKENS,SET_TOKEN, SET_TOKEN_HOLDERS, SET_TOKEN_TRANSFERS } from './mutation.type'
import axios from 'axios'
import CONFIG from '../config'
import Vue from 'vue'
import ValidUrl from 'valid-url'

const state = {
  tokens: {},
  token: {},
  tokenTransfers: {},
  tokenHolders: {}
}

const getters = {
  tokens(state) {
    return state.tokens
  },
  token(state) {
    return state.token
  },
  tokenTransfers(state) {
    return state.tokenTransfers
  },
  tokenHolders(state) {
    return state.tokenHolders
  },
}

const actions = {
  [FETCH_TOKENS]({ commit },{start}) {
    return axios.get(`${CONFIG.api}/tokens?start=${start}`).then((res) => {
      commit(SET_TOKENS,res.data)
    }).catch((e) => {
      console.error(e)
    })
  },
  [FETCH_TOKEN]({ commit, state },{id}) {
    if (state.token && state.token.id === id) {
      return Promise.resolve(state.token)
    }
    return axios.get(`${CONFIG.api}/token/${id}`).then((res) => {
      commit(SET_TOKEN, res.data)
      return res.data
    }).catch((e) => {
      console.error(e)
    })
  },
  [FETCH_TOKEN_HOLDERS]({ commit },{id}) {
    return axios.get(`${CONFIG.api}/token/${id}/holders`).then((res) => {
      commit(SET_TOKEN_HOLDERS, res.data)
    }).catch((e) => {
      console.error(e)
    })
  },
  [FETCH_TOKEN_TRANSFERS]({ commit },{id}) {
    return axios.get(`${CONFIG.api}/token/${id}/transfers`).then((res) => {
      commit(SET_TOKEN_TRANSFERS, res.data)
    }).catch((e) => {
      console.error(e)
    })
  }
}

const mutations = {
  [SET_TOKENS](state, tokens) {
    state.tokens = tokens
  },
  [SET_TOKEN](state, token) {

    if (!token){
      return;
    }

    //validate url
    if (token.url){
      if ( (!ValidUrl.isWebUri(token.url))) {
        if (ValidUrl.isWebUri('http://'  + token.url)){
          token.url = 'http://' + token.url
        }else{
          token.url = null
        }
      }
    }

    state.token = token
  },
  [SET_TOKEN_HOLDERS](state, holders) {
    state.tokenHolders = holders
  },
  [SET_TOKEN_TRANSFERS](state, transfers) {
    state.tokenTransfers = transfers
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}