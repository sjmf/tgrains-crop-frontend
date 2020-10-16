<template>
  <aside id="slide-out" class="sidenav sidenav-fixed">

    <loading-overlay :loading="loading"/>

    <!-- VALUE SELECT SIDEBAR -->
    <ul>

      <land-area-menu v-on="$listeners"/>

      <li>
        <div class="divider"></div>
      </li>

      <!-- CROP AREAS -->
      <li id="crop-area-menu" class="no-hover">
        <span class="subheader">Crop Areas</span>
        <div><span class="label">All areas are measured in hectares (<strong>ha</strong>).</span></div>
      </li>

      <variable-row
        v-for="(item, index) in crops"
          v-bind:name="item.name"
          v-bind:label="item.label"
          v-bind:key="index"
          v-bind:value="item.value"
          v-bind:description="item.description"
          v-bind:error-message="errors[index]"
          v-bind:remaining-area="remainingArea"
          @input="updateValue('crops', item.name, $event)"
          @change="validateForm($event)"/>

      <li>
        <div class="divider"></div>
      </li>

      <!-- LIVESTOCK NUMBERS -->
      <li id="livestock-areas-menu" class="no-hover">
        <span class="subheader">Livestock Areas</span>
      </li>

      <variable-row
          v-for="(item, index) in livestock"
          v-bind:name="item.name"
          v-bind:label="item.label"
          v-bind:key="crops.length+index"
          v-bind:value="item.value"
          v-bind:description="item.description"
          v-bind:error-message="errors[index]"
          v-bind:remaining-area="remainingArea"
          @input="updateValue('livestock', item.name, $event)"
          @change="changes=true; validateForm()"/>

      <li>
        <div class="divider"></div>
      </li>

      <li class="no-hover">
        <div class="row">
          <div class="col l6">
            <button class="waves-effect waves-light btn red"
                    v-bind:class="{'disabled': !this.changes}"
                    v-on:click="resetToBAU">Reset</button>
          </div>
          <div class="col l6">
            <button class="waves-effect waves-light btn green"
                    v-bind:disabled="submitDisabled"
                    v-on:click="submitForm">Submit</button>
          </div>
        </div>
      </li>

      <!-- Dummy list element to address
       https://github.com/Dogfalo/materialize/issues/2112 -->
      <li class="dummy"></li>
    </ul>
  </aside>
</template>

