<template>
  <q-page class="flex">
    <div class="ui fluid container">
      <div class="ui container">
      <h1 class="ui dividing header"><small><i class="ui cube icon"></i>Blocks</small></h1>
        <q-table class="ui center aligned striped table"
            :data="serverData"
            :columns="columns"
            :pagination.sync="serverPagination"
            :loading="loading"
            row-key="name"
            separator="none"
            @request="request"
          >
          <q-tr slot="body" slot-scope="props">
            <q-td key="height" :props="props"><a :href="`/block/${props.row.height}`">{{ props.row.height }}</a></q-td>
            <q-td key="age" :props="props" :title="props.row.timestamp|moment('dddd, MMMM Do YYYY, h:mm:ss a')">{{ props.row.timestamp | moment("from") }}</q-td>
            <q-td key="txCount" :props="props">{{ props.row.txCount }}</q-td>
            <q-td key="confirmed" :props="props"><span class="ui small red label" v-if="!props.row.confirmed">Unconfirmed</span><span class="ui small green label" v-if="props.row.confirmed">Confirmed</span></q-td>
            <q-td key="producer" :props="props"><a :href="`/address/${props.row.witness}`">{{ props.row.witness }}</a></q-td>
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
import {FETCH_BLOCKS} from '../store/action.type'
export default {
  name: 'BlocksPage',
  meta: {
    title: 'Tron block list',
    meta: {
      description: { name: 'description', content: 'See all informations about tron blocks on the blockchain' }
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
          name: 'height',
          required: true,
          label: 'Height',
          align: 'left',
          field: 'height',
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
          name: 'txCount',
          required: true,
          label: 'Tx count',
          align: 'center',
          field: 'txCount',
          sortable: false
        },
        {
          name: 'confirmed',
          required: true,
          label: 'Confirmed',
          align: 'center',
          field: 'confirmed',
          sortable: false
        },
        {
          name: 'producer',
          required: true,
          label: 'Producer',
          align: 'left',
          field: 'witness',
          sortable: false
        }
      ]
    }
  },
  methods: {
    request (req) {
      this.loading = true
      let start = (req.pagination.page - 1) * req.pagination.rowsPerPage
      this.$store.dispatch(FETCH_BLOCKS, {start: start}).then((res) => {
        let data = this.blocks
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
      'blocks'
    ])
  }
}
</script>
