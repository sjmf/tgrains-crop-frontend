<template>
  <div v-bind:id="id" class="modal">
    <div class="modal-content">
      <h4>{{ heading }}</h4>
      <span v-html="text"></span>
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
  methods: {
    callback(callbackFn) {
      if(typeof(callbackFn) === "function") {
        callbackFn()
      } else {
        console.warn("No callback function defined!")
      }
    },
  }
}
</script>
