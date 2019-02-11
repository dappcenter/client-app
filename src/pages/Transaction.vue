<template>
  <q-page class="flex">
    <div class="ui fluid container" v-cloak>
      <br><br>
      <div class="ui container">
      <h1 class="ui dividing header"><small><i class="ui exchange icon"></i>Transaction </small></h1>
      <table class="ui compact definition table">
        <tbody>
          <tr>
            <td>Hash</td>
            <td>{{tx.hash}}</td>
          </tr>
          <tr>
            <td>Block</td>
            <td><a :href="`/block/${tx.block}`">{{tx.block}}</a></td>
          </tr>
          <tr>
            <td>Type</td>
            <td><span class="ui label">{{tx.typeLabel}}</span></td>
          </tr>
          <tr>
            <td>From</td>
            <td><a :href="`/address/${tx.from}`">{{tx.from}}</a></td>
          </tr>
          <tr>
            <td>Timestamp</td>
            <td>{{tx.timestamp|moment("from")}} [{{tx.timestamp|moment("DD-MM-YYYY HH:mm:ss")}}]</td>
          </tr>
          <tr>
            <td>Status</td>
            <td><span class="ui small green label" v-if="tx.confirmed">CONFIRMED</span><span class="ui small red label" v-if="!tx.confirmed">UNCONFIRMED</span></td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  </q-page>
</template>

<style>
</style>

<script>
import { mapGetters } from 'vuex'
import {FETCH_TX} from '../store/action.type'
export default {
  name: 'TransactionPage',
  meta () {
    return {
      title: `Tron transaction informations: ${this.tx.hash}`,
      meta: {
        description: { name: 'description', content: `Get all informations about transaction ${this.tx.hash} on Tron blockchain` }
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
    // request (req) {
    //   this.loading = true
    //   let start = (req.pagination.page - 1) * req.pagination.rowsPerPage
    //   this.$store.dispatch(FETCH_BLOCK_TRANSACTIONS, {start: start, height: this.$route.params.block}).then(() => {
    //     let data = this.blockTxs
    //     this.serverPagination = req.pagination
    //     this.serverPagination.rowsNumber = data.total
    //     this.serverData = data.items
    //     this.loading = false
    //   })
    // }
  },
  mounted () {
    // this.request({
    //   pagination: this.serverPagination,
    //   filter: this.filter
    // })
  },
  computed: {
    ...mapGetters([
      'tx'
    ])
  },
  preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    return store.dispatch(FETCH_TX, {start: 0, hash: currentRoute.params.hash})
  }
}
</script>
