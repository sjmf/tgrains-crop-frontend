<template>
  <div id="modal-sessions" class="modal">
    <div class="modal-content">
      <h4>My Sessions for {{$store.state.landscapeNames[$store.state.landscape_id]}}</h4>

      <div class="row">
        <div class="col s4"><strong>Time / Date</strong></div>
        <div class="col s4"><strong>Number of States</strong></div>
        <div class="col s4 align-right"><strong>Actions</strong></div>
      </div>

      <div v-for="(s, i) in sessions.slice().reverse()"
           :key="s.id">

        <div class="row no-margin" v-if="i>0">
          <div class="divider col s12"></div>
        </div>

        <div class="row pad" :class="{'green lighten-4': i===index}">
          <div class="col s4">
            <em>{{s.opened | moment}}</em>
          </div>

          <div class="col s1">
            <span>{{s.count}}</span>
          </div>

          <div class="col s7">
            <span v-if="i > 0">
              <a class="btn pad btn-small btn-flat waves-effect waves-purple deep-purple white-text right"
                 @click="close(); $emit('view', {index: sessions.length -1 -i, time: $options.filters.moment(s.opened)})"> <!-- INDEXES ARE REVERSED!! -->
                <i class="material-icons right">live_tv</i>
                View
              </a>
            </span>

            <span v-if="i === 0 && index > 0">
              <a class="btn pad btn-small btn-flat waves-effect waves-green green darken-2 white-text right"
                  @click="$emit('return')">
                <i class="material-icons right">backspace</i>
                Return
              </a>
            </span>

            <a class="btn btn-small btn-flat waves-effect waves-blue blue darken-2 white-text right"
               @click="close(); $emit('fork', sessions.length -1 -i)">
              <i class="material-icons right">call_split</i>
              Fork
            </a>

            <span v-if="i === 0">Current Session</span>
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
      id: 'modal-sessions',
      sessionToFork: 0,
    }
  },
  computed: {
    domNode() {
      return document.querySelector('#' + this.id)
    },
    sessions() {
      return this.$store.state.sessions[this.$store.state.landscape_id]
    },
    index() {
      return this.$store.state.sessions[this.$store.state.landscape_id].length - this.$store.state.sessionIndex - 1
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
div.row.no-margin {
  margin: 0;
}
div.row.pad {
  padding: 10px 5px;
  line-height: 32.4px;
  margin-bottom: 0;
}
div.align-right {
  text-align: right;
}
</style>