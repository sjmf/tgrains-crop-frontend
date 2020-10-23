<template>
  <div class="history-card card panel"
      v-bind:class="[index === historyIndex ? 'green lighten-4' : 'grey lighten-3']">
    <div class="card-content">
      <div class="row">
        <div class="col s4">
          <strong>{{length - index}}.</strong>&nbsp;
          <i v-if="index === historyIndex" class="tiny material-icons">live_tv</i>
          <i v-else class="tiny material-icons">timer</i>
          <span class="datetime"> {{ time | moment }}</span>
        </div>

        <div class="col s5">
          <tag v-for="t in tags"
               v-bind:key="t"
               :name="tag_meta(t).name"
               :colour="tag_colour(t)"
               :value="null"></tag>
        </div>

        <!-- NB: using v-show here as v-if seems to replace the component too soon,
                 triggering the anchor for #comment-head when load clicked... :/ -->
        <div class="col s3" v-show="index === historyIndex">
          <a href="#comment-head" v-smooth-scroll
             class="btn green right btn-small btn-flat waves-effect waves-green nobr"
             @click="$emit('comment', index)">
            <i class="material-icons right">comment</i>Comment
          </a>
        </div>

        <div class="col s3" v-show="index !== historyIndex">
          <a class="btn right btn-small btn-flat deep-purple waves-effect waves-purple nobr"
             @click="loadState()">
            <i class="material-icons right">forward</i>Load
          </a>

          <a class="btn red right btn-small btn-flat waves-effect waves-red"
             @click="deleteState()">
            <i class="material-icons">delete</i>
          </a>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import Tag from "@/components/comments/Tag";
import moment from 'moment';
export default {
  name: 'history-row',
  components: {
    Tag
  },
  props: {
    index: Number,
    length: Number,
    time: Number,
    tags: Array
  },
  filters: {
    moment: function (date) {
      return moment(date).format('HH:mm:ss, Do MMM YYYY');
    }
  },
  computed: {
    historyIndex() {
      return this.$store.state.historyIndex
    }
  },
  methods: {
    loadState() {
      this.$store.commit("loadFromHistory", this.index)
      this.$emit('load', this.index);
    },
    deleteState() {
      this.$store.commit('deleteFromHistory', this.index)
    },
    tag_meta(id) {
      return this.$store.state.tags.tags[id-1]
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