<template>
  <div class="comment-card card-panel grey lighten-5 z-depth-1">
    <div class="comment-main row">
      <div class="col s3 m2">
        <a href="#!"
           @click="!reply_view ? $emit('filterUser', {'user_id': user_id, 'user_name': author}) : null">
          <Jdenticon v-bind:value="this.hash" v-bind:size="80" alt="avatar"/>
        </a>
      </div>

      <div class="col s9 m10">
        <div class="row">
          <div class="col s12 m6">
            <span class="username">
              <a href="#!"
                 class="green-text text-darken-2"
                 @click="!reply_view ? $emit('filterUser', {'user_id': user_id, 'user_name': author}) : null">
                {{ author | decode }}
              </a>
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
                <tag v-for="t in tags"
                      :key="t"
                      :id="t"
                      :colour="tag_group(tag_meta(t).group).colour"
                      :name="tag_meta(t).name"
                      :value="null"
                      @filterTag="(tag_id) => $emit('filterTag', tag_id)">
                </tag>
              </div>
            </div>
          </div>
        </div>

        <!-- Compare buttons -->
        <div class="row" v-if="session">
          <div class="col s8">
            <span class="grey-text">Distance from {{ distance_text }}: {{ distance }} ha</span>
          </div>
          <div class="col s4 right compare-buttons">
<!--            <a><i class="material-icons">insert_chart</i> Compare </a>-->
            <a @click="set_state" :class="{'disabled': readonly}">
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
        <a href="#!" @click="$emit('filterReply', replyCard)">
          <comment-card
              v-if="replyCard"
              v-bind:id="replyCard.id"
              v-bind:hash="replyCard.hash"
              v-bind:reply_id="replyCard.reply_id"
              v-bind:author="replyCard.author"
              v-bind:user_id="replyCard.user_id"
              v-bind:text="replyCard.text"
              v-bind:tags="replyCard.tags"
              v-bind:timestamp="replyCard.timestamp"
              v-bind:reply_view="true"
              @filterUser="(user) => $emit('filterUser', user)"/>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Jdenticon from '@/components/comments/Jdenticon.vue'
import Tag from "@/components/comments/Tag";

export default {
  name: 'comment-card',
  components: {
    Jdenticon,
    Tag
  },
  props: {
      id: Number,
      reply_id: Number,
      reply: [Object, undefined],
      author: String,
      user_id: String,
      hash: String,
      text: String,
      timestamp: Number,
      tags: Array,
      landscape_id: Number,
      session: [Array, undefined],
      state_index: Number,
      session_id: String,
      reply_view: Boolean,
      distance: Number
  },
  data() {
    return {
      loadedReply: undefined
    }
  },
  computed: {
    replyCard() {
      return this.reply || this.loadedReply
    },
    readonly() {
      return this.$store.state.readonly
    },
    distance_text() {
      return this.$store.state.comments.sort === 3 ? 'current state' : 'BAU state'
    }
  },
  methods: {
    tag_meta(id) {
      return this.$store.state.tags.tags[id]
    },
    tag_group(id) {
      return this.$store.state.tag_groups[id]
    },
    async load_reply(reply_id) {
      this.loadedReply = await this.$store.dispatch('loadReply', reply_id)
    },
    async set_state(){
      // If readonly, don't apply the state
      if(this.readonly)
          return

      await this.$store.dispatch('loadSessionFromComment', {
        'session': this.session,
        'index': this.state_index,
        'tags': this.tags,
        'author': this.author
      })
      this.$emit('load')
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
.jdenticon:hover {
  cursor:pointer;
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

div.compare-buttons  {
  text-align: right;
}

.comment-card,
.comment-card div.row:last-child,
.comment-form div.col:last-child p,
.comment-main:not(:last-child){
  margin-bottom: 0;
}

a.disabled {
  color: rgba(0, 0, 0, 0.42);
}
</style>