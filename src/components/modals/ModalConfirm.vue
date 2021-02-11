<template>
  <div :id="id" class="modal">
    <div class="modal-content">
      <h4>{{ heading }}</h4>
      <slot></slot>
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
import ModalMixin from "./modalMixin"

export default {
  name: 'modal-confirm',
  mixins: [ModalMixin],
  props: {
    heading: String,
    cancelCallback: Function,
    confirmCallback: Function,
  },
  data: () => ({
    params: undefined
  }),
  methods: {
    callback(callbackFn) {
      if(typeof(callbackFn) === "function") {
        callbackFn(this.params)
      } else {
        console.warn("No callback function defined!")
      }
    },
    open(params) {
      // Open params are treated as the argument for the callback function. Store them for later use.
      this.params = params

      // Instantiate if undefined.
      if (this.instance() === undefined) {
        this.$_M.Modal.init(this.domNode)
      }
      this.instance().open()
    },
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
