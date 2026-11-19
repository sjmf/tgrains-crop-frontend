<template>
  <div id="comments" class="container">
    <div class="row">
      <div class="col s12">
        <span id="comment-head" class="comment-header grey-text text-darken-2">Comments</span>
        <a @click="toggleAddComment"
              class="btn tooltipped right waves-effect waves-light green darken-2"
              data-position="left" data-tooltip="Add Comment">
          <i class="material-icons right">add</i>Add Comment
        </a>
        <span> </span>
        <a @click="toggleFilter"
            class="btn tooltipped right waves-effect waves-light blue darken-2"
            data-position="left" data-tooltip="Show Filtering Options">
          <i class="material-icons right">filter_list</i>Sort/Filter
        </a>
        <div class="divider grey"></div>
      </div>
    </div>

    <!-- Add comment form -->
    <transition name="fade">
      <div class="col s12" v-show="show_add_comment">
        <comment-add
            v-bind:reply_id="reply_id"
            v-on:cancelReply="reply_id=null"
            v-on:closeForm="toggleAddComment"/>
      </div>
    </transition>

    <!-- Filtering Options -->
    <transition name="fade">
      <div class="col s12 m10 l8 offset-m1 offset-l2" v-show="show_filter_comment">
        <comment-filter @loadComments="loadComments()"/>
      </div>
    </transition>

    <div class="col s12 m10 l8 offset-m1 offset-l2">

      <!-- Pagination -->
      <pagination v-if="comments.length" @changePage="changePage"/>

      <!-- Comment cards -->

      <transition-group name="fade">
        <comment-card
          v-for="(comment, index) in comments"
          v-bind:key="index"
          v-bind:id="comment.id"
          v-bind:landscape_id="comment.landscape_id"
          v-bind:hash="comment.hash"
          v-bind:reply_id="comment.reply_id"
          v-bind:reply="comment.reply"
          v-bind:author="comment.author"
          v-bind:user_id="comment.user_id"
          v-bind:text="comment.text"
          v-bind:tags="comment.tags"
          v-bind:session="comment.session"
          v-bind:state_index="comment.state_index"
          v-bind:session_id="comment.session_id"
          v-bind:timestamp="comment.timestamp"
          v-bind:distance="comment.distance"
          @replyToComment="doReply"
          @filterUser="$store.commit('filterUser', $event); showFilter()"
          @filterReply="$store.commit('filterReply', $event); showFilter()"
          @filterTag="$store.commit('filterTag', $event); showFilter()"
          @load="$emit('load')"/>
      </transition-group>
      <!-- Pagination -->
      <pagination v-if="comments.length" @changePage="changePage"/>
    </div>

    <div class="col s8 offset-s2 card" v-if="!comments.length">
      <div class="card-content">
        <p>There are no comments yet to show! <a href="#" @click="toggleAddComment">Leave a comment for us?</a></p>
      </div>
    </div>
  </div>
</template>
<script>
import CommentAdd from "@/components/comments/CommentAdd.vue"
import CommentCard from "@/components/comments/CommentCard.vue";
import CommentFilter from "@/components/comments/CommentFilter.vue";
import Pagination from "@/components/comments/Pagination.vue";

export default {
  name: 'ContainerComments',
  emits: ['load'],
  components: {
    Pagination,
    CommentCard,
    CommentAdd,
    CommentFilter
  },
  data() {
    return {
      show_add_comment: false,
      show_filter_comment: false,
      reply_id: undefined,
      state_id: undefined,
      timer: undefined
    }
  },
  computed: {
    comments() {
      return this.$store.state.comments.comments;
    }
  },
  methods: {
    doReply(event) {
      this.show_add_comment = true
      this.reply_id = event.id
    },
    toggleAddComment() {
      this.show_add_comment = !this.show_add_comment
    },
    toggleFilter() {
      this.show_filter_comment = !this.show_filter_comment
    },
    showFilter() {
      this.show_filter_comment = true
    },
    attachState(index) {
      this.show_add_comment = true
      this.state_id = index
    },
    changePage(page){
      this.$store.commit('setCommentsPage', page)
      this.loadComments()
    },
    async loadComments() {
      await this.$store.dispatch("loadComments")

      if(this.timer) clearTimeout(this.timer)

      // Call loadComments again in 60 seconds (+ up to 10 seconds random)
      this.timer = setTimeout(() => {
        this.loadComments()
      }, 60000 + Math.floor(Math.random() * 1000))
    }
  },
  async mounted() {
    // Keep this on nextTick for edge case re-loading store defaults
    this.$nextTick(async () => {
      // Load tags if not already loaded
      if (this.$store.state.tags.tags.length === 0)
        await this.$store.dispatch("loadTags")

      await this.loadComments()
    })
  },
}
</script>
<style scoped>
.comment-header {
  font-size: 2rem;
}
.btn {
  margin-left: 8px;
}
</style>