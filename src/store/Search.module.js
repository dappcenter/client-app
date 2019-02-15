/* eslint-disable */
import { GLOBAL_SEARCH, FETCH_TX, FETCH_TOKEN, FETCH_BLOCK } from './action.type'
import { SET_GLOBAL_SEARCH_RESULT } from './mutation.type'
import axios from 'axios'
import CONFIG from '../config'
import Vue from 'vue'
import tronweb from 'tronweb'

const state = {
  isGlobalSearching: false,
  globalSearchResult: {
    result: {
      blocks: [],
      accounts: [],
      tokens: []
    },
    query: ""
  }
}

const getters = {
  globalSearchResult(state) {
    return state.globalSearchResult
  },
  isGlobalSearching(state){
    return state.isGlobalSearching
  }
}

const actions = {
  [GLOBAL_SEARCH]({ commit, state }, {query}) {
    this._vm.$ga.event('search','global',query)
    // dont search for same query
    if (state.globalSearchResult && state.globalSearchResult.query === query){
      return Promise.resolve(state.globalSearchResult)
    }
    state.globalSearchResult.query = query
    //redirect address directly
    if (tronweb.isAddress(query)){
      this.$router.push(`/address/${query}`)
      return Promise.resolve(query)
    }

    //tx
    if (query && query.length == 64){

      this.dispatch(FETCH_TX,{hash: query}).then((data) => {
        if (data){
          this.$router.push(`/tx/${query}`)
          return Promise.resolve(query)
        }
      })
    }

    //otherwise can be anything else, use api search
    state.isGlobalSearching = true
    this.$router.push('/search')
    axios.post(`${CONFIG.api}/search?query=${query}`).then((res) => {
      commit(SET_GLOBAL_SEARCH_RESULT,{query: query, result: res.data})
      return res.data
    }).catch((e) => {
      console.error(e)
    }).then(() => {
      state.isGlobalSearching = false
    })

  }
}

const mutations = {
  [SET_GLOBAL_SEARCH_RESULT](state, data) {
    state.globalSearchResult = data
  }}
export default {
  state,
  getters,
  actions,
  mutations
}