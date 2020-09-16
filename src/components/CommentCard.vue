<template>
  <div class="comment-card card-panel grey lighten-5 z-depth-1">
    <div class="row">
      <div class="col s3 m2">
        <Jdenticon v-bind:value="this.hash" v-bind:size="80" alt="avatar"/>
      </div>

      <div class="col s9 m10">
        <div class="row">
          <div class="col s12 m6">
            <span class="username green-text text-darken-2">
              {{ author }}
            </span>
          </div>
          <div class="col s12 m6 right-align">
            <span class="timestamp grey-text">
              {{ timestamp | format_datetime }}
            </span>
          </div>

        </div>

        <div class="row">
          <div class="col s12">
            <span class="black-text">
              <!-- Never use v-html here. If someone compromises the database, XSS becomes possible -->
              {{ text | decode }}
            </span>
          </div>
        </div>

        <div class="row" v-if="tags">
          <div class="col s2">
            <span class="grey-text">Tags:</span>
          </div>
          <div class="col s10">
            <span class="new badge blue lighten-2" data-badge-caption="small business"></span>
            <span class="new badge brown lighten-2" data-badge-caption="oats"></span>
            <span class="new badge green lighten-2" data-badge-caption="greenhouse gas"></span>
            <span class="new badge purple lighten-2" data-badge-caption="pesticides"></span>
            <span class="new badge red lighten-2" data-badge-caption="cancer"></span>
          </div>
        </div>

      </div>
    </div>

    <div class="row" v-if="model_state">
      <div class="col s10 offset-s2 divider"></div>
    </div>

    <div class="row compare-buttons" v-if="model_state">

      <div class="col s10 m2 offset-m4 offset-l6 l2">
        <span class="grey-text">Compare</span>
      </div>
      <div class="col s2 m2 l1">
        <a class="btn-floating btn waves-effect waves-light amber darken-2">
          <i class="material-icons">insert_chart</i>
        </a>
      </div>

      <div class="col s10 m2 l2">
        <span class="grey-text">Load</span>
      </div>
      <div class="col s2 m2 l1">
        <a class="btn-floating btn waves-effect waves-light blue darken-2">
          <i class="material-icons">play_arrow</i>
        </a>
      </div>

    </div>
  </div>
</template>
<script>
import Jdenticon from '@/components/Jdenticon.vue'

export default {
  name: 'comment-card',
  components: {
    Jdenticon
  },
  props: {
      id: Number,
      reply_id: Number,
      author: String,
      hash: String,
      text: String,
      timestamp: Number,
      tags: Array,
      model_state: undefined
  },
  filters: {
      format_datetime(unix_timestamp) {
          let d = new Date(unix_timestamp * 1000)
          return d.toLocaleDateString("en-GB") + " " + d.toLocaleTimeString("en-GB")
      },
      decode(html) {
          let txt = document.createElement("textarea");
          txt.innerHTML = html;
          return txt.value;
      }
  }
}
</script>