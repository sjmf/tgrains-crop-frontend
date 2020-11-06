<template>
  <div id="modal-sessions" class="modal">
    <div class="modal-content">
      <h4>Sessions</h4>

      <div class="row">
        <div class="col s4"><strong>Time / Date</strong></div>
        <div class="col s4"><strong>Number of States</strong></div>
      </div>

      <div v-for="(s, i) in sessions.slice().reverse()"
           :key="s.id">

        <div class="row no-margin" v-if="i>0">
          <div class="divider col s12"></div>
        </div>

        <div class="row pad" :class="{'green lighten-4': i===0}">
          <div class="col s4">
            <em>{{s.opened | moment}}</em>
          </div>
          <div class="col s4">
            <span>{{s.count}}</span>
          </div>
          <div class="col s4">
            <a v-if="i>0"
                class="btn btn-small btn-flat waves-effect waves-purple deep-purple white-text right">
              <i class="material-icons right">forward</i>
              Load
            </a>
            <span v-else>Current Session</span>
          </div>
        </div>

      </div>

    </div>
    <div class="modal-footer">
      <a class="modal-close waves-effect waves-green btn-flat green darken-2 white-text">
        Close
      </a>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "ModalSessions",
  filters: {
    moment: function (date) {
      return moment(date).format('HH:mm:ss, Do MMM YYYY');
    }
  },
  data() {
    return {
      id: 'modal-sessions'
    }
  },
  computed: {
    domNode() {
      return document.querySelector('#' + this.id)
    },
    sessions() {
      return this.$store.state.sessions
    }
  },
  methods: {
    instance() {
      return this.$_M.Modal.getInstance(this.domNode)
    },
    open() {
      // Instantiate if undefined. Helps with hot-reloading, but isn't required in production
      if (this.instance() === undefined)
        this.$_M.Modal.init(this.domNode)

      this.instance().open();
    }
  }
}
</script>

<style scoped>
div.modal-content {
  overflow-y:scroll;
}
div.row.no-margin {
  margin: 0;
}
div.row.pad {
  padding: 10px 5px;
  line-height: 32.4px;
}
</style>