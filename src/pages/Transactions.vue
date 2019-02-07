<template>
  <q-page class="flex">
    <div class="ui fluid container">
      <div class="ui container">
      <h1 class="ui dividing header"><small><i class="ui exchange icon"></i>Transactions</small></h1>
        <q-table class="ui striped table"
            :data="serverData"
            :columns="columns"
            :pagination.sync="serverPagination"
            :loading="loading"
            row-key="name"
            separator="none"
            @request="request"
          >
          <q-tr slot="body" slot-scope="props">
            <q-td key="hash" :props="props"><a :href="`/tx/${props.row.hash}`">{{ props.row.hash|truncate(25) }}</a></q-td>
            <q-td key="age" :props="props" :title="props.row.timestamp|moment('dddd, MMMM Do YYYY, h:mm:ss a')">{{ props.row.timestamp | moment("from") }}</q-td>
            <q-td key="from" :props="props"><a :href="`/address/${props.row.from}`">{{ props.row.from }}</a></q-td>
            <q-td key="confirmed" :props="props"><span class="ui small red label" v-if="!props.row.confirmed">Unconfirmed</span><span class="ui small green label" v-if="props.row.confirmed">Confirmed</span></q-td>
            <q-td key="type" :props="props"><span class="ui tiny label">{{ props.row.typeLabel }}</span></q-td>
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
import { FETCH_TRANSACTIONS } from '../store/action.type'
export default {
  name: 'TransactionsPage',
  meta: {
    title: 'Tron transactions list',
    meta: {
      description: { name: 'description', content: 'See all transactions on Tron blockchain' }
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
          field: 'hash',
          sortable: false
        },
        {
          name: 'age',
          required: true,
          label: 'Age',
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
          name: 'confirmed',
          required: true,
          label: 'Status',
          align: 'center',
          field: 'confirmed',
          sortable: false
        },
        {
          name: 'type',
          required: true,
          label: 'Type',
          align: 'left',
          field: 'typeLabel',
          sortable: false
        }
      ]
    }
  },
  methods: {
    request (req) {
      this.loading = true
      let start = (req.pagination.page - 1) * req.pagination.rowsPerPage
      this.$store.dispatch(FETCH_TRANSACTIONS, { start: start }).then(res => {
        let data = this.transactions
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
    ...mapGetters(['transactions'])
  }
}
</script>
