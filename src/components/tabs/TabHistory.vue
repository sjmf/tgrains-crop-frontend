<template>
  <div class="row" id="history-tab">
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

          <a class="right pad overrun btn btn-small btn-flat white-text blue darken-2 right waves-effect waves-blue"
             v-bind:class="{'disabled': history.length === 1 || readonly}"
             @click="showNewSessionConfirm">
            <i class="material-icons right">save</i>New Session
          </a>

          <a class="right btn btn-small btn-flat white-text brown lighten-1 right waves-effect waves-brown"
             @click="showSessionsDialog">
            <i class="material-icons right">storage</i>Show Sessions
          </a>
        </div>
      </div>

      <history-row v-for="(row, index) in history.slice().reverse()"
                   v-bind:key="index"
                   :index="history.length -1 -index"
                   :length="history.length"
                   :time="row.time"
                   :tags="row.tags"
                   :deleted="row.deleted"
                   @load="$emit('load', index)"
                   @comment="$emit('comment', history.length -1 -index)"/>
    </div>


    <!-- MODALS -->

    <modal-confirm
        id="modal-new-session"
        ref="modalConfirm"
        heading="Start new session?"
        :confirm-callback="newSession">

      <p>
        Starting a new session will archive the current history and reset the
        state to defaults. You will be able to view it through the 'show sessions'
        dialog, but will need to copy it to a new session to alter it.
      </p>
      <p>Are you sure?</p>

    </modal-confirm>

    <modal-confirm
        id="modal-fork-session"
        ref="modalFork"
        heading="Fork session?"
        :confirm-callback="forkSession">

      <p>
        Forking a session will archive the current history and populate the state with
        the newly forked history. You will be able to view your current state through
        the 'show sessions' dialog, but will need to fork it again to alter it further.
      </p>
      <p>Are you sure?</p>

    </modal-confirm>

    <modal-sessions
        ref="modalSessions"
        @fork="$refs.modalFork.open($event)"
        @view="viewSession($event)"
        @return="cancelViewSession()"/>
  </div>
</template>
<script>
import HistoryRow from "@/components/tabs/HistoryRow";
import ModalSessions from "@/components/modals/ModalSessions";
import ModalConfirm from "@/components/modals/ModalConfirm";

export default {
    name: 'TabHistory',
    components: {
        ModalConfirm,
        ModalSessions,
        HistoryRow
    },
    computed: {
        history() {
            return this.$store.state.history
        },

        readonly() {
            return this.$store.state.readonly
        }
    },
    methods: {
        showSessionsDialog() {
            this.$refs.modalSessions.open()
        },

        showNewSessionConfirm() {
            this.$refs.modalConfirm.open()
        },

        // Create new session– Used as a callback by modalConfirm
        // and then reset the state to it
        newSession() {
            this.$store.dispatch('newSession')
            this.$store.dispatch('resetState')
        },

        forkSession(index) {
          this.$store.commit('clearMessages')
          this.$store.dispatch('forkSession', index)
        },

        // View session. Called on event `view` from modalSessions
        viewSession(event) {
            this.$store.commit('clearMessages')
            this.$store.dispatch('viewSession', event)
        },

        cancelViewSession() {
          this.$store.commit('clearMessages')
          this.$store.dispatch('cancelViewSession')
          this.$refs.modalSessions.close()
        }
    }
}
</script>
<style>
a.overrun.btn {
  margin-right: -12px;
}
</style>