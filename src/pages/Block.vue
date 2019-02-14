<template>
  <q-page class="flex">
    <div class="ui fluid container" v-cloak>
      <br><br>
      <div class="ui container">
      <h1 class="ui dividing header"><small><i class="ui cube icon"></i>Block #{{block.height}}</small></h1>
      <table class="ui compact definition table">
        <tbody>
          <tr>
            <td>Height</td>
            <td>{{block.height}}</td>
          </tr>
          <tr>
            <td>Hash</td>
            <td>{{block.hash}}</td>
          </tr>
          <tr>
            <td>Timestamp</td>
            <td>{{block.timestamp|moment("from")}} [{{block.timestamp|moment("DD-MM-YYYY HH:mm:ss")}}]</td>
          </tr>
          <tr>
            <td>Produced By</td>
            <td><a :href="`/address/${block.witness}`">{{block.witness}}</a></td>
          </tr>
          <tr>
            <td>Status</td>
            <td><span class="ui small green label" v-if="block.confirmed">CONFIRMED</span><span class="ui small red label" v-if="!block.confirmed">UNCONFIRMED</span></td>
          </tr>
          <tr>
            <td>Transactions</td>
            <td>{{block.txCount}} transactions</td>
          </tr>
          <tr>
            <td>Size</td>
            <td>{{block.size|toLocaleString}} bytes</td>
          </tr>
        </tbody>
      </table>
      <h2 class="ui dividing header"><small>Transactions</small></h2>
        <q-table class="ui center aligned striped table"
            :data="serverData"
            :columns="columns"
            :pagination.sync="serverPagination"
            :loading="loading"
            row-key="name"
            separator="none"
            @request="request"
          >
          <q-tr slot="body" slot-scope="props" :props="props">
            <q-td key="hash" :props="props"><a :href="`/tx/${props.row.hash}`">{{props.row.hash}}</a></q-td>
            <q-td key="age" :props="props">{{ props.row.timestamp | moment("DD-MM-YYYY HH:mm:ss") }}</q-td>
            <q-td key="from" :props="props"><a :href="`/address/${props.row.from}`">{{ props.row.from }}</a></q-td>
            <q-td key="confirmed" :props="props"><span class="ui small green label" v-if="props.row.confirmed">CONFIRMED</span><span class="ui small red label" v-if="!props.row.confirmed">UNCONFIRMED</span></q-td>
          </q-tr>

        </q-table>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import { mapGetters } from 'vuex'
import {FETCH_BLOCK, FETCH_BLOCK_TRANSACTIONS} from '../store/action.type'
export default {
  name: 'BlockPage',
  meta () {
    return {
      title: `Tron block #${this.block.height} informations`,
      meta: {
        description: { name: 'description', content: `Get all informations about block ${this.block.height} on Tron blockchain` }
      }
    }
  },
  data () {
    return {
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
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        },
        {
          name: 'age',
          required: true,
          label: 'Timestamp',
          align: 'left',
          field: 'timestamp',
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        },
        {
          name: 'from',
          required: true,
          label: 'From',
          align: 'center',
          field: 'from',
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        },
        {
          name: 'confirmed',
          required: true,
          label: 'Status',
          align: 'left',
          field: 'confirmed',
          sortable: false,
          classes: 'my-class',
          style: 'width: 500px'
        }
      ]
    }
  },
  methods: {
    request (req) {
      this.loading = true
      let start = (req.pagination.page - 1) * req.pagination.rowsPerPage
      this.$store.dispatch(FETCH_BLOCK_TRANSACTIONS, {start: start, height: this.$route.params.block}).then(() => {
        let data = this.blockTxs
        this.serverPagination = req.pagination
        this.serverPagination.rowsNumber = data.total
        this.serverData = data.items
        this.loading = false
      })
    }
  },
  mounted () {
    this.request({
      pagination: this.serverPagination,
      filter: this.filter
    })
  },
  computed: {
    ...mapGetters([
      'block',
      'blockTxs'
    ])
  },
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    return store.dispatch(FETCH_BLOCK, {start: 0, height: currentRoute.params.block})
  }
}
</script>
