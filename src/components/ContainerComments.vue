<template>
  <div id="comments" class="container">
    <div class="row">
      <div class="col s11">
        <span class="comment-header grey-text text-darken-2">Comments</span>
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
      <div class="col s12" v-show="show_addcomment">
        <comment-add v-on:formReset="toggleAddComment"/>
      </div>
    </transition>

    <!-- Pagination -->
    <div class="col s12 m6 offset-m4">
      <ul class="pagination">
        <li v-bind:class="[current_page <= 1 ? 'disabled' : 'waves-effect']"
            @click="set_page(current_page - 1)">
          <a href="#!"><i class="material-icons">chevron_left</i></a>
        </li>

        <li v-for="n in total_pages"
            v-bind:key="n"
            v-bind:class="[current_page === n ? 'active' : 'waves-effect']"
            @click="set_page(n)">
          <a href="#!">{{ n }}</a>
        </li>

        <li v-bind:class="[current_page >= total_pages ? 'disabled' : 'waves-effect']"
            @click="set_page(current_page + 1)">
          <a href="#!"><i class="material-icons">chevron_right</i></a>
        </li>
      </ul>
    </div>

    <!-- Comment cards -->
    <div class="col s12 m10 l8 offset-m1 offset-l2">

      <comment-card
          v-for="(comment, index) in comments"
          v-bind:key="index"
          v-bind:id="comment.id"
          v-bind:hash="comment.hash"
          v-bind:reply_id="comment.reply_id"
          v-bind:author="comment.author"
          v-bind:text="comment.text"
          v-bind:tags="comment.tags"
          v-bind:timestamp="comment.timestamp"
          v-on:replyToComment="toggleAddComment"/> <!-- TODO: Set reply ID -->

    </div>
  </div>
</template>
<script>
import CommentAdd from "@/components/CommentAdd"
import CommentCard from "@/components/CommentCard";

export default {
        name: 'ContainerComments',
        components: {CommentCard, CommentAdd},
        mounted() {
            this.$store.dispatch('loadComments')
        },
        data() {
          return {
            show_addcomment: false,
          }
        },
        methods: {
            set_page(page) {
                if(page !== this.current_page && page > 0 && page <= this.total_pages) {
                    this.$store.commit('setCommentsPage', page)
                    this.$store.dispatch('loadComments')
                }
            },
            toggleAddComment () {
              this.show_addcomment = !this.show_addcomment
            }
        },
        computed: {
            comments() {
                return this.$store.state.comments.comments;
            },
            current_page() {
                return this.$store.state.comments.page
            },
            total_pages(){
                return Math.floor((this.$store.state.comments.length-1) / this.$store.state.comments.size) +1
            }
        }
    }
</script>
<style>
/* https://css-tricks.com/using-css-transitions-auto-dimensions/ */
.fade-enter-active, .fade-leave-active {
  transition: all .5s ease;
  max-height:1000px;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  max-height:0;
  overflow-y:hidden;
}
.fade-enter-to {
  overflow-y:hidden;
}
</style>