<script>
    import LandAreaMenu from "@/components/LandAreaMenu"
    import VariableRow from "@/components/VariableRow"
    import LoadingOverlay from "@/components/LoadingOverlay";

    export default {
        name: 'SidebarMenu',
        components: {LandAreaMenu, VariableRow, LoadingOverlay},
        data() {
            return {
                submitDisabled: false,
                changes: false,
                errors: {}
            }
        },
        methods: {
            /***
             * Reset the sidebar to BAU state, which also triggers a change in the backing data store and graphs
             */
            resetToBAU() {
                try {
                    if(!this.changes) return
                    this.$store.commit("clearMessages")
                    this.$store.commit("resetToBAU")
                    this.$store.dispatch("sumArea")
                    this.$nextTick(() => this.validateForm())
                    this.changes = false
                }
                catch(err) {
                    this.$store.commit("raiseError", err)
                }
            },

            /**
             * Emit an event requesting submission of the form via AJAX.
             */
            submitForm() {
                this.$emit('submitForm', [this.crops,this.livestock])
            },

            /**
             * Commit the changed form value to the backing data store.
             * Because we're using Vuex, we do a $store.commit rather than using v-model.
             * @param cropOrLivestock
             * @param name
             * @param value
             */
            updateValue(cropOrLivestock, name, value) { // {cropOrLivestock, name, value}
                this.$store.commit('setFormValue', {cropOrLivestock, name, value})
                this.$store.dispatch('sumArea')
            },

            /**
             * Run form validation on each item in the sidebar backing data, checking for errors.
             * If errors are found, we disable the 'submit' button to prevent kicking off a model job with bad data.
             */
            validateForm() {
                // To make properties reactive, we need to use Vue.set (this.$set is an alias)
                // See https://vuejs.org/v2/guide/reactivity.html#Change-Detection-Caveats
                for (let item in this.crops) {
                    if (Object.prototype.hasOwnProperty.call(this.crops, item)) {
                        this.$set(this.errors, item, this.checkErrors(this.crops[item].value))
                    }
                }

                for (let item in this.livestock) {
                    if (Object.prototype.hasOwnProperty.call(this.livestock, item)) {
                        this.$set(this.errors, item, this.checkErrors(this.livestock[item].value))
                    }
                }

                // If the crop area exceeds the MaxCropArea, or
                // if any item in the errors array is NOT false,
                // then disable the submit button
                this.submitDisabled =  this.cropAreaExceeded
                                       || !Object.entries(this.errors).every(x=>x[1]===false)
            },

            /**
             * Checks if the value is NaN, an empty String, or a negative number. All undesirable things!
             * @param value
             * @returns {string|boolean}
             */
            checkErrors(value) {
                if(isNaN(value) || value === "")
                    return 'Enter a number'
                if(value < 0)
                    return 'Value cannot be negative!'

                return false
            },
        },
        computed: {
            /**
             * Check if crop area is exceeded
             */
            cropAreaExceeded() {
                return ! (this.$store.state.totalArea <= (this.$store.state.bau[this.$store.state.landscape_id].maxCropArea || 1))
            },

            /**
             * Return the remaining area in the landscape
             */
            remainingArea() {
                if(this.$store.state.bau[this.$store.state.landscape_id].maxCropArea === undefined)
                    return 0

                return Math.floor((this.$store.state.bau[this.$store.state.landscape_id].maxCropArea) - this.$store.state.totalArea)
            },

            /**
             * Shorthand for Vuex property store.state.landscapes[store.state.landscape_id].crops
             * @returns {Object, undefined}
             */
            crops() {
                return this.$store.state.landscapes[this.$store.state.landscape_id].crops
            },

            /**
             * Shorthand for Vuex property store.state.landscapes[store.state.landscape_id].livestock
             * @returns {Object, undefined}
             */
            livestock() {
                return this.$store.state.landscapes[this.$store.state.landscape_id].livestock
            },

            /**
             * Whether to display the LoadingOverlay (i.e. if BAU state not yet loaded)
             * @returns {boolean}
             */
            loading() {
                return (Object.keys(this.$store.state.bau[this.$store.state.landscape_id]).length === 0
                        && this.errorchecks)
            },

            /**
             * Check for error messages in messages
             */
            errorchecks() {
                for (let e of this.$store.state.messages)
                    if(e.kind === "error")
                        return false
                return true
            }
        },
        watch: {
            // We want to validate the form again if the backing data changes.
            // This happens when the Landscape Area is changed.
            crops() {
                this.$nextTick(() => this.validateForm())
            },
            livestock() {
                this.$nextTick(() => this.validateForm())
            }
        },
        mounted() {
            // On first load, the Ajax request for form data won't have yet returned,
            // so don't validate the form unless there's data in the store!
            if(Object.keys(this.$store.state.bau[this.$store.state.landscape_id]).length > 0)
                this.validateForm()
        }
    }
</script>

<style scoped>
  /* Sidenav */
  @media only screen and (min-width : 993px) {
    .sidenav {
      top: 65px;
      height: 100%;
      padding-bottom: 0;
    }
  }

  a.sidenav-trigger {
    position: absolute;
    color: white;
    font-size: 48px;
    line-height: 1.0;
    padding-left: 10px;
  }

  .sidenav li {
    line-height: 1rem;
    padding: 0 10px 0 10px;
  }

  .sidenav li:hover {
    background-color:#eee;
  }

  .sidenav li.no-hover:hover {
    background-color:#fff;
  }

  .sidenav button.btn {
    margin: 10px 0;
    width:  100%;
  }

  /* fix https://github.com/Dogfalo/materialize/issues/2112 using dummy element */
  .sidenav li:last-child {
    height:65px;
    background-color:#fff;
  }

  span.label {
    font-size: 0.8rem;
    color: #9e9e9e;
  }
  button {
    z-index:0
  }
</style>