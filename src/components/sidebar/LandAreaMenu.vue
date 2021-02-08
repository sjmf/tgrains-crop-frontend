<template>
  <li id="land-area-menu">

    <!-- LAND AREA SELECT -->
    <span class="subheader">Land Area</span>

    <div class="select-wrapper" id="landscape-input">
      <select id="area"
              :disabled="readonly"
              @change="onChange($event)"> <!-- class="browser-default"-->
        <!--<option value="" disabled selected>Choose your area</option>-->
        <option value="101">{{this.strings[101]}}</option>
        <option value="102">{{this.strings[102]}}</option>
      </select>
      <label for="area">Please select your area from the list:</label>
    </div>
  </li>
</template>

<script>
    export default {
        name: 'LandAreaMenu',
        methods: {
            /**
             * Change handler: change landscape_id in Vuex and Vue Router param,
             * then load the BAU state for the new landscape
             */
            async onChange(event) {
                this.$store.commit("setLandscapeId", parseInt(event.target.value));
                await this.$router.push({params: {'id': event.target.value}})

                // Load BAU state
                await this.$store.dispatch('loadBauState', true)
            },

            /**
             * Programatically set select value to landscape ID on load
             * @param val
             */
            setValue(val) {
              // Select the DOM elements for the dropdown and change
              // them to reflect the new value, `val`.
              const elem = document.querySelector('#landscape-input')
              const select = elem.querySelector('select')

              select.value = val
              elem.value = this.strings[val];

              for(let e of elem.querySelectorAll("option[value]"))
                e.selected = false

              elem.querySelector(`option[value='${val}']`).selected = true
            }
        },
        computed: {
            strings() {
                return this.$store.state.landscapeNames
            },
            readonly() {
                return this.$store.state.readonly
            }
        },
        watch: {
          $route() {
            console.info('route changed in landAreaMneu')
            this.setValue(this.$store.state.landscape_id)
          },
          readonly() {
            const elem = document.querySelector("#landscape-input .select-wrapper input")
            elem.disabled = this.readonly
          }
        },
        mounted() {
          // Do this on nextTick because landscape_id changes on mounted() of App.vue
          this.$nextTick(() => {
            this.setValue(this.$store.state.landscape_id)

            // Initialise the dropdown with Materialize
            this.$_M.FormSelect.init(
                document.querySelector('#landscape-input select')
            )
          })
        }
    }
</script>

<style scoped>
  .select-wrapper + label {
    top:-10px;
  }

  li#land-area-menu {
    line-height: 1rem;
    padding: 0 10px;
  }
</style>