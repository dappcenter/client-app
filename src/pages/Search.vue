<template>
  <q-page class="flex">
    <div class="ui fluid container">
      <div class="ui container">
      <h1 class="ui dividing header"><small><i class="ui search icon"></i>Search</small></h1>
          <div class="ui segment">
            <b v-if="isGlobalSearching">Searching for "{{globalSearchResult.query}}" ...</b>
            <q-progress indeterminate stripe color="teal" v-if="isGlobalSearching"></q-progress>
            <div class="ui info message" v-if="!isGlobalSearching && globalSearchResult.query">
              <div class="header">
                <i class="ui info circle icon"></i>{{globalSearchResult.result.total}} results found for the query: "{{globalSearchResult.query}}"
              </div>
            </div>
              <div class="ui list">
                <div class="item" v-if="globalSearchResult.result.blocks.length>0">
                  <i class="cube icon"></i>
                  <div class="content">
                    <div class="header">Block</div>
                    <div class="list">
                      <div class="item" v-for="(block,key) in globalSearchResult.result.blocks" :key="key">
                        <i class="file icon"></i>
                        <div class="content">
                          <a :href="`/block/${block.height}`">{{block.height}} - {{block.hash}}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item" v-if="globalSearchResult.result.accounts.length>0">
                  <i class="icon user"></i>
                  <div class="content">
                    <div class="header">Accounts</div>
                    <div class="list">
                      <div class="item" v-for="(account,key) in globalSearchResult.result.accounts" :key="key">
                        <i class="file icon"></i>
                        <div class="content">
                          <div class="description">
                            <a :href="`/address/${account.address}`">{{account.name}} - {{account.address}}</a>
                            <br><br>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="item" v-if="globalSearchResult.result.tokens.length>0">
                  <i class="database icon"></i>
                  <div class="content">
                    <div class="header">Tokens</div>
                       <div class="list">
                      <div class="item" v-for="(token,key) in globalSearchResult.result.tokens" :key="key">
                        <i class="file icon"></i>
                        <div class="content">
                          <div class="description"><a :href="`/token/${token.id}`">{{token.name}} - [{{token.id}}]</a> <br> {{token.description}} <br><br></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
      </div>
    </div>
  </q-page>
</template>
<style>
</style>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'SearchPage',
  data () {
    return {}
  },
  mounted () {
  },
  computed: {
    ...mapGetters([
      'globalSearchResult',
      'isGlobalSearching'
    ])
  }
}
</script>
