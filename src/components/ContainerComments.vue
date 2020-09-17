<template>
  <div id="comments" class="container">
    <div class="col s11">
      <span class="comment-header grey-text text-darken-2">Comments</span>
      <div class="divider grey"></div>

    </div>
    <div class="col s1">
      <a href="#modal-add-comment"
         class="modal-trigger btn-floating btn-large tooltipped right waves-effect waves-light green darken-2"
         data-position="left" data-tooltip="Add Comment">
        <i class="material-icons">add</i>
      </a>
    </div>

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

    <div class="col s12 m10 offset-m1 l8 offset-l2">

      <comment-card
          v-for="(comment, index) in comments"
          v-bind:key="index"
          v-bind:id="comment.id"
          v-bind:hash="comment.hash"
          v-bind:reply_id="comment.reply_id"
          v-bind:author="comment.author"
          v-bind:text="comment.text"
          v-bind:tags="comment.tags"
          v-bind:timestamp="comment.timestamp"/>

    </div>
    <!-- end comments -->

    <!-- Modal Trigger -->

    <!-- Modal Structure -->
    <modal-comments/>

  </div>
</template>
<script>
import ModalComments from "@/components/ModalAddComment"
import CommentCard from "@/components/CommentCard";

export default {
        name: 'ContainerComments',
        components: {CommentCard, ModalComments},
        mounted() {
            this.$store.dispatch('loadComments')
        },
        methods: {
            set_page(page) {
                if(page !== this.current_page && page > 0 && page <= this.total_pages) {
                    this.$store.commit('setCommentsPage', page)
                    this.$store.dispatch('loadComments')
                }
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