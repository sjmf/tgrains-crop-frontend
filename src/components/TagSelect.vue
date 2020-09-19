<template>
  <ul class="collapsible">
    <li class="active">
      <div class="collapsible-header">
        <i class="material-icons">supervisor_account</i>Themes
      </div>

      <div class="collapsible-body">
        <!-- +1 here as MySQL indexes from 1! -->
        <!--- i == tags.tags[i+1].id -->
        <Tag v-for="i in tags.groups[0]"
             v-bind:key="i"
             v-bind:name="tags.tags[i-1].name"
             v-bind:value="tags.tags[i-1].selected"
             v-bind:colour="tag_groups[0]['colour']"
             @input="updateValue(i, $event)"/>
      </div>
    </li>

    <li>
      <div class="collapsible-header">
        <i class="material-icons">terrain</i>Crops and Livestock
      </div>
      <div class="collapsible-body">

        <Tag v-for="i in tags.groups[1]"
             v-bind:key="i"
             v-bind:name="tags.tags[i-1].name"
             v-bind:value="tags.tags[i-1].selected"
             v-bind:colour="tag_groups[1]['colour']"
             @input="updateValue(i, $event)"/>

      </div>
    </li>

    <li>
      <div class="collapsible-header">
        <i class="material-icons">pie_chart</i>Outputs
      </div>
      <div class="collapsible-body">

        <span v-for="n in 3" v-bind:key="n">
          <Tag v-for="i in tags.groups[n+1]"
               v-bind:key="i"
               v-bind:name="tags.tags[i-1].name"
               v-bind:value="tags.tags[i-1].selected"
               v-bind:colour="tag_groups[n+1]['colour']"
               @input="updateValue(i, $event)"/>
        </span>

      </div>
    </li>
  </ul>
</template>
<script>
import Tag from "@/components/Tag";

export default {
  name: 'TagSelect',
  components: {
    Tag
  },
  computed: {
    tags() {
      return this.$store.state.tags;
    },
    tag_groups() {
      return this.$store.state.tag_groups;
    }
  },
  methods: {
    updateValue(id, value) {
      this.$store.commit('setTagSelected', {id, value})
    }
  }
}
</script>
