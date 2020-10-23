<template>
  <div class="row">
    <div class="col s12 m12 l12">

      <div class="card panel">
        <div class="card-content">
          <span class="card-title">State History</span>
          <p class="section">
            Here you can view each change made to the model during your session. You may delete states, revert to a
            state, or clear the history. States are sorted in reverse order, with the most recent state first.
            To add a state, use the sidebar to submit a query to the model.
          </p>
          <span>There are currently {{history.length}} states in history.</span>
          <a class="clear-history btn btn-small btn-flat white-text red right waves-effect waves-red"
             v-bind:class="{'disabled': history.length === 1}"
             @click="clearHistory">
            <i class="material-icons right">delete_forever</i>Clear History
          </a>
        </div>
      </div>

      <history-row v-for="(row, index) in history"
                   v-bind:key="index"
                   :index="index"
                   :length="history.length"
                   :time="row.time"
                   :tags="row.tags"
                   @load="$emit('load', index)"/>
    </div>
  </div>
</template>
<script>
import HistoryRow from "@/components/tabs/HistoryRow";

export default {
    name: 'TabHistory',
    components: {
        HistoryRow
    },
    computed: {
        history() {
            return this.$store.state.history
        },
    },
    methods: {
        clearHistory() {
            return this.$store.commit("clearHistory")
        }
    }
}
</script>
<style>
a.clear-history.btn {
  margin-right: -12px;
}
</style>