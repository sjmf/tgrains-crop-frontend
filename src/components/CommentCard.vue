<template>
  <div class="comment-card card-panel grey lighten-5 z-depth-1">
    <div class="comment-main row">
      <div class="col s3 m2">
        <Jdenticon v-bind:value="this.hash" v-bind:size="80" alt="avatar"/>
      </div>

      <div class="col s9 m10">
        <div class="row">
          <div class="col s12 m6">
            <span class="username green-text text-darken-2">
              {{ author }}
            </span>
          </div>

          <div class="col s12 m6 right-align">
            <span class="timestamp grey-text">
              {{ timestamp | format_datetime }}
            </span>

            <span class="reply" v-if="!reply_view">
              <a href="#add-comment"
                 @click="$emit('replyToComment', {id})">
                <i class="material-icons">reply</i> Reply
              </a>
            </span>
          </div>

        </div>

        <div class="row comment-text">
          <div class="col s12">
            <span class="black-text">
              <!-- Never use v-html here. If someone compromises the database, XSS becomes possible -->
              {{ text | decode }}
            </span>
          </div>
        </div>

        <!-- TAGS -->
        <div class="row" v-if="!reply_view && tags.length">
          <div class="col s12">
            <div class="row">
              <div class="col s2">
                <span class="grey-text">Tags:</span>
              </div>
              <div class="col s10">
            <span v-for="t in tags"
                  v-bind:key="t"
                  v-bind:class="tag_group(tag_meta(t).group).colour"
                  v-bind:data-badge-caption="tag_meta(t).name"
                  class="new badge tag"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Compare buttons -->
        <div class="row compare-buttons" v-if="state">
          <div class="col s12">
            <a>
              <i class="material-icons">insert_chart</i> Compare
            </a>
            <a @click="set_state">
              <i class="material-icons">play_arrow</i> Load
            </a>
          </div>
        </div>
      </div>
    </div>


    <div class="row" v-if="reply_id">
      <div class="col s12">
        <p class="grey-text small">
          This comment is a reply: <a v-if="!replyCard" @click="load_reply(reply_id)">(load reply)</a>
        </p>
        <comment-card
            v-if="replyCard"
            v-bind:id="replyCard.id"
            v-bind:hash="replyCard.hash"
            v-bind:reply_id="replyCard.reply_id"
            v-bind:author="replyCard.author"
            v-bind:text="replyCard.text"
            v-bind:tags="replyCard.tags"
            v-bind:timestamp="replyCard.timestamp"
            v-bind:reply_view="true" />
      </div>
    </div>
  </div>
</template>

<script>
import Jdenticon from '@/components/Jdenticon.vue'

export default {
  name: 'comment-card',
  components: {
    Jdenticon
  },
  props: {
      id: Number,
      reply_id: Number,
      reply: [Object, undefined],
      author: String,
      hash: String,
      text: String,
      timestamp: Number,
      tags: Array,
      state: [Object, undefined],
      reply_view: Boolean
  },
  data() {
    return {
      loadedReply: undefined
    }
  },
  computed: {
    replyCard() {
      return this.reply || this.loadedReply
    }
  },
  methods: {
    tag_meta(id) {
      return this.$store.state.tags.tags[id-1]
    },
    tag_group(id) {
      return this.$store.state.tag_groups[id]
    },
    async load_reply(reply_id) {
      this.loadedReply = await this.$store.dispatch('loadReply', reply_id)
      console.log(this.loadedReply)
    },
    set_state(){
      // Save state before we do anything
      this.$store.commit("saveState")

      // Overwrite state
      this.$store.commit("updateLandscape", this.state.inputs)
      this.$store.commit("setDataFromQuery", this.state.outputs)
      this.$store.commit("setTotalArea", this.state.totalArea)

      // Tell the user what we've done!
      this.$store.commit('setMessage', {
        message: "Loaded model state from comment by " + this.author,
        kind: "info",
        callback: () => {this.$store.commit("restoreState")},
        callbackText: "Click here to restore previous state"
      }) // Will also scroll viewport to top
    }
  },
  filters: {
      format_datetime(unix_timestamp) {
          let d = new Date(unix_timestamp * 1000)
          return d.toLocaleDateString("en-GB") + " " + d.toLocaleTimeString("en-GB")
      },
      decode(html) {
          let txt = document.createElement("textarea");
          txt.innerHTML = html;
          return txt.value;
      }
  }
}
</script>

<style scoped>
span.tag.badge.new[data-badge-caption] {
  margin: 2px 0 0 14px;
  float: left;
}
span.reply, .compare-buttons a {
  padding: 0 0 0 10px;
  cursor: pointer;
}
p.small {
  font-size: 0.85rem;
}
span.reply a:hover, .compare-buttons a:hover {
  filter: brightness(75%);
}

a i.material-icons {
  height: 18px;
  width: 18px;
  font-size: 18px;
  line-height: 14px;
  vertical-align: middle;
}

.compare-buttons div {
  text-align: right;
}

.comment-card a.btn {
  display: inline-block;
  min-width: 40px;
  min-height: 40px;
}

.comment-card,
.comment-card div.row:last-child,
.comment-form div.col:last-child p,
.comment-main:not(:last-child){
  margin-bottom: 0;
}
</style>