<template>
  <div class="history-card card panel"
      v-bind:class="[index === historyIndex ? 'green lighten-4' : 'grey lighten-3']">
    <div class="card-content">
      <div class="row">
        <div class="col s8">
          <strong>{{length - index}}.</strong> <span class="datetime"><i class="tiny material-icons">timer</i> {{ new Date(time).toUTCString() }}</span>
          <span v-if="index === historyIndex"><strong> Current State </strong></span>

          <tag v-for="t in tags"
               v-bind:key="t"
               :name="tag_meta(t).name"
               :colour="tag_group(tag_meta(t).group).colour"
               :value="null"></tag>

        </div>

        <div class="col s4" v-if="index !== historyIndex">
          <a class="btn right btn-small btn-flat deep-purple waves-purple"
             @click="loadState()">
            <i class="material-icons right">forward</i>Load
          </a>

          <a class="btn red right btn-small btn-flat waves-red"
             @click="deleteState()">
            <i class="material-icons">delete</i>
          </a>
        </div>

        <div class="col s4" v-if="index === historyIndex">
          <a class="btn green right btn-small btn-flat">
            <i class="material-icons right">comment</i>Comment
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Tag from "@/components/comments/Tag";

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
  computed: {
    historyIndex() {
      return this.$store.state.historyIndex
    }
  },
  methods: {
    loadState() {
      this.$store.commit("setHistoryIndex", this.index)
      this.$store.commit("loadFromHistory", this.index)
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
  margin-right:1rem;
}
</style>