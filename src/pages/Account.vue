<template>
  <q-page class="flex">
    <div class="ui fluid container" v-cloak>
      <br><br>
      <div class="ui container">
      <h1 class="ui dividing header"><small><i class="icon user"></i> Address</small></h1>
      <div class="ui vertical stripe segment" style="background: #f5f5f5;opacity: 0.7;">
    <div class="ui grid ">
<div class="column">
<table>
  <tbody>
  <tr>
    <td></td><td></td>
  </tr>
  </tbody>
</table>
<table>
  <tbody>
    <tr><td></td><td><h2 class="ui header nomobile"><small>{{addressDetail.address}}</small></h2></td></tr>
  </tbody>
</table>
<div class="ui fluid grid">
<div class="one wide column"></div>
<div class="eleven wide column">
<div class="ui stackable three column centered grid container">
<div class="ui aligned column">
<div style="margin-bottom: 0;"  class="ui mini red statistic">
<div class="value">
{{addressDetail.balance|fromSun|toLocaleString}} TRX
</div>
<div class="label">
Balance
</div>
</div>
</div>
<div class="ui center aligned column">
<div style="margin-bottom: 0;"  class="ui mini orange statistic">
<div class="value">{{addressDetail.frozenBalance|fromSun}}</div>
<div class="label">
Tron power
</div>
</div>
</div>
<div class="ui center aligned column">
<div style="margin-bottom: 0;"  class="ui mini green statistic">
<div class="value">
{{addressDetail.usdHolding}}$
</div>
<div class="label">
USD VALUE
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<br><br>
<q-tabs :inverted="true">
  <q-tab default slot="title" name="tab-tokens" label="Tokens" />
  <q-tab slot="title" name="tab-transactions" label="Transactions" @select="requestTxsInit()"/>
  <q-tab slot="title" name="tab-transfers" label="Transfers" @select="requestTransfersInit()"/>
  <q-tab-pane name="tab-tokens">
    <table class="ui striped table"  v-if="addressDetail.assets">
      <thead>
        <tr class="center aligned">
          <th >Token</th>
          <th >Balance</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(value,key) in addressDetail.assets" :key="key" class="center aligned" >
          <td>{{key}}</td><td>{{value|toLocaleString}}</td>
        </tr>
      </tbody>
    </table>
  </q-tab-pane>
  <q-tab-pane name="tab-transactions">
        <q-table class="ui striped table"
            :data="transactions.serverData"
            :columns="transactions.columns"
            :pagination.sync="transactions.serverPagination"
            :loading="transactions.loading"
            row-key="name"
            separator="none"
            @request="requestTxs"
          >
          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="hash" :props="props"><a :href="`/tx/${props.row.hash}`">{{props.row.hash|truncate}}</a></q-td>
            <q-td key="age" :props="props">{{ props.row.timestamp | moment("DD-MM-YYYY HH:mm:ss") }}</q-td>
            <q-td key="type" :props="props">{{ props.row.type }}</q-td>
            <q-td key="confirmed" :props="props"><span class="ui small green label" v-if="props.row.confirmed">CONFIRMED</span><span class="ui small red label" v-if="!props.row.confirmed">UNCONFIRMED</span></q-td>
          </q-tr>
        </q-table>
  </q-tab-pane>

  <q-tab-pane name="tab-transfers">
  <q-table class="ui striped table"
            :data="transfers.serverData"
            :columns="transfers.columns"
            :pagination.sync="transfers.serverPagination"
            :loading="transfers.loading"
            row-key="name"
            separator="none"
            @request="requestTransfers"
          >
          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="hash" :props="props"><a :href="`/tx/${props.row.hash}`">{{props.row.hash|truncate(25)}}</a></q-td>
            <q-td key="age" :props="props">{{ props.row.timestamp | moment("DD-MM-YYYY HH:mm:ss") }}</q-td>
            <q-td key="from" :props="props"><a :href="`/address/${props.row.from}`">{{ props.row.from|truncate(20) }}</a></q-td>
            <q-td key="to" :props="props"><a :href="`/address/${props.row.to}`">{{ props.row.to|truncate(20) }}</a></q-td>
            <q-td key="amount" :props="props">{{ props.row.amount }}</q-td>
            <q-td key="confirmed" :props="props"><span class="ui small green label" v-if="props.row.confirmed">CONFIRMED</span><span class="ui small red label" v-if="!props.row.confirmed">UNCONFIRMED</span></q-td>
          </q-tr>
        </q-table>
  </q-tab-pane>
