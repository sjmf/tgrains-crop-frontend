<template>
  <div v-html='identicon'
       class="avatar"
       @click="$emit('click', $event)">
  </div>
</template>
<script>
import jdenticon from 'jdenticon/standalone'

export default {
  emits: ['click'],
  props: {
    value: String,
    size: Number,
    alt: String
  },
  computed: {
    identicon: function() {
      return jdenticon.toSvg(this.value, 200)
          .replace('height="200"', 'height="100%"')
          .replace('width="200"', 'width="100%"');
    }
  }
}
</script>
<style scoped>
  .avatar {
    line-height:0;
    border-radius: 50%;
    border: 1px solid #eee;
    overflow:hidden;
  }
</style>