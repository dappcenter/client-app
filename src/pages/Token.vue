<template>
  <q-page class="flex">
    <div class="ui fluid container" v-cloak>
      <br><br>
      <div class="ui container">
      <h1 class="ui dividing header">
        <small>Token: <small>{{token.name}} <span v-if="token.abbr">({{token.abbr}})</span></small></small>
      </h1>

      <table class="ui compact definition table ">
        <tbody>
          <tr>
            <td>Issuer</td>
            <td><a :href="`/address/${token.issuer}`">{{token.issuer}}</a></td>
          </tr>
          <tr>
            <td>Token type</td>
            <td><div class="ui label"><span v-if="token.type==0">TRC10</span><span v-if="token.type==1">TRC20</span></div></td>
          </tr>
          <tr>
            <td>Participation period (ICO)</td>
            <td>Start: <small class="timestamp">{{token.startTime|moment('from')}}</small>  &nbsp;&nbsp;&nbsp; End: <small class="timestamp">{{token.endTime|moment('from')}}</small></td>
          </tr>
          <tr>
            <td>Total supply</td>
            <td>{{token.supply|toLocaleString}}</td>
          </tr>
          <tr>
            <td>Issue Price</td>
            <td> {{issuePrice|fromSun|toLocaleString}} TRX</td>
          </tr>
          <tr>
            <td>Precision</td>
            <td>{{token.precision}}</td>
          </tr>
          <tr v-if="token.url">
            <td>URL</td>
            <td><a class="url" :href="`${token.url}`" rel="noreferrer noopener" target="_blank">{{token.url}}</a></td>
          </tr>
          <tr>
            <td>Description</td>
            <td>{{token.description}}</td>
          </tr>
        </tbody>
      </table>

<q-tabs :inverted="true">

  <q-tab default slot="title" name="tab-transfers" label="Transfers" @select="requestTransfersInit()"/>
  <q-tab slot="title" name="tab-holders" label="Holders" @select="requestHoldersInit()"/>

  <q-tab-pane name="tab-transfers">
      <q-table class="ui center aligned striped table"
            :data="transfers.serverData"
            :columns="transfers.columns"
            :pagination.sync="transfers.serverPagination"
            :loading="transfers.loading"
            row-key="name"
            separator="none"
            @request="requestTransfers"
          >
          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="hash" :props="props"><a :href="`/tx/${props.row.hash}`">{{props.row.hash|truncate(20)}}</a></q-td>
            <q-td key="age" :props="props">{{ props.row.timestamp | moment("DD-MM-YYYY HH:mm:ss") }}</q-td>
            <q-td key="from" :props="props"><a :href="`/address/${props.row.from}`">{{ props.row.from|truncate(20) }}</a></q-td>
            <q-td key="to" :props="props"><a :href="`/address/${props.row.to}`">{{ props.row.to|truncate(20) }}</a></q-td>
            <q-td key="amount" :props="props">{{ props.row.amount|toLocaleString }}</q-td>
            <q-td key="confirmed" :props="props"><span class="ui small green label" v-if="props.row.confirmed">CONFIRMED</span><span class="ui small red label" v-if="!props.row.confirmed">UNCONFIRMED</span></q-td>
          </q-tr>
    </q-table>
  </q-tab-pane>

  <q-tab-pane name="tab-holders">
          <q-table class="ui center aligned striped table"
            :data="holders.serverData"
            :columns="holders.columns"
            :pagination.sync="holders.serverPagination"
            :loading="holders.loading"
            row-key="name"
            separator="none"
            @request="requestHolders"
          >
        <q-tr slot="body" slot-scope="props" :props="props">
          <q-td key="address" :props="props"><a :href="`/address/${props.row.address}`">{{props.row.address}}</a></q-td>
          <q-td key="quantity" :props="props">{{ props.row.assets[$route.params.id+':'+token.name]|toLocaleString}}</q-td>
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
import {FETCH_TOKEN, FETCH_TOKEN_HOLDERS, FETCH_TOKEN_TRANSFERS} from '../store/action.type'
export default {
  name: 'TokenPage',
  meta () {
    return {
      title: this.getMetaTitle(),
      meta: {
        description: { name: 'description', content: 'Check all existing account currently on Tron blockchain' }
      }
    }
  },
  data () {
    return {
      holders: {
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
            name: 'address',
            required: true,
            label: 'Address',
            align: 'left',
            field: 'address',
            sortable: false
          },
          {
            name: 'quantity',
            required: true,
            label: 'Quantity',
            align: 'left',
            field: 'assets',
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
      if (this.token.abbr) {
        return `Tron token: ${this.token.name} (${this.token.abbr}) - ${this.token.id}  token tracker, price and informations`
      } else {
        return `Tron token: ${this.token.name} - ${this.token.id}  token tracker, price and informations`
      }
    },
    requestHoldersInit () {
      this.requestHolders({
        pagination: this.holders.serverPagination,
        filter: this.holders.filter
      })
    },
    requestTransfersInit () {
      this.requestTransfers({
        pagination: this.transfers.serverPagination,
        filter: this.transfers.filter
      })
    },
    requestHolders (req) {
      this.holders.loading = true
      let start = (req.pagination.page - 1) * req.pagination.rowsPerPage
      this.$store.dispatch(FETCH_TOKEN_HOLDERS, {start: start, id: this.$route.params.id}).then(() => {
        let data = this.tokenHolders
        this.holders.serverPagination = req.pagination
        this.holders.serverPagination.rowsNumber = data.total
        this.holders.serverData = data.items
        this.holders.loading = false
      })
    },
    requestTransfers (req) {
      this.transfers.loading = true
      let start = (req.pagination.page - 1) * req.pagination.rowsPerPage
      this.$store.dispatch(FETCH_TOKEN_TRANSFERS, {start: start, id: this.$route.params.id}).then(() => {
        let data = this.tokenTransfers
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
    issuePrice () {
      return Number(this.token.trxNum / this.token.num)
    },
    ...mapGetters([
      'token',
      'tokenTransfers',
      'tokenHolders'
    ])
  },
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    return store.dispatch(FETCH_TOKEN, {id: currentRoute.params.id}).then(() => {

    })
  }
}
</script>
