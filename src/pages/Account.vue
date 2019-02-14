<template>
<q-page class="flex">
    <div class="ui fluid container" v-cloak>
        <br>
        <br>
        <div class="ui container">
            <h1 class="ui dividing header">
                <small>
                    <i class="icon user"></i> Address</small>
            </h1>
            <div class="ui vertical stripe segment" style="background: #f5f5f5;opacity: 0.7;">
                <div class="ui grid ">
                    <div class="column">
                        <table>
                            <tbody>
                                <tr>
                                    <td><div v-html="identicon"></div></td>
                                    <td>
                                        <h2 class="ui header nomobile">
                                            <small>{{addressDetail.address}} <small v-if="addressDetail.name"><small>({{addressDetail.name}})</small></small></small>
                                        </h2>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div class="ui fluid grid">
                            <div class="one wide column"></div>
                            <div class="eleven wide column">
                                <div class="ui stackable three column centered grid container">
                                    <div class="ui aligned column">
                                        <div style="margin-bottom: 0;" class="ui mini red statistic">
                                            <div class="value">
                                                {{addressDetail.balance|fromSun|toLocaleString}} TRX
                                            </div>
                                            <div class="label">
                                                Balance
                                            </div>
                                        </div>
                                    </div>
                                    <div class="ui center aligned column">
                                        <div style="margin-bottom: 0;" class="ui mini orange statistic">
                                            <div class="value">{{addressDetail.frozenBalance|fromSun|toLocaleString}}</div>
                                            <div class="label">
                                                Tron power
                                            </div>
                                        </div>
                                    </div>
                                    <div class="ui center aligned column" v-if="addressDetail.balance>0 && usdValue">
                                        <div style="margin-bottom: 0;" class="ui mini green statistic">
                                            <div class="value">
                                                {{usdValue|toLocaleString}}$
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
            <br>
            <br>
            <!--ACCOUNT DETAIL-->
            <div class="ui segment">
                <div class="ui stackable grid">
                    <div class="ten wide column">
                        <table class="ui compact very basic table ">
                            <tbody>
                                <tr>
                                    <td>Creation date</td>
                                    <td>
                                        <span class="timestamp">{{addressDetail.created|moment("DD-MM-YYYY HH:mm:ss")}}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>TRX balance</td>
                                    <td >
                                        <table class="ui very basic table " v-if="addressDetail.frozenBalance>0">
                                            <tbody>
                                                <tr>
                                                    <td>Available</td>
                                                    <td>{{addressDetail.balance|fromSun|toLocaleString}} TRX</td>
                                                </tr>
                                                <tr>
                                                    <td>Frozen</td>
                                                    <td>{{addressDetail.frozenBalance|fromSun|toLocaleString}} TRX &nbsp;&nbsp;
                                                        <small>(Expires:
                                                            <span class="timestamp">{{addressDetail.frozenBalanceExpiration|moment("from")}} - {{addressDetail.frozenBalanceExpiration|moment("DD-MM-YYYY HH:mm:ss")}}</span>)</small>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Total</td>
                                                    <td>{{totalBalance|fromSun|toLocaleString}} TRX </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <span v-else>{{addressDetail.balance|fromSun|toLocaleString}} TRX</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="six wide column" v-if="addressHasVotes">
                        <div id="currentVotesContainer" >
                            <b>Current votes repartition</b>

                            <div id="currentVotes" style="height:300px;"></div>
                        </div>
                    </div>
                </div>
            </div>
            <!--TABS-->
            <q-tabs :inverted="true">
                <q-tab default slot="title" name="tab-tokens" label="Tokens" />
                <q-tab slot="title" name="tab-transactions" label="Transactions" @select="requestTxsInit()" />
                <q-tab slot="title" name="tab-transfers" label="Transfers" @select="requestTransfersInit()" />
                <q-tab-pane name="tab-tokens">
                    <table class="ui striped table" v-if="addressDetail.assets">
                        <thead>
                            <tr class="center aligned">
                                <th>ID</th>
                                <th>Token</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(value,key) in addressDetail.assets" :key="key" class="center aligned">
                                <td>
                                    <a :href="'/token/'+key.split(':')[0]">{{key|tokenId('id')}}</a>
                                </td>
                                <td>{{key|tokenId}}</td>
                                <td>{{value|toLocaleString}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="ui icon small info message" v-if="!addressDetail.assets">
                        <div class="content">
                            <div class="header">
                                <i class="circle info icon"></i> No tokens yet for this account
                            </div>
                        </div>
                    </div>
                </q-tab-pane>
                <q-tab-pane name="tab-transactions">
                    <q-table class="ui striped center aligned table" :data="transactions.serverData" :columns="transactions.columns" :pagination.sync="transactions.serverPagination"
                        :loading="transactions.loading" row-key="name" separator="none" @request="requestTxs">
                        <q-tr slot="body" slot-scope="props" :props="props">
                            <q-td key="hash" :props="props">
                                <a :href="`/tx/${props.row.hash}`">{{props.row.hash|truncate}}</a>
                            </q-td>
                            <q-td key="confirmed" :props="props">
                                <span class="ui small green label" v-if="props.row.confirmed">CONFIRMED</span>
                                <span class="ui small red label" v-if="!props.row.confirmed">UNCONFIRMED</span>
                            </q-td>
                            <q-td key="age" :props="props">{{ props.row.timestamp | moment("DD-MM-YYYY HH:mm:ss") }}</q-td>
                            <q-td key="type" :props="props">
                                <span class="ui small label">{{ props.row.typeLabel }}</span>
                            </q-td>
                        </q-tr>
                    </q-table>
                </q-tab-pane>

                <q-tab-pane name="tab-transfers">
                    <q-table class="ui striped center aligned table" :data="transfers.serverData" :columns="transfers.columns" :pagination.sync="transfers.serverPagination"
                        :loading="transfers.loading" row-key="name" separator="none" @request="requestTransfers">
                        <q-tr slot="body" slot-scope="props" :props="props">
                            <q-td key="hash" :props="props">
                                <a :href="`/tx/${props.row.hash}`">{{props.row.hash|truncate(25)}}</a>
                            </q-td>
                            <q-td key="age" :props="props">{{ props.row.timestamp | moment("DD-MM-YYYY HH:mm:ss") }}</q-td>
                            <q-td key="from" :props="props">
                                <a :href="`/address/${props.row.from}`">{{ props.row.from|truncate(20) }}</a>
                            </q-td>
                            <q-td key="to" :props="props">
                                <a :href="`/address/${props.row.to}`">{{ props.row.to|truncate(20) }}</a>
                            </q-td>
                            <q-td key="amount" :props="props">{{ props.row.amount|toLocaleString }}
                                <span :title="props.row.token|tokenId('id')">
                                    <i>{{props.row.token|tokenId}}</i>
                                </span>
                                <i v-if="!props.row.token"> TRX</i>
                            </q-td>
                            <q-td key="confirmed" :props="props">
                                <span class="ui small green label" v-if="props.row.confirmed">CONFIRMED</span>
                                <span class="ui small red label" v-if="!props.row.confirmed">UNCONFIRMED</span>
                            </q-td>
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
import {FETCH_ADDRESS_DETAIL, FETCH_ADDRESS_TRANSACTIONS, FETCH_ADDRESS_TRANSFERS, FETCH_TRX_PRICE} from '../store/action.type'
import tronweb from 'tronweb'
import 'taucharts/dist/taucharts.min.css'
import jdenticon from 'jdenticon'

export default {
  name: 'AddressDetailPage',
  meta () {
    return {
      title: `Tron wallet address ${this.getMetaTitle()} - ${this.addressDetail.address} informations`,
      meta: {
        description: { name: 'description', content: `Get all informations about ${this.addressDetail.address} wallet address on Tron blockchain` }
      }
    }
  },
  data () {
    return {
      usdValue: null,
      identicon: {},
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
            name: 'confirmed',
            required: true,
            label: 'Status',
            align: 'left',
            field: 'confirmed',
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
    },
    generateVotesRepartition () {
      const witnesses = Object.keys(this.addressDetail.votes)
      const votes = []
      witnesses.forEach((w) => {
        votes.push({to: w, votes: this.addressDetail.votes[w]})
      })
      var chart = new this.taucharts.Chart({
        type: 'horizontal-bar',
        guide: {
          x: {
            label: 'Votes',
            autoScale: true
          },
          y: {
            label: 'Candidate',
            autoScale: true
          }
        },
        dimensions: {
          candidate: {
            type: 'order'
          },
          votes: {
            type: 'measure'
          }
        },
        x: 'votes',
        y: 'candidate',
        color: 'candidate',
        data: votes,
        plugins:
          [
            this.taucharts.api.plugins.get('tooltip')({
              fields: ['toName', 'toUrl', 'to', 'votes'],
              formatters: {
                toUrl: {
                  label: 'URL'
                },
                toName: {
                  label: 'Name'
                },
                to: {
                  label: 'Address'
                }
              }
            })
          ]
      })
      chart.renderTo('#currentVotes')
    }
  },
  mounted () {
    // generate jdenticon
    this.identicon = jdenticon.toSvg(this.addressDetail.address, 40)
    // generate address current votes repartition
    if (this.addressHasVotes) {
      this.taucharts = require('taucharts')
      require('taucharts/dist/plugins/tooltip')
      this.generateVotesRepartition()
    }
    // fetch USD price value
    this.$store.dispatch(FETCH_TRX_PRICE).then(() => {
      this.usdValue = Number(this.trxPrice.price_usd * (Number(tronweb.fromSun(this.addressDetail.balance)))).toFixed(6)
    })
  },
  computed: {
    addressHasVotes () {
      return this.addressDetail.votes && Object.keys(this.addressDetail.votes).length > 0
    },
    totalBalance () {
      return this.addressDetail.balance + this.addressDetail.frozenBalance
    },
    ...mapGetters([
      'addressDetail',
      'addressTxs',
      'addressTransfers',
      'trxPrice'
    ])
  },
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    return store.dispatch(FETCH_ADDRESS_DETAIL, {address: currentRoute.params.address}).then(() => {

    })
  }
}
</script>
