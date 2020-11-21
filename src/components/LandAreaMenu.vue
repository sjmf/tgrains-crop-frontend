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
            onChange(event) {
                console.log(event.target.value);
                this.$store.commit("setLandscapeId", parseInt(event.target.value));
                this.$store.commit("setLandscapeName", event.target[event.target.selectedIndex].label);

                // Check if BAU for area is loaded
                this.$emit("checkBAULoaded")
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
        mounted() {
            // Set select value to landscape ID on load
            const elem = document.querySelector('#landscape-input')
            const select = elem.querySelector('select')
            elem.querySelector("option[value='102']").selected = true
            select.value = this.$store.state.landscape_id
            elem.value = this.strings[this.$store.state.landscape_id];

            this.$_M.FormSelect.init(
                document.querySelector('#landscape-input select')
            )
        }
    }
</script>

<style scoped>
  .select-wrapper + label {
    top:-10px;
  }
</style>