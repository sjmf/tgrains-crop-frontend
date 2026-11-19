<template>
<div class="row">
  <div class="col s12 m6 offset-m4">
    <ul class="pagination">
      <li v-bind:class="[current_page <= 1 ? 'disabled' : 'waves-effect']"
          @click="set_page(current_page - 1)">
        <span><i class="material-icons">chevron_left</i></span>
      </li>

      <li v-for="n in total_pages"
          v-bind:key="n"
          v-bind:class="[current_page === n ? 'active' : 'waves-effect']"
          @click="set_page(n)">
        <span>{{ n }}</span>
      </li>

      <li v-bind:class="[current_page >= total_pages ? 'disabled' : 'waves-effect']"
          @click="set_page(current_page + 1)">
        <span><i class="material-icons">chevron_right</i></span>
      </li>
    </ul>
  </div>
</div>
</template>
<script>
export default {
  name: 'pagination',
  emits: ['changePage'],
  methods: {
    set_page(page) {
      if (page !== this.current_page && page > 0 && page <= this.total_pages) {
        this.$emit('changePage', page)
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

<style scoped>
ul.pagination span {
  cursor: pointer;
}
.pagination li.active span {
  color: #fff;
}
.pagination li.disabled span {
  cursor: default;
  color: #999;
}
.pagination li span {
  color: #444;
  display: inline-block;
  font-size: 1.2rem;
  padding: 0 10px;
  line-height: 30px;
}
</style>
