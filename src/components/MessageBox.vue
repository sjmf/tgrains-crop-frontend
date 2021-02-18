<template>
  <div class="container">
    <div class="card-panel" v-bind:class="colour" id="message">
      <span>
        <i v-if="dismissible" id="closeBtn"
           class="close material-icons right"
           v-on:click="closeMsg()">
          close
        </i>
      </span>
      <span><strong>{{heading}}</strong></span>
      &nbsp;
      <span v-html="message"></span>

      <div v-if="callbacks" class="callbacks">
        <span v-for="(callback, i) in callbacks" :key="i">
          <a href="#" @click="callback(); closeMsg()" v-html="callbackInnerHTML[i]"></a>
        </span>
      </div>
    </div>
  </div>
</template>
<script>
  import store from '../store';

  export default {
    name: 'MessageBox',
    props: {
      title: String,
      message: [String, Error, Object],
      kind: {
        type:String,
        validator: (prop) => ['error', 'warning', 'info', 'success', 'default'].includes(prop),
        default: 'default'
      },
      callbacks: {
        type: Array,
        validator: (prop) => prop.every(e => typeof e === 'function')
      },
      callbackInnerHTML: {
        type: Array,
        validator: (prop) => prop.every(e => typeof e === 'string')
      },
      index: Number,
      dismissible: {default: true, type: Boolean},
      timeout: {default: 0, type: Number},
    },
    data() {
      return {
        timer: null
      }
    },
    methods: {
      closeMsg() {
        store.commit("closeMessage", this.index)
      },
    },
    computed: {
      colour() {
        if(this.kind==='error')   return 'red   lighten-4'
        if(this.kind==='warning') return 'amber lighten-4'
        if(this.kind==='info')    return 'blue  lighten-4'
        if(this.kind==='success') return 'green lighten-4'
        return 'grey lighten-4'
      },
      heading() {
        if(this.title!==undefined) return this.title + ':'
        if(this.kind==='error')    return "A problem occurred:"
        if(this.kind==='warning')  return "Warning:"
        if(this.kind==='info')     return "Information:"
        if(this.kind==='success')  return "Success!"
        return ""
      }
    },
    mounted() {
      if (this.timeout > 0) {
        console.info(`Message timeout: ${this.timeout}`)
        this.timer = setTimeout(()=>{
          this.closeMsg()
          clearTimeout(this.timer)
        }, this.timeout)
      }
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
  .callbacks {
    margin: 10px 0 0 0;
  }
  .callbacks span {
    margin: 0 5px 0 0;
  }
</style>