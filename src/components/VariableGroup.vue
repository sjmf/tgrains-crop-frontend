<template>
  <li :id="'v-group-'+id">
    <div class="variable-group" :class="{active:active}">
      <div v-if="showHeader" @click="active=!active">
        <span class="title">
          {{ title }}
          <i class="drop-arrow material-icons right">arrow_drop_up</i>
        </span>
        <span class="label" v-if="subtitle !== undefined" v-html="subtitle"></span>
      </div>

      <div
          v-else-if="showHeader || showTotal"
          class="float-arrow"
          @click="active=!active">
        <i class="drop-arrow material-icons right">arrow_drop_up</i>
      </div>

      <transition name="fade">
      <variable-row
          v-if="showTotal && (!showTotalCollapsedOnly || !active)"
          v-model="innerSum"
          :name="id"
          :label="showHeader ? 'Total' : title"
          :remaining-area="remaining(kind)"
          :hide-input="false"
          :readonly="readonly"
          @change="$emit('change', $event)"/>
      </transition>
    </div>

    <transition name="collapse">
    <ul v-if="active">
      <component
          v-bind:is="'variable-row'"
          v-for="(item, index) in elements"
          :key="index"
          :name="item.name"
          :label="item.label"
          :value="item.value"
          :bau-value="item.bau"
          :description="item.description"
          :error-message="errors[index]"
          :remaining-area="remaining(item.name)"
          :readonly="readonly"
          @input="$emit('input', {'id': id, 'name': item.name, 'value': $event})"
          @change="onSliderChange($event)"/>
    </ul>
    </transition>
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
    kind: String, // 'crops' or 'livestock'
    title: String,
    subtitle: String,
    elements: Object,
    errors: Object,
    remaining: Function,
    readonly: Boolean,
    // View Options:
    showHeader: Boolean,
    showTotal: Boolean,
    showTotalCollapsedOnly: Boolean,
  },
  data() {
    return {
      active: true,
      ratios: undefined,
      sum: 0,
    }
  },
  computed: {
    innerSum: {
      get() {
        const {sum} = this;
        return sum
      },
      set (_val) {
        this.sum = _val
        // Update values for all sub-sliders
        for(let e in this.elements) {
          // this.elements[e].value = newAreas[e]
          // Error: [vuex] do not mutate vuex store state outside mutation handlers
          this.$emit('input', {'id': this.id, 'name': e, 'value':  _val * this.ratios[e]});
        }
      }
    }
  },
  methods: {
    onSliderChange($event) {
      // Recalculate ratios
      if (this.sumElements() > 0)
        this.ratio()

      // Re-emit event to parent
      this.$emit('change', {$event})
    },
    sumElements() {
      // Previously (57.72% slower)
      // this.sum = Object.keys(this.elements).map(x => this.elements[x].value).reduce((x,y) => x+y)
      this.sum = 0
      for(let i in this.elements)
        this.sum += this.elements[i].value
      return this.sum
    },
    ratio() {
      // Previously (65.28% slower):
      // this.ratios = Object.fromEntries(Object.keys(this.elements).map(x => [x, this.elements[x].value / this.sum]))
      for (let i in this.elements)
        this.ratios[i] = this.elements[i].value / this.sum

      return this.ratios
    },
    reset() {
      this.ratios = Object.fromEntries(Object.keys(this.elements).map(x => [x, 0]))
      if (this.sumElements() > 0)
        this.ratio()
    }
  },
  watch: {
    elements() {
      this.reset()
    }
  },
  mounted() {
    this.reset()
  },
}
</script>

<style scoped>
  span.title {
    cursor: pointer;
    pointer-events: none;
    color: rgba(0, 0, 0, 0.54);
    font-size: 14px;
    font-weight: 500;
    line-height: 3rem;
    display: block;
  }

  div.variable-group > div {
    display: block;
    line-height: 1rem;
    padding: 0 10px;
  }

  div.variable-group:hover {
    background-color: #efefef;
  }

  div.float-arrow {
    cursor: pointer;
    position: fixed;
    margin-left: 145px;
  }

  div.float-arrow i {
    line-height: 2rem;
    margin: 0;
  }

  .variable-group i {
    text-align: right;
    margin-right: 0;
    line-height: 3rem;
    width: auto;
  }

  .variable-group i.drop-arrow {
    color: rgba(0, 0, 0, 0.87);
    transform: scaleY(-1);
    transition: transform 500ms;
  }

  .variable-group.active i.drop-arrow {
    color: rgba(0, 0, 0, 0.54);
    transform: scaleY(1);
  }

</style>