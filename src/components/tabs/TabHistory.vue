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
          <a class="clear-history btn btn-flat btn-small red right waves-effect waves-red"
             v-bind:class="{'disabled': history.length === 1}"
             @click="clearHistory">
            <i class="material-icons right">delete_forever</i>Clear History
          </a>
        </div>
      </div>

      <div v-for="(state, index) in history"
           v-bind:key="index"
           class="history-card card panel"
           v-bind:class="[index === historyIndex ? 'green lighten-4' : 'grey lighten-3']">

        <div class="card-content">
          <div class="row">
            <div class="col s8">
              {{index+1}}. <span class="datetime"><i class="tiny material-icons">timer</i> {{ new Date(state.time).toUTCString() }}</span>
              <span v-if="index === historyIndex"><strong>– Current State </strong></span>
            </div>

            <div class="col s4" v-if="index !== historyIndex">
              <a class="btn right btn-small"
                 @click="loadState(index)">
                <i class="material-icons right">forward</i>Load
              </a>

              <a class="btn red right btn-small"
                 @click="deleteState(index)">
                <i class="material-icons">delete</i>
              </a>
            </div>

            <div class="col s4" v-if="index === historyIndex">
              <a class="btn green right btn-small btn-flat white-text">
                <i class="material-icons right">comment</i>Comment
              </a>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
<script>
export default {
    name: 'TabHistory',
    computed: {
        history() {
            return this.$store.state.history
        },
        historyIndex() {
            return this.$store.state.historyIndex
        },
    },
    methods: {
        clearHistory() {
            return this.$store.commit("clearHistory")
        },
        loadState(index) {
            this.$store.commit("setHistoryIndex", index)
            this.$store.commit("loadFromHistory", index)
        },
        deleteState(index) {
            this.$store.commit('deleteFromHistory', index)
        }
    }
}
</script>
<style scoped>
a.btn {
  margin: 0 2px;
}
a.clear-history.btn {
  margin-right: -12px;
}
.card-content div.row:last-child {
  margin-bottom: 0;
}
.card.history-card .card-content  {
  padding: 10px 10px 10px 15px;
}
.card.history-card .col {
  line-height:2rem;
}
.btn-tiny i {
  font-size: 1.0rem;
}
.btn-flat {
  color: #fff;
}
</style>