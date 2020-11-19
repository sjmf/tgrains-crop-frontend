<template>
  <div id="comment-filter" class="card-panel grey lighten-5 z-depth-1">
    <div class="row">
      <div class="col s12">
        <span class="subheader"><strong>Filtering Options</strong></span>
      </div>
    </div>

    <div class="comment-main row">
      <div class="col s4">
        <div class="select-wrapper comment-controls">
          <select id="sort-select"
                  v-model="sort_value">
            <option
                v-for="(value, index) in this.sort"
                :key="index"
                :value="index">
              {{value}}
            </option>
          </select>
          <label for="sort-select">Sort comments by:</label>
        </div>
      </div>

      <div class="col s4">
        <div class="select-wrapper comment-controls">
          <select id="filter-select"
                  v-model="filter_value">
            <option
                v-for="(value, index) in this.filter"
                :key="index"
                :value="index">
              {{value}}
            </option>
          </select>
          <label for="filter-select">Filter comments by:</label>
        </div>
      </div>

      <div class="col s4">
        <div class="select-wrapper comment-controls">
          <select id="size-select"
                  v-model="size_value">
            <option
                v-for="(value, index) in this.show"
                :key="index"
                :value="value">
              {{value}}
            </option>
          </select>
          <label for="size-select">Number to show:</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const range = require('lodash/range');

export default {
  name: "CommentFilter",
  data() {
    return {
      sort:   ["Date Desc", "Date Asc", "Distance"],
      filter: ["All", "Mine", "Someone else's", "Replies", "Tags"],
      show: range(2,12,2),
    }
  },
  computed: {
    sort_value: {
      get () {
        return this.$store.state.comments.sort
      },
      set (value) {
        this.$store.commit("setCommentsSort", parseInt(value))
        this.$store.dispatch("loadComments")
      }
    },
    filter_value: {
      get () {
        return this.$store.state.comments.filter
      },
      set (value) {
        this.$store.commit("setCommentsFilter", parseInt(value))
        this.$store.dispatch("loadComments")
      }
    },
    size_value: {
      get () {
        return this.$store.state.comments.size
      },
      set (value) {
        this.$store.commit("setCommentsSize", parseInt(value))
        this.$store.dispatch("loadComments")
      }
    }
  },
  mounted() {
    for (let elem of document.querySelectorAll('div.select-wrapper.comment-controls select')) {
      this.$_M.FormSelect.init(elem)
    }
  }
}
</script>

<style scoped>
.card-panel div.row:last-child {
  margin-bottom: 0;
}
</style>