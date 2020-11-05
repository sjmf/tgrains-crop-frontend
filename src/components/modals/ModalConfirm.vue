<template>
  <div v-bind:id="id" class="modal">
    <div class="modal-content">
      <h4>{{ heading }}</h4>
      <div v-html="text"></div>
    </div>
    <div class="modal-footer">
      <a @click="callback(cancelCallback)" class="modal-close waves-effect waves-red btn-flat">
        Cancel
      </a>
      <a @click="callback(confirmCallback)" class="modal-close waves-effect waves-green btn-flat green darken-2 white-text">
        OK
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'modal-confirm',
  props: {
    id: String,
    heading: String,
    text: String,
    cancelCallback: Function,
    confirmCallback: Function,
  },
  computed: {
    domNode() {
      return document.querySelector('#' + this.id)
    }
  },
  methods: {
    callback(callbackFn) {
      if(typeof(callbackFn) === "function") {
        callbackFn()
      } else {
        console.warn("No callback function defined!")
      }
    },
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
    padding-bottom: 0;
  }
  /* Scoped styles don't apply to v-html injections, so use >>> */
  /* https://github.com/vuejs/vue-loader/issues/749 */
  div.modal-content >>> p:last-child {
    margin-bottom: 0;
  }
</style>
