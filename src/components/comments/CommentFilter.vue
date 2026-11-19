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

      <div class="col s12">
        <p>
          <label>
            <input type="checkbox"
                   class="filled-in green darken-4"
                   v-model="by_landscape"
                   @change="loadComments()"/>
            <span>Include only comments from local area ({{$store.state.landscapeNames[$store.state.landscape_id]}})</span>
          </label>
        </p>
      </div>
    </div>

    <div class="comment-main row" v-show="filter_value === 2">
      <div class="col s12">
        <div class="grey-text">Filter by someone else's comments:</div>
        <div v-if="user_name">
          <span>Showing comments by <strong>{{user_name}}</strong>.</span>
          <button class="btn btn-small right" @click="$store.commit('clearFilter')"><i class="material-icons right small">clear</i>Clear filter</button>
        </div>
        <span v-else>To use this filter, select a user by clicking on their avatar or name.</span>
      </div>
    </div>

    <div class="comment-main row" v-show="filter_value === 3">
      <div v-if="reply_card">
        <div class="col s12">
          <span class="grey-text">Filtering by replies to this comment:</span>
          <button class="btn btn-small right" @click="$store.commit('clearFilter')"><i class="material-icons right small">clear</i>Clear filter</button>
        </div>
        <div class="col s12">
          <comment-card
              v-if="reply_card"
              v-bind:id="reply_card.id"
              v-bind:hash="reply_card.hash"
              v-bind:reply_id="reply_card.reply_id"
              v-bind:author="reply_card.author"
              v-bind:user_id="reply_card.user_id"
              v-bind:text="reply_card.text"
              v-bind:tags="reply_card.tags"
              v-bind:timestamp="reply_card.timestamp"
              v-bind:reply_view="true"
              @filterUser="$store.commit('filterUser', $event)"/>
        </div>
      </div>
      <div v-else class="col s12">
        <span>To use this filter, click on a comment reply in the comments section below.</span>
      </div>
    </div>

    <div class="comment-main row" v-if="filter_value === 4">
      <div v-if="tags !== undefined" class="col s12">
        <span class="grey-text">Filtering by the following tags:</span>
        <button class="btn btn-small right" @click="$store.commit('clearFilter')"><i class="material-icons right small">clear</i>Clear filter</button>
      </div>
      <div v-if="tags !== undefined" class="col s12">
        <tag v-for="t in tags"
             :key="t"
             :id="t"
             :colour="tag_group(tag_meta(t).group).colour"
             :name="tag_meta(t).name"
             :value="null"
             @filterTag="(tag_id) => $store.commit('removeTag', tag_id)"/>
      </div>
      <div v-else class="col s12">
        <span>To use this filter, click on a tag in the comments section below</span>
      </div>
    </div>
  </div>
</template>

<script>
import range from 'lodash/range';

import CommentCard from "@/components/comments/CommentCard.vue";
import Tag from "@/components/comments/Tag.vue";

export default {
  name: "CommentFilter",
  components: {
    CommentCard,
    Tag
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
     * Filtering options (user_name, user_id, reply_card, tags)
     */
    user_name () {
      return this.$store.state.comments.filter_opts.user_name
    },

    user_id () {
      return this.$store.state.comments.filter_opts.user_id
    },

    reply_card () {
      return this.$store.state.comments.filter_opts.reply_card
    },

    tags () {
      return this.$store.state.comments.filter_opts.tags
    },

    /**
     * Mapping to landscape_id
     */
    landscape_id() {
      return this.$store.state.landscape_id
    },

    /**
     * v-model bindings for sort/filter/size values
     */
    sort_value: {
      get () {
        return this.$store.state.comments.sort
      },
      set (value) {
        this.$store.commit("setCommentsSort", parseInt(value))
        this.loadComments()
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
        this.loadComments()
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
        this.loadComments()
      }
    },

    by_landscape: {
      get() {
        return this.$store.state.comments.by_landscape
      },
      set (value) {
        this.$store.commit('filterLandscape', value)
        // Don't need to loadComments() because it's loaded in the watcher
      },
    }
  },
  methods: {
    /**
     * Set value of #id and call internal materialize update method ;_;
     * (This is a disgusting hack but it does work.)
     * @param id
     * @param index
     */
    setMaterialFormSelectSelected(id, index) {
      const elem = document.querySelector(id)
      elem.parentElement.querySelector('select').value = index
      this.$_M.FormSelect.getInstance(elem)._setValueToInput()
    },

    /***
     * Set filter value in form and adjust visual drop-downs accordingly
     */
    setFilter() {
      let value = 0
      if (this.user_id !== undefined || this.user_id === this.$store.state.user.id)
        value = 2
      else if (this.reply_card !== undefined)
        value = 3
      else if (this.tags !== undefined)
        value = 4

      this.filter_value = value
      this.setMaterialFormSelectSelected('#filter-select', value)
    },

    /**
     * Get meta values for a tag at 'id'
     * @param id
     * @returns {*}
     */
    tag_meta(id) {
      return this.$store.state.tags.tags[id]
    },

    /**
     * Get group data for a tag at 'id'
     * @param id
     * @returns {*}
     */
    tag_group(id) {
      return this.$store.state.tag_groups[id]
    },

    /**
     * Switch the comments page and re-load comments
     * @param page
     */
    changePage(page) {
      this.$store.commit('setCommentsPage', page)
      this.loadComments()
    },

    /**
     * Bubble up event to load comments
     */
    loadComments() {
      this.$emit("loadComments")
    }
  },
  watch: {
    /** On change of props, jump the dropdown to the appropriate filter **/
    user_id      () { this.setFilter() },
    reply_card   () { this.setFilter() },
    tags         () { this.setFilter() },
    landscape_id () { this.loadComments() }
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
input[type="checkbox"].green.darken-4.filled-in:checked + span:not(.lever):after{
  border: 2px solid #1B5E20;
  background-color: #1B5E20;
}

#comment-filter div.comment-main.row {
  margin-bottom: 0;
}
</style>