<template>
  <ul id="tag-select" class="collapsible expandable">
    <li class="active">
      <div class="collapsible-header">
        <i class="material-icons">supervisor_account</i>Themes
      </div>

      <div class="collapsible-body">
        <!-- +1 here as MySQL indexes from 1! -->
        <!--- i == tags.tags[i+1].id -->
        <tag v-for="i of (tags.groups[0] || [])"
             :key="i"
             :id="i"
             :name="tags.tags[i].name"
             :value="tags.tags[i].selected"
             :colour="tag_groups[0]['colour']"
             @input="updateValue(i, $event);"/>
      </div>
    </li>

    <li>
      <div class="collapsible-header">
        <i class="material-icons">terrain</i>Crops and Livestock
      </div>
      <div class="collapsible-body">

        <tag v-for="i of (tags.groups[1] || [])"
             :key="i"
             :id="i"
             :name="tags.tags[i].name"
             :value="tags.tags[i].selected"
             :colour="tag_groups[1]['colour']"
             @input="updateValue(i, $event)"/>

      </div>
    </li>

    <li>
      <div class="collapsible-header">
        <i class="material-icons">pie_chart</i>Outputs
      </div>
      <div class="collapsible-body">

        <span v-for="n in 3" v-bind:key="n">
          <tag v-for="i of (tags.groups[n+1] || [])"
               :key="i"
               :name="tags.tags[i].name"
               :value="tags.tags[i].selected"
               :colour="tag_groups[n+1]['colour']"
               @input="updateValue(i, $event)"/>
        </span>

      </div>
    </li>
  </ul>
</template>
<script>
import Tag from "@/components/comments/Tag";

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
  },
  mounted() {
    this.$_M.Collapsible.init(
        document.querySelectorAll("#tag-select.collapsible.expandable"), {
          accordion: false
        }
    )
  }
}
</script>