</q-tabs>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import { mapGetters } from 'vuex'
import {FETCH_ADDRESS_DETAIL, FETCH_ADDRESS_TRANSACTIONS, FETCH_ADDRESS_TRANSFERS} from '../store/action.type'
export default {
  name: 'AddressDetailPage',
  meta () {
    return {
      title: `Tron address ${this.getMetaTitle()} - ${this.addressDetail.address} informations`,
      meta: {
        description: { name: 'description', content: `Get all informations about address ${this.addressDetail.address} on Tron blockchain` }
      }
    }
  },
  data () {
    return {
      transactions: {
        filter: '',
        loading: false,
        serverData: [],
        serverPagination: {
          page: 1,
          rowsNumber: 10,
          rowsPerPage: 50
        },
        columns: [
          {
            name: 'hash',
            required: true,
            label: 'Hash',
            align: 'left',
            field: 'hash',
            sortable: false
          },
          {
            name: 'age',
            required: true,
            label: 'Timestamp',
            align: 'left',
            field: 'timestamp',
            sortable: false
          },
          {
            name: 'type',
            required: true,
            label: 'Type',
            align: 'center',
            field: 'type',
            sortable: false
          },
          {
            name: 'confirmed',
            required: true,
            label: 'Status',
            align: 'left',
            field: 'confirmed',
            sortable: false
          }
        ]
      },
      transfers: {
        filter: '',
        loading: false,
        serverData: [],
        serverPagination: {
          page: 1,
          rowsNumber: 10,
          rowsPerPage: 50
        },
        columns: [
          {
            name: 'hash',
            required: true,
            label: 'Hash',
            align: 'left',
            field: 'hash',
            sortable: false
          },
          {
            name: 'age',
            required: true,
            label: 'Timestamp',
            align: 'left',
            field: 'timestamp',
            sortable: false
          },
          {
            name: 'from',
            required: true,
            label: 'From',
            align: 'center',
            field: 'from',
            sortable: false
          },
          {
            name: 'to',
            required: true,
            label: 'To',
            align: 'center',
            field: 'to',
            sortable: false
          },
          {
            name: 'amount',
            required: true,
            label: 'Amount',
            align: 'center',
            field: 'amount',
            sortable: false
          },
          {
            name: 'confirmed',
            required: true,
            label: 'Status',
            align: 'left',
            field: 'confirmed',
            sortable: false
          }
        ]
      }
    }
  },
  methods: {
    getMetaTitle () {
      if (this.addressDetail.name && this.addressDetail.name.length > 0) {
        return `(${this.addressDetail.name})`
      }
      return ''
    },
    requestTxsInit () {
      this.requestTxs({
        pagination: this.transactions.serverPagination,
        filter: this.transactions.filter
      })
    },
    requestTransfersInit () {
      this.requestTransfers({
        pagination: this.transfers.serverPagination,
        filter: this.transfers.filter
      })
    },
    requestTxs (req) {
      this.transactions.loading = true
      let start = (req.pagination.page - 1) * req.pagination.rowsPerPage
      this.$store.dispatch(FETCH_ADDRESS_TRANSACTIONS, {start: start, address: this.$route.params.address}).then(() => {
        let data = this.addressTxs
        this.transactions.serverPagination = req.pagination
        this.transactions.serverPagination.rowsNumber = data.total
        this.transactions.serverData = data.items
        this.transactions.loading = false
      })
    },
    requestTransfers (req) {
      this.transfers.loading = true
      let start = (req.pagination.page - 1) * req.pagination.rowsPerPage
      this.$store.dispatch(FETCH_ADDRESS_TRANSFERS, {start: start, address: this.$route.params.address}).then(() => {
        let data = this.addressTransfers
        this.transfers.serverPagination = req.pagination
        this.transfers.serverPagination.rowsNumber = data.total
        this.transfers.serverData = data.items
        this.transfers.loading = false
      })
    }
  },
  mounted () {
  },
  computed: {
    ...mapGetters([
      'addressDetail',
      'addressTxs',
      'addressTransfers'
    ])
  },
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    return store.dispatch(FETCH_ADDRESS_DETAIL, {address: currentRoute.params.address}).then(() => {

    })
  }
}
</script>
