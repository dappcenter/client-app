<template>
  <q-page class="flex">
    <div class="ui fluid container">
      <div class="ui container">
      <h1 class="ui dividing header"><small><i class="ui token icon"></i>Tokens</small></h1>
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
            <q-td key="name" :props="props"><a :href="`/token/${props.row.id}`">{{ props.row.name }}</a></q-td>
            <q-td key="type" :props="props" ><span class="ui label"> <span v-if="props.row.type==0">TRC10</span><span v-if="props.row.type==1">TRC20</span></span></q-td>
            <q-td key="supply" :props="props">{{ props.row.supply }}</q-td>
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
import {FETCH_TOKENS} from '../store/action.type'
export default {
  name: 'TokensPage',
  meta: {
    title: 'Tron tokens list',
    meta: {
      description: { name: 'description', content: 'Get all informations the trc10 and trc20 tokens created on Tron blockchain.' }
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
          name: 'name',
          required: true,
          label: 'Name',
          align: 'left',
          field: 'name',
          sortable: false
        },
        {
          name: 'type',
          required: true,
          label: 'Type',
          align: 'left',
          field: 'type',
          sortable: false
        },
        {
          name: 'supply',
          required: true,
          label: 'Supply',
          align: 'center',
          field: 'supply',
          sortable: false
        }
      ]
    }
  },
  methods: {
    request (req) {
      this.loading = true
      let start = (req.pagination.page - 1) * req.pagination.rowsPerPage
      this.$store.dispatch(FETCH_TOKENS, {start: start}).then((res) => {
        let data = this.tokens
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
      'tokens'
    ])
  }
}
</script>
