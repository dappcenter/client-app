<template>
  <q-page class="flex">
<div class="ui fluid container" v-cloak>
<div class="eyecatcher"></div>
<div style="border-bottom:none;" class="ui vertical masthead center aligned segment hero">
<div class="ui container homemenu">
<div class="ui stackable large secondary pointing menu">
<a class="active item nomobile" href="#search">Home</a>
<a class="item nomobile" href="/blocks">Blocks</a>
<a class="item nomobile" href="/transactions">Transactions</a>
<!--<a class="item nomobile" href="/nodes">Nodes</a>-->
<!--<a class="item nomobile" href="/representatives" >Representatives</a>-->
<!--<a class="item nomobile" href="/votes" >Votes</a>-->
<a class="item nomobile" href="/accounts">Accounts</a>
<a class="item nomobile" href="/tokens">Tokens</a>
<!--<a class="item nomobile" href="/tokens">Tokens</a>-->
<!--<a class="item nomobile" href="/markets">Markets</a>-->
<!--<a class="item nomobile" href="/charts">Charts</a>-->
<span class="mobile-only">
<a id="mobile-menu" class="item right floated " href="#" ><i class="sidebar icon"></i> Menu</a>
</span>
</div>
</div>
<br><br>
<div class="ui text container">
<img alt="" src="/statics/images/logo_30.png" />
<h1 class="ui header">
TRXPL<i class="search icon" style="margin-right:-5px;"></i>RER.io
</h1>
<h2><a name="search"></a><a name="search"></a><small><small>Tron Blockchain Explorer</small></small></h2>
<!--
<form action="/search" method="post">
<div class="ui category search">
<div class="ui massive icon input">
<input name="q" class="prompt" type="text" placeholder="Address, Hash, Token ...">
<i class="search icon"></i>
</div>
<div class="results"></div>
</div>
</form>
-->
</div>
</div>
</div>
  </q-page>
</template>
<style>
</style>

<script>
export default {
  name: 'PageIndex',
  meta: {
    meta: {
      description: { name: 'description', content: 'TRXPlorer.io is a blockchain explorer for the Tron protocol. You can track every block, transactions, addresses, coins/tokens or other assets of the Blockchain.' }
    }
  },
  data () {
    return {}
  },
  mounted () {
  }
}
</script>
