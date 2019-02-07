<template>
<div>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="#"
        :glossy="false"
        :inverted="true"
        v-if="$route.path!='/'">
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu">
          <q-icon name="menu" />
        </q-btn>
        <img class="ui image" src="/statics/images/logo_30.png" width="29" height="30"/>
        <q-toolbar-title>
          TRXPL<i class="search icon" style="margin-right:-2px;margin-left:-2px"/>RER<small>.io</small>
          <div slot="subtitle">Tron Blockchain Explorer</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
      v-if="$route.path!='/'">
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-item @click.native="$router.push('/')">
          <q-item-main label="Home" />
        </q-item>
        <q-item @click.native="$router.push('/tokens')">
          <q-item-main label="Tokens" />
        </q-item>
        <q-item @click.native="$router.push('/blocks')">
          <q-item-main label="Blocks" />
        </q-item>
        <q-item @click.native="$router.push('/transactions')">
          <q-item-main label="Transactions" />
        </q-item>
        <q-item @click.native="$router.push('/accounts')">
          <q-item-main label="Accounts" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
<q-btn
  v-back-to-top
  round
  color="teal-5"
  class="fixed-bottom-right"
  style="margin: 0 15px 15px 0"
>
  <q-icon name="keyboard_arrow_up" />
</q-btn>
  </q-layout>
</div>
</template>

<script>
import { openURL } from 'quasar'
export default {
  name: 'MainLayout',
  meta: {
    title: 'TRON Block Explorer',
    titleTemplate: title => `${title} - TRXPLORER.io`,
    description: 'TRXPlorer.io is a blockchain explorer for the Tron protocol. You can track every block, transactions, addresses, coins/tokens or other assets of the Blockchain.'
  },
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  methods: {
    openURL,
    goTo () {
      this.$router.push('/blocks')
    }
  }
}
</script>

<style>
</style>
