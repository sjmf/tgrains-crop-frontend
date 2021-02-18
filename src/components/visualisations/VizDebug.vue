<template>
  <div class="container">
    <div class="col s12">
      <a class="right smalltext" @click="showDebug = !showDebug">Show technical information</a>
    </div>
    <div class="col s12" v-if="showDebug">
      <div class="card panel">
        <div class="card-content">
          <span class="card-title">Technical Information</span>
          <div class="">
            <span>To <strong>revoke your consent for this session</strong>, please provide the facilitator with the following user ID:</span>
            <pre>{{user_id}}</pre>
          </div>

          <div>Full debugging information <a @click="copyDebug()">(copy to clipboard)</a>:</div>
          <div class="debug-info-panel">
            <pre>{{debug}}</pre>
          </div>
          <br/>
          <div class="row">
            <div class="col s6 right">
              <a class="btn red" @click="reload_store">Reload data store from defaults</a>
            </div>
            <div class="col s3">
              <a class="btn red" @click="setMessage('error')">Raise Error</a>
              <a class="btn blue" @click="setMessage('info')">Raise Info</a>
              <a class="btn amber" @click="setMessage('warning')">Raise Warning</a>
              <a class="btn green" @click="setMessage('success')">Raise Success</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'viz-debug',
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
      setMessage(kind) {
        this.$store.commit('setMessage', {
          message: 'Testing ' + kind,
          kind: kind,
          // timeout: 5000,
          callbacks: [
              () => {console.log('Successful callback!')}
          ],
          callbackInnerHTML: [
              "<span class='btn btn-small btn-flat white-text red waves-red waves-effect'>Testing!</span>"
          ]
        })
      },
      copyDebug() {
        navigator.clipboard.writeText(this.debug)
      }
    },
    computed: {
      debug() {
        return JSON.stringify(this.$store.state, null, 2).trim()
      },
      user_id() {
        return this.$store.state.user.id
      }
    }
  }
</script>

<style scoped>
  a:hover {
    cursor: pointer;
  }
  .btn {
    width: 100%;
  }
  .debug-info-panel {
    font-family: 'Ubuntu', 'Consolas', 'Courier New', monospace;
    font-size: .8em;
    max-height: 300px;
    overflow-y: scroll;
    line-height: 1.5em;

    border: 1px solid #999;
    border-left: 12px solid #1B5E20;
  }
  .debug-info-panel pre {
    white-space: pre-wrap;       /* Since CSS 2.1 */
    white-space: -moz-pre-wrap;  /* Mozilla, since 1999 */
    white-space: -o-pre-wrap;    /* Opera 7 */
    word-wrap: break-word;       /* Internet Explorer 5.5+ */

    /* https://stackoverflow.com/questions/5840328 */
    background: #eee;
    background-image: -webkit-linear-gradient(#fafafa 50%, #e4efe4 50%);
    background-image:    -moz-linear-gradient(#fafafa 50%, #e4efe4 50%);
    background-image:     -ms-linear-gradient(#fafafa 50%, #e4efe4 50%);
    background-image:      -o-linear-gradient(#fafafa 50%, #e4efe4 50%);
    background-image:         linear-gradient(#fafafa 50%, #e4efe4 50%);
    background-position: 0 0;
    background-repeat: repeat;
    background-size: 3em 3em;
  }
  .smalltext {
    font-size:0.8rem;
    color: #9e9e9e;
    text-decoration: underline;
  }
</style>