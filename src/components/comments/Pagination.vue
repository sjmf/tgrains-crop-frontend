<template>
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
</template>
<script>
export default {
  name: 'pagination',
  methods: {
    set_page(page) {
      if (page !== this.current_page && page > 0 && page <= this.total_pages) {
        this.$store.commit('setCommentsPage', page)
        this.$store.dispatch('loadComments')
      }
    }
  },
  computed: {
    current_page() {
      return this.$store.state.comments.page
    },
    total_pages(){
      return Math.floor((this.$store.state.comments.length-1) / this.$store.state.comments.size) +1
  }
  }
}
</script>
