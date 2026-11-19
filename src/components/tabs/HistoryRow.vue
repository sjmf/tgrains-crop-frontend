<template>
  <div v-if="!deleted"
      class="history-card card panel"
      v-bind:class="[index === historyIndex ? 'green lighten-4' : 'grey lighten-3']">
    <div class="card-content">
      <div class="row">
        <div class="col s4">
          <strong>{{index +1}}.</strong>&nbsp;
          <i v-if="index === historyIndex" class="tiny material-icons">live_tv</i>
          <i v-else class="tiny material-icons">timer</i>
          <span class="datetime"> {{ formatTime(time) }}</span>
        </div>

        <div class="col s5">
          <tag v-for="t of tags"
               v-bind:key="t"
               :name="tag_meta(t).name"
               :colour="tag_colour(t)"
               :value="null"></tag>
        </div>

        <div v-if="trashView" class="col s3">
          <a class="btn right btn-small btn-flat green darken-2 waves-effect waves-green"
             @click="undeleteState()">
            <i class="material-icons right">undo</i>Restore
          </a>
        </div>

        <template v-else>
        <!-- NB: using v-show here as v-if seems to replace the component too soon,
                 triggering the anchor for #comment-head when load clicked... :/ -->
        <div class="col s3" v-show="index === historyIndex">
          <a href="#comment-head"
             class="btn green right btn-small btn-flat waves-effect waves-green nobr"
             @click.prevent="scrollToComments(); $emit('comment')">
            <i class="material-icons right">comment</i>Comment
          </a>
        </div>

        <div class="col s3" v-show="index !== historyIndex">
          <a class="btn right btn-small btn-flat deep-purple waves-effect waves-purple nobr"
             @click="loadState()">
            <i class="material-icons right">forward</i>Load
          </a>

          <a class="btn red right btn-small btn-flat waves-effect waves-red" :class="{'disabled': readonly}"
             @click="deleteState()">
            <i class="material-icons">delete</i>
          </a>
        </div>
        </template>

      </div>
    </div>
  </div>
</template>

<script>
import Tag from "@/components/comments/Tag.vue";
import moment from 'moment';
export default {
  name: 'history-row',
  emits: ['comment', 'load'],
  components: {
    Tag
  },
  props: {
    index: Number,
    length: Number,
    time: Number,
    tags: Array,
    deleted: Boolean,
    trashView: Boolean,
  },
  computed: {
    historyIndex() {
      return this.$store.state.historyIndex
    },
    readonly() {
      return this.$store.state.readonly
    }
  },
  methods: {
    formatTime(date) {
      return moment(date).format('HH:mm:ss, Do MMM YYYY');
    },
    scrollToComments() {
      document.getElementById('comment-head').scrollIntoView({ behavior: 'smooth' })
    },
    loadState() {
      // Load state from history and activate its tags
      this.$store.commit("loadFromHistory", {
        'history': this.$store.state.history,
        'index': this.index
      })
      this.$store.commit("activateTags", this.index)
      this.$emit('load', this.index);
    },
    deleteState() {
      this.$store.dispatch('setStateDeleted', {'index': this.index, 'deleted': true})
    },
    undeleteState() {
      this.$store.dispatch('setStateDeleted', {'index': this.index, 'deleted': false})
    },
    tag_meta(id) {
      return this.$store.state.tags.tags[id]
    },
    tag_group(id) {
      return this.$store.state.tag_groups[id]
    },
    tag_colour(id) {
      return this.tag_group(this.tag_meta(id).group).colour
    }
  }
}
</script>

<style scoped>
.card .card-content {
  padding: 10px;
}
a.btn {
  margin: 0 2px;
}
.card-content div.row:last-child {
  margin-bottom: 0;
}
.card.history-card .card-content  {
  padding: 10px 10px 10px 15px;
}
.card.history-card .col {
  line-height:2rem;
}
.btn-flat {
  color: #fff;
}
.datetime {
  font-style: italic;
  margin-left:.5rem;
}
.nobr { white-space: nowrap }
</style>