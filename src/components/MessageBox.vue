<template>
  <div class="container">
    <div class="card-panel" v-bind:class="this.colour()" id="message">
      <span><strong>{{ this.heading() }}</strong> {{message}}</span>
      <i id="closeBtn" class="close material-icons right" v-on:click="closeMsg()">close</i>
    </div>
  </div>
</template>
<script>
    import store from '../store';

    export default {
        name: 'MessageBox',
        props: {
          message: String,
          kind: String,
          index: Number
        },
        methods: {
            closeMsg() {
                store.commit("closeMessage", this.index)
            },
            colour() {
              if(this.kind==='error')   return 'red   lighten-4'
              if(this.kind==='warning') return 'amber lighten-4'
              if(this.kind==='info')    return 'blue  lighten-4'
              if(this.kind==='success') return 'green lighten-4'
            },
          heading() {
              if(this.kind==='error')   return "Whoops! An error occurred:"
              if(this.kind==='warning') return "Warning:"
              if(this.kind==='info')    return "Information:"
              if(this.kind==='success') return "Success!"
          }
        },
      mounted() {
          console.info('Mounted', this.kind)
      }
    }
</script>
<style scoped>
    i#closeBtn{
      cursor: pointer;
      transform:scale(1);
      transition: all .25s linear;
    }
    i#closeBtn:hover {
      text-shadow: 0 0 15px #8ad8ff;
      transform:scale(1.5);
      transition: all .25s linear;
    }
</style>