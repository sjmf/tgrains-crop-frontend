<template>
  <div class="tcontainer">
    <table>
      <thead>
      <tr>
        <th v-for="title in titles" :key="title">{{title}}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="row in values" :key="row.label">
        <td>{{row.label}}</td>
        <td>
          {{ show_unit(row, 'pre', 'value') ? row.unit.string : '' }}
          {{ row.value | format_significance }}
          {{ show_unit(row, 'post', 'value') ? row.unit.string : '' }}
        </td>
        <td v-if="'change' in row"
            v-bind:class="row.change === 0 ? '' : row.change >= 0 ? 'green-text' : 'red-text'"
            class="text-darken-2">
          {{ show_unit(row, 'pre', 'change') ? row.unit.string : '' }}
          {{row.change | sign}} {{row.change | format_significance}}
          {{ show_unit(row, 'post', 'change') ? row.unit.string : '' }}
        </td>
        <td v-else></td>
        <td v-html="row.description"></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
    function numberFormat(value) {
      return new Intl.NumberFormat('en-GB', {
            maximumFractionDigits: 1,
          }
      ).format(value)
    }

    export default {
        name: 'DataTable',
        props: {
            titles: Array,
            values: {
              type: Array,
              required: true,
              validator: (prop) => {
                return prop.every(
                    val => typeof val === 'object' && val !== null
                           && 'label' in val && typeof val.label === 'string'
                           && 'value' in val && ['string', 'number'].includes(typeof val.value)
                           && 'description' in val && typeof val.description === 'string'
                           && ('change' in val ? typeof val.change === 'number' : true)
                           && ('unit' in val
                             ? typeof val.unit === 'object' && val.unit !== null
                               && 'string' in val.unit
                               && 'loc' in val.unit
                               && ['pre', 'post'].includes(val.unit.loc)
                               && ('which' in val.unit
                                  ? typeof val.unit.which === 'string'
                                    && ['value', 'change', 'both'].includes(val.unit.which)
                                  : true)
                             : true)
                )
              }
            }
        },
        filters: {
            /***
             * Format a number removing precision and truncating, then adding 'millions', 'billions', etc.
             * https://stackoverflow.com/questions/36734201/
             * @param value
             */
            format_significance(value) {
              return typeof value === 'number' ?
               Math.abs(Number(value)) >= 1.0e+9       // Nine Zeroes for Billions
                  ? numberFormat(Math.abs(Number(value)) / 1.0e+9) + " billion"
                  : Math.abs(Number(value)) >= 1.0e+6        // Six Zeroes for Millions
                      ? numberFormat(Math.abs(Number(value)) / 1.0e+6) + " million"
                      : Math.abs(Number(value)) >= 1.0e+3    // Three Zeroes for Thousands
                          ? numberFormat(Math.abs(Number(value)) / 1.0e+3) + " thousand"
                          : Math.abs(Number(value))
               : value;
            },

            sign(value) {
              return (value === 0 ? '' : value >= 0 ? '+' : '-')
            }
        },
        methods: {
          show_unit(row, location, column) {
            return ('unit' in row && row.unit.loc === location
                && ('which' in row.unit
                    ? [column, 'both'].includes(row.unit.which)
                    : column === 'value'))
                ? row.unit.string
                : ''
          }
        }
    }
</script>

<style scoped>
  .card .card-content .chart-panel + p {
    margin-top: 20px;
  }
  table {
    min-width:450px;
  }
  th {
    padding: 0 5px 10px 5px;
  }
  .tcontainer {
    overflow-x: scroll;
  }
</style>