<template>
  <q-page class="flex">
    <div class="ui fluid container">
      <div class="ui container">
      <h1 class="ui dividing header"><small><i class="ui user icon"></i>Accounts</small></h1>
        <q-table class="ui striped center aligned table"
            :data="serverData"
            :columns="columns"
            :pagination.sync="serverPagination"
            :loading="loading"
            row-key="name"
            separator="none"
            @request="request"
          >
          <q-tr slot="body" slot-scope="props">
            <q-td key="address" :props="props"><a :href="`/address/${props.row.address}`">{{ props.row.address }}</a></q-td>
            <q-td key="name" :props="props">{{ props.row.name && props.row.name.length>0 || '-' }}</q-td>
            <q-td key="balance" :props="props">{{ props.row.balance|fromSun }}</q-td>
            <q-td key="age" :props="props" :title="props.row.created|moment('dddd, MMMM Do YYYY, h:mm:ss a')">{{ props.row.created | moment("from") }}</q-td>
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
import {FETCH_ACCOUNTS} from '../store/action.type'
export default {
  name: 'AccountsPage',
  meta: {
    title: 'Tron account and address list',
    meta: {
      description: { name: 'description', content: 'Check all existing account currently on Tron blockchain' }
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
          name: 'address',
          required: true,
          label: 'Address',
          field: 'address',
          sortable: false
        },
        {
          name: 'name',
          required: true,
          label: 'Name',
          field: 'name',
          sortable: false
        },
        {
          name: 'balance',
          required: true,
          label: 'TRX balance',
          field: 'balance',
          sortable: false
        },
        {
          name: 'age',
          required: true,
          label: 'Created',
          align: 'left',
          field: 'created',
          sortable: false
        }
      ]
    }
  },
  methods: {
    request (req) {
      this.loading = true
      let start = (req.pagination.page - 1) * req.pagination.rowsPerPage
      this.$store.dispatch(FETCH_ACCOUNTS, {start: start}).then((res) => {
        let data = this.accounts
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
      'accounts'
    ])
  }
}
</script>
