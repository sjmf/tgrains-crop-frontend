<template>
  <div :id="id" class="modal">
    <div class="modal-content">
      <h4>Deleted States</h4>

      <div v-if="deletedHistory.length === 0">
        <span>There are currently no deleted states</span>
      </div>

      <div v-else class="row">
        <div class="col s12">
          <history-row v-for="(row, index) in deletedHistory"
                     v-bind:key="index"
                     :index="row.index"
                     :length="deletedHistory.length"
                     :time="row.time"
                     :tags="row.tags"
                     :trash-view="true"/>
        </div>
      </div>

      <div class="modal-footer">
        <a class="modal-close waves-effect waves-green btn-flat green darken-2 white-text">
          Close
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import HistoryRow from "@/components/tabs/HistoryRow.vue";
import ModalMixin from "@/components/modals/modalMixin";

export default {
  name: "ModalSessions",
  mixins: [ModalMixin],
  components: {
    HistoryRow
  },
  computed: {
    deletedHistory() {
      let deletedHistory = []
      for (let i in this.$store.state.history) {
        let row = this.$store.state.history[i]
        if(row.deleted) {
          deletedHistory.push(row)
        }
      }
      return deletedHistory
    }
  }
}
</script>

<style scoped>
div.modal-content {
  overflow-y:scroll;
}
</style>