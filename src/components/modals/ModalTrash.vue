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
import HistoryRow from "@/components/tabs/HistoryRow";

export default {
  name: "ModalSessions",
  components: {
    HistoryRow
  },
  data() {
    return {
      id: 'modal-content',
    }
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
    },
    domNode() {
      return document.querySelector('#' + this.id)
    },
  },
  methods: {
    instance() {
      // NB: This must be a method, NOT a computed property
      return this.$_M.Modal.getInstance(this.domNode)
    },
    open() {
      // Instantiate if undefined.
      if (this.instance() === undefined) {
        this.$_M.Modal.init(this.domNode)
      }
      this.instance().open();
    },
    close() {
      this.instance().close()
    }
  }
}
</script>

<style scoped>
div.modal-content {
  overflow-y:scroll;
}
</style>