<template>
  <div class="container">
    <div class="col s12">
      <a class="right smalltext" @click="showDebug = !showDebug">Toggle Debug information</a>
    </div>
    <div class="col s12" v-if="showDebug">
      <div class="card panel">
        <div class="card-content">
          <span class="card-title">Debug Information</span>
          <div class="debug-info-panel">
            <vue-code-highlight>
            {{debug}}
            </vue-code-highlight>
          </div>
          <br/>
          <div class="row">
            <div class="col s8">
              <a class="btn red" @click="reload_store">Reload data store from defaults</a>
            </div>
            <div class="col s4">
              <a class="btn red" @click="raiseError()">Raise Error</a>
              <a class="btn amber" @click="setMessage('warning')">Raise Warning</a>
              <a class="btn blue" @click="setMessage('info')">Raise Info</a>
              <a class="btn green" @click="setMessage('success')">Raise Success</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>// You have to extract the component from the module
    import { component as VueCodeHighlight } from 'vue-code-highlight';
    import 'vue-code-highlight/themes/prism-coy.css'

    export default {
        name: 'viz-debug',
        components: {
            VueCodeHighlight
        },
        data() {
            return {
                showDebug: false
            }
        },
        methods: {
            reload_store() {
                this.$store.commit('invalidateStore');
                window.location.reload(false);
            },
            raiseError() {
              this.$store.commit('raiseError', 'Testing')
            },
            setMessage(kind) {
              this.$store.commit('setMessage', {message: 'Testing ' + kind, kind:kind})
            }
        },
        computed: {
          debug() {
              return this.$store.state;
          }
        }
    }
</script>

<style scoped>
  .debug-info-panel {
    font-family: 'Ubuntu', 'Consolas', 'Courier New', monospace;
    font-size: .8em;
    max-height: 500px;
    overflow-y: scroll;
  }
  .debug-info-panel pre {
    white-space: pre-wrap;       /* Since CSS 2.1 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */
  }
  .smalltext {
    font-size:0.8rem;
    color: #9e9e9e;
    text-decoration: underline;
  }
</style>