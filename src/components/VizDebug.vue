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
    max-height: 40vh;
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