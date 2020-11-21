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
        <a @click="toggleFilterComment"
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
            v-on="$listeners"
            v-on:cancelReply="reply_id=null"
            v-on:closeForm="toggleAddComment"/>
      </div>
    </transition>

    <!-- Filtering Options -->
    <transition name="fade">
      <div class="col s12 m10 l8 offset-m1 offset-l2" v-show="show_filter_comment">
        <comment-filter ref="commentFilter"
                        :user_name="filter_opts.user_name"
                        :user_id="filter_opts.user_id"
                        :reply_card="filter_opts.reply_card"
                        :tags="filter_opts.tags"
                        @filterUser="filterUser"
                        @clearFilter="filterUser(default_opts)"
                        @removeTag="removeTag"/>
      </div>
    </transition>

    <div class="col s12 m10 l8 offset-m1 offset-l2">

      <!-- Pagination -->
      <pagination v-if="comments.length" @changePage="changePage"/>

      <!-- Comment cards -->
      <comment-card
          v-for="(comment, index) in comments"
          v-bind:key="index"
          v-bind:id="comment.id"
          v-bind:hash="comment.hash"
          v-bind:reply_id="comment.reply_id"
          v-bind:reply="comment.reply"
          v-bind:author="comment.author"
          v-bind:user_id="comment.user_id"
          v-bind:text="comment.text"
          v-bind:tags="comment.tags"
          v-bind:state="comment.state"
          v-bind:timestamp="comment.timestamp"
          v-bind:distance="comment.distance"
          @replyToComment="doReply"
          @filterUser="filterUser"
          @filterReply="filterReply"
          @filterTag="filterTag"
          @load="$emit('load')"/>

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
import CommentAdd from "@/components/comments/CommentAdd"
import CommentCard from "@/components/comments/CommentCard";
import CommentFilter from "@/components/comments/CommentFilter";
import Pagination from "@/components/comments/Pagination";

export default {
  name: 'ContainerComments',
  components: {
    Pagination,
    CommentCard,
    CommentAdd,
    CommentFilter
  },
  data() {
    return {
      show_add_comment: false,
      show_filter_comment: true,
      reply_id: undefined,
      state_id: undefined,
      default_opts: {user_name: undefined, user_id: undefined, reply_card: undefined, tags: undefined},
      filter_opts:  {user_name: undefined, user_id: undefined, reply_card: undefined, tags: undefined},
    }
  },
  computed: {
    comments() {
      return this.$store.state.comments.comments;
    },
    scrollToFilterComment() {
      return this.show_add_comment ? '#comment-filter' : ''
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
    toggleFilterComment() {
      this.show_filter_comment = !this.show_filter_comment
    },
    attachState(index) {
      this.show_add_comment = true
      this.state_id = index
    },
    clearFilter() {
      this.filter_opts = Object.assign(this.filter_opts, this.default_opts);
    },
    filterUser(event) {
      this.clearFilter()
      this.filter_opts.user_id = event.user_id
      this.filter_opts.user_name = event.user_name
    },
    filterReply(event) {
      this.clearFilter()
      this.filter_opts.reply_card = event
    },
    filterTag(event) {
      let tags = (Array.isArray(this.filter_opts.tags)) ? this.filter_opts.tags.slice() : []
      this.clearFilter()

      tags.push(event)
      tags = [...new Set(tags)]
      this.filter_opts.tags = tags.slice().sort()
    },
    removeTag(event) {
      let index = this.filter_opts.tags.indexOf(event);
      if (index !== -1) {
        this.filter_opts.tags.splice(index, 1);
      }
    },
    changePage(page){
      this.$refs.commentFilter.changePage(page)
    }
  },
  async mounted() {
    // Keep this on nextTick for edge case re-loading store defaults
    this.$nextTick(async () => {
      // Load tags if not already loaded
      if (this.$store.state.tags.tags.length === 0)
        await this.$store.dispatch("loadTags")

      // Has side effect of loading comments, but includes payload for filter
      this.$refs.commentFilter.changePage(1)
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