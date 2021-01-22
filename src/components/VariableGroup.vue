<template>
  <li class="active" :class="id">
    <div class="collapsible-header">
      <div class="subheader">
        {{ title }}
        <i class="drop-arrow material-icons right">arrow_drop_up</i>
      </div>
      <span class="label" v-if="subtitle !== undefined" v-html="subtitle"></span>
    </div>

    <ul class="collapsible-body">
      <variable-row
          v-for="(item, index) in elements"
          :key="index"
          :name="item.name"
          :label="item.label"
          :value="item.value"
          :bau-value="item.bau"
          :description="item.description"
          :error-message="errors[index]"
          :remaining-area="max(item.name)"
          :readonly="readonly"
          @input="$emit('input', {'id': id, 'name': item.name, 'value': $event})"
          @change="$emit('change', {$event})"/>
    </ul>
  </li>
</template>

<script>
import VariableRow from "@/components/VariableRow"

export default {
  name: "VariableGroup",
  components: {
    VariableRow,
  },
  props: {
    id: String,
    title: String,
    subtitle: String,
    elements: Object,
    errors: Object,
    max: Function,
    readonly: Boolean
  },
  mounted() {
    console.log(this.id)
    this.$_M.Collapsible.init(document.querySelector(".sidenav .collapsible"),{
      accordion: false
    })
  }
}
</script>

<style scoped>

  div.collapsible-header {
    line-height: 1rem;
    padding: 0 10px;
  }

  .sidenav .collapsible-header, .sidenav.fixed .collapsible-header {
    padding:  0 10px 10px 10px;
  }

  .collapsible-header {
    display: block;
  }

  .collapsible-header i {
    text-align: right;
    margin-right: 0;
    width: auto;
  }

  ul.collapsible-body > li {
    padding: 0 10px;
  }

  .collapsible li i.drop-arrow {
    color: rgba(0, 0, 0, 0.87);
    transform: rotate(180deg);
  }

  .collapsible li.active i.drop-arrow {
    color: rgba(0, 0, 0, 0.54);
    transform: rotate(0deg);
  }

</style>