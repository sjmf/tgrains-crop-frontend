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
        <td>{{row.value | format_significance}}</td>
        <td v-bind:class="row.change === 0 ? '' : row.change >= 0 ? 'green-text' : 'red-text'" class="text-darken-2">
            {{row.change | sign}} {{row.change | format_significance}}
        </td>
        <td>{{row.unit}}</td>
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
            values: Array
        },
        filters: {
            /***
             * Format a number removing precision and truncating, then adding 'millions', 'billions', etc.
             * https://stackoverflow.com/questions/36734201/
             * @param value
             */
            format_significance(value) {
              // Nine Zeroes for Billions
              return Math.abs(Number(value)) >= 1.0e+9

                  ? numberFormat(Math.abs(Number(value)) / 1.0e+9) + " billion"
                  // Six Zeroes for Millions
                  : Math.abs(Number(value)) >= 1.0e+6

                      ? numberFormat(Math.abs(Number(value)) / 1.0e+6) + " million"
                      // Three Zeroes for Thousands
                      : Math.abs(Number(value)) >= 1.0e+3

                          ? numberFormat(Math.abs(Number(value)) / 1.0e+3) + " thousand"

                          : Math.abs(Number(value));
            },

            sign(value) {
              return (value === 0 ? '' : value >= 0 ? '+' : '-')
            }
        },
    }
</script>
<style scoped>
  .card .card-content .chart-panel + p {
    margin-top: 20px;
  }
  table {
    min-width:450px;
  }
  .tcontainer {
    overflow-x: scroll;
  }
</style>