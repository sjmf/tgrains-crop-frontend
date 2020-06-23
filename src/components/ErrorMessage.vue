<template>
  <div class="col s12 white" id="errContainer" v-bind:class="{isVisible: visible}">
    <div class="container">
      <div class="card-panel red white-text lighten-1" id="errorMsg" v-bind:class="{isVisible: visible}">
        <span><strong>Whoops! An error occurred:</strong> {{message}}</span>
        <i id="closeBtn" class="close material-icons right" v-on:click="closeMsg()">close</i>
      </div>
    </div>
  </div>
</template>
<script>
    import store from '../store';

    export default {
        name: 'error-message',
        computed: {
            message() {
                return store.state.error.message
            },
            visible() {
                return store.state.error.visible
            }
        },
        methods: {
            closeMsg() {
                store.commit("closeError")
            }
        }
    }
</script>
<style scoped>
    div#errContainer {
      max-height:0;
      transition: max-height .25s ease-out;
    }
    div#errContainer.isVisible {
      max-height: 1200px;
      transition: max-height .25s ease-in;
    }
    div#errorMsg {
      visibility: hidden;
      opacity: 0;
      transition: opacity .25s ease-out, visibility .25s ease-out;
    }
    div#errorMsg.isVisible {
      visibility: visible;
      opacity: 1;
      transition: opacity .25s ease-in, visibility .25s ease-in;
    }
    i#closeBtn{
      cursor: pointer;
      transform:scale(1);
      transition: all .25s linear;
    }
    i#closeBtn:hover {
      text-shadow: 0px 0px 15px #8ad8ff;
      transform:scale(1.5);
      transition: all .25s linear;
    }
</style>