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

      <div v-else-if="showHeader || showTotal"
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
          :remaining-area="remaining(id)"
          :hide-input="false"
          :readonly="readonly"
          :colour-override="'#607D8B'"
          @change="$emit('change',{'type': cropOrLivestock, ...$event})"/>
      </transition>
    </div>

    <transition name="collapse">
    <ul v-show="active" class="row-container">
      <template v-for="(item, index) in elements">

        <variable-group
            v-if="(item instanceof Array)"
            :key="groups[index].name"
            :id="groups[index].name"
            :title="groups[index].title"
            :groups="groups[index].groups"
            :elements="item"
            :errors="errors"
            :remaining="remaining"
            :readonly="readonly"
            :reset-trigger="resetTrigger"
            :recalc-trigger="recalcSignal"
            :crop-or-livestock="cropOrLivestock"
            :show-header="false"
            :show-total="true"
            :show-total-collapsed-only="false"
            :default-collapsed="true"
            @change="onSliderChange($event)"/>

        <variable-row
            v-else-if="(item instanceof Object)"
            :key="index"
            :name="item.name"
            :label="item.label"
            :value="item.value"
            :bau-value="item.bau"
            :description="item.description"
            :error-message="errors[index]"
            :remaining-area="remaining(item.name)"
            :readonly="readonly"
            @change="onSliderChange({'type': cropOrLivestock, ...$event})"/>

      </template>
    </ul>
    </transition>
  </li>
</template>

<script>
import VariableRow from "@/components/sidebar/VariableRow"

export default {
  name: "VariableGroup",
  components: {
    VariableRow,
  },
  props: {
    id: String,
    title: String,
    subtitle: String,
    elements: Array,
    groups: Array,
    errors: Object,
    remaining: Function,
    readonly: Boolean,
    resetTrigger: Boolean,
    recalcTrigger: Boolean,
    cropOrLivestock: {String, undefined},
    // View Options:
    showHeader: Boolean,
    showTotal: Boolean,
    showTotalCollapsedOnly: Boolean,
    defaultCollapsed: Boolean
  },
  data() {
    return {
      active: true,
      ratios: undefined,
      sum: 0,
      recalcSignal: false,
    }
  },
  computed: {
    /**
     * innerSum with get/set allows mutation of a computed property, as in this case
     * where we need to set all sliders in the tree below when the top-level slider
     * updates (and the sum changes accordingly).
     */
    innerSum: {
      get() {
        const {sum} = this;
        return sum
      },
      set (_val) {
        this.sum = _val

        for(let e in this.flat) {
          // this.elements[e].value = newAreas[e] // Error: [vuex] do not mutate vuex store state outside mutation handlers
          // Instead, emit input events for all sub-elements and let the parent handle them
          this.$emit('change', {
            'type': this.cropOrLivestock,
            'group': this.id,
            'name': this.flat[e].name,
            'value':  _val * this.ratios[e]});
        }

        this.recalcSignal = !this.recalcSignal
      }
    },

    /**
     * Return a flat list of the tree contained by this group, to allow easy summing
     */
    flat() {
      // Flatten recursive elements structure to simple array
      const flatten = function(arr) {
        let result = []
        for(let i in arr) {
          if(Array.isArray(arr[i])) {
            result = result.concat(flatten(arr[i]))
          } else {
            result.push(arr[i])
          }
        }
        return result
      }
      return flatten(this.elements)
    }
  },
  methods: {
    /**
     * Event handler which fires when a slider is changed,
     * sums the elements in the group and re-calculates the ratio
     * @param $event
     */
    onSliderChange($event) {
      // Recalculate ratios
      if (this.sumElements() > 1)
        this.ratio()

      // Re-emit event to parent
      this.$emit('change', $event)
    },

    /**
     * Sum the elements in this group recursively
     * @returns {number} The sum of elements in the group
     */
    sumElements() {
      // Recursively sum elements in this sub-tree
      const recursiveSum = function(arr) {
        let sum = 0;
        for(let i in arr) {
          if(Array.isArray(arr[i])) {
            sum += recursiveSum(arr[i])
          } else {
            sum += arr[i].value
          }
        }
        return sum
      }

      this.sum = recursiveSum(this.elements)
      return this.sum
    },
    // Previously implemented sum using Map+Reduce (filter+sum) – (but 27.51% slower)
    // this.sum = Object.keys(this.elements)
    //                  .map(x => this.elements[x].value)
    //                  .reduce((x,y) => x+y)

    /**
     * Calculate the ratio between sub-elements when one is changed
     * @returns {any}
     */
    ratio() {
      const recursiveRatio = function(arr, sum) {
        let ratios = []
        for(let i in arr) {
          if(Array.isArray(arr[i])) {
            ratios = ratios.concat(recursiveRatio(arr[i], sum))
          } else {
            ratios.push(arr[i].value / sum)
          }
        }
        return ratios
      }

      this.ratios = recursiveRatio(this.elements, this.sum)
      return this.ratios
    },

    /**
     * Reset the sliders to their original values
     */
    reset() {
      this.ratios = Object.fromEntries(Object.keys(this.elements).map(x => [x, 0]))
      if (this.sumElements() > 0)
        this.ratio()
    }
  },
  watch: {
    elements() {
      if(this.elements === undefined) return
      this.reset()
    },
    resetTrigger() {
      this.reset()
    },
    recalcTrigger() {
      this.sumElements()
      this.recalcSignal = !this.recalcSignal
    }
  },
  mounted() {
    this.reset()
    if(this.defaultCollapsed)
      this.active = false
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

  ul.row-container {
    padding: 0 0 0 10px;
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