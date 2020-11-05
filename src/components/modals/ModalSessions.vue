<template>
  <div id="modal-sessions" class="modal">
    <div class="modal-content">
      <h4>Sessions</h4>

      <div class="row">
        <div class="col s4"><strong>Time / Date</strong></div>
        <div class="col s4"><strong>Number of States</strong></div>
      </div>

      <div v-for="s in sessions"
           :key="s.id">

        <div class="row">
          <div class="divider col s12"></div>
        </div>

        <div class="row">
          <div class="col s4">
            <em>{{s.opened}}</em>
          </div>
          <div class="col s4">
            <span>{{s.states}}</span>
          </div>
          <div class="col s4">
            <a class="btn btn-small btn-flat waves-effect waves-purple deep-purple white-text right">
              <i class="material-icons right">forward</i>
              Load
            </a>
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
export default {
  name: "ModalSessions",
  data() {
    return {
      id: 'modal-sessions',
      sessions: [
        {id: 'a1fe', states: 10, opened: '17:16:27, 5th Nov 2020'},
        {id: '2faa', states: 4, opened: '15:50:43, 4th Nov 2020'},
        {id: '335f', states: 17, opened: '10:32:21, 2nd Nov 2020'},
        {id: '4a5b', states: 83, opened: '12:00:01, 1st Nov 2020'}
      ]
    }
  },
  computed: {
    domNode() {
      return document.querySelector('#' + this.id)
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
</style>