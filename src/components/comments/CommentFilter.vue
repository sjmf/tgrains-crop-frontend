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
          <label for="size-select">Comments per page:</label>
        </div>
      </div>
    </div>

    <div class="comment-main row" v-show="filter_value === 2">
      <div class="col s12">
        <div class="grey-text">Filter by someone else's comments:</div>
        <div v-if="user_name">
          <span>Showing comments by <strong>{{user_name}}</strong>.</span>
          <button class="btn btn-small right" @click="$emit('clearFilter')"><i class="material-icons right small">clear</i>Clear filter</button>
        </div>
        <span v-else>To use this filter, select a user by clicking on their avatar or name.</span>
      </div>
    </div>

    <div class="comment-main row" v-show="filter_value === 3">
      <div class="col s12">
        <span>Replies</span>
      </div>
    </div>

    <div class="comment-main row" v-show="filter_value === 4">
      <div class="col s12">
        <span>Tags</span>
      </div>
    </div>
  </div>
</template>

<script>
const range = require('lodash/range');

export default {
  name: "CommentFilter",
  props: {
    user_name: String,  // Contains {id: '', name: ''}
    user_id: String
  },
  data() {
    return {
      sort:   ["Date Descending", "Date Ascending", "Distance from BAU state", "Closest to current state"],
      filter: ["All", "Mine", "Someone else's", "Replies", "Tags"],
      show: range(2,12,2),
    }
  },
  computed: {
    /**
     * v-model bindings for sort/filter/size values
     */
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
        // Reset comments page if changing filter, to prevent 404
        this.$store.commit('setCommentsPage', 1)
        this.$store.commit("setCommentsFilter", parseInt(value))
        this.$store.dispatch("loadComments", this.query_user_id)
      }
    },
    size_value: {
      get () {
        return this.$store.state.comments.size
      },
      set (value) {
        // Reset comments page if changing page size, to prevent 404
        this.$store.commit('setCommentsPage', 1)
        this.$store.commit("setCommentsSize", parseInt(value))
        this.$store.dispatch("loadComments", this.query_user_id)
      }
    },

    /**
     * Get the correct user ID – pass this.$store.state.user.id if filter value is 'Mine'
     * @returns {String|undefined}
     */
    query_user_id() {
      return this.filter_value === 2 ? this.user_id : this.$store.state.user.id
    }
  },
  methods: {
    setMaterialFormSelectSelected(id, index) {
      // Set value of #id and call internal materialize update method ;_;
      // This is a disgusting hack but it does work.
      const elem = document.querySelector(id)
      elem.parentElement.querySelector('select').value = index
      this.$_M.FormSelect.getInstance(elem)._setValueToInput()
    }
  },
  watch: {
    user_id: function() {
      // On change of user object, jump the dropdown to 'Filter comments by: Someone else's'
      let value = 2
      if (this.user_id === undefined)
        value = 0

      this.$set(this, 'filter_value', value)
      this.setMaterialFormSelectSelected('#filter-select', value)
    }
  },
  mounted() {
    for (let elem of document.querySelectorAll('div.select-wrapper.comment-controls select')) {
      this.$_M.FormSelect.init(elem)
    }
    this.setMaterialFormSelectSelected('#filter-select', this.filter_value)
  }
}
</script>

<style scoped>
.card-panel div.row:last-child {
  margin-bottom: 0;
}
</style>