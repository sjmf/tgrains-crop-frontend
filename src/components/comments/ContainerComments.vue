<template>
  <div id="comments" class="container">
    <div class="row">
      <div class="col s11">
        <span id="comment-head" class="comment-header grey-text text-darken-2">Comments</span>
        <div class="divider grey"></div>
      </div>

      <div class="col s1">
        <span @click="toggleAddComment"
              class="btn-floating btn-large tooltipped right waves-effect waves-light green darken-2"
              data-position="left" data-tooltip="Add Comment">
          <i class="material-icons">add</i>
        </span>
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

    <!-- Pagination -->
    <pagination v-if="comments.length"/>

    <!-- Comment cards -->
    <div class="col s12 m10 l8 offset-m1 offset-l2">

      <comment-card
          v-for="(comment, index) in comments"
          v-bind:key="index"
          v-bind:id="comment.id"
          v-bind:hash="comment.hash"
          v-bind:reply_id="comment.reply_id"
          v-bind:reply="comment.reply"
          v-bind:author="comment.author"
          v-bind:text="comment.text"
          v-bind:tags="comment.tags"
          v-bind:state="comment.state"
          v-bind:timestamp="comment.timestamp"
          @replyToComment="doReply"
          @load="$emit('load')"/>

    </div>

    <!-- Pagination -->
    <pagination v-if="comments.length"/>

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
import Pagination from "@/components/comments/Pagination";

export default {
    name: 'ContainerComments',
    components: {
        Pagination,
        CommentCard,
        CommentAdd
    },
    async mounted() {
        // Keep this on nextTick for edge case re-loading store defaults
        this.$nextTick(async () => {
            // Load tags if not already loaded
            if (this.$store.state.tags.tags.length === 0)
                await this.$store.dispatch("loadTags")

            await this.$store.dispatch("loadComments")
        })
    },
    data() {
        return {
            show_add_comment: false,
            reply_id: undefined,
            state_id: undefined
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
        attachState(index) {
            this.show_add_comment = true
            this.state_id = index
        }
    },
    computed: {
        comments() {
            return this.$store.state.comments.comments;
        }
    }
}
</script>
<style scoped>
.comment-header {
  font-size: 2rem;
}
</style>