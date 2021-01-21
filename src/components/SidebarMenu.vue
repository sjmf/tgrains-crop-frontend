<template>
  <aside id="slide-out" class="sidenav sidenav-fixed">

    <loading-overlay :loading="loading"/>

    <!-- VALUE SELECT SIDEBAR -->
    <ul>
      <land-area-menu v-on="$listeners"/>

      <li>
        <div class="divider"></div>
      </li>

      <li class="no-hover no-padding">
        <ul class="collapsible collapsible-accordion">

          <!-- CROP AREAS -->
          <li class="active">
            <div class="collapsible-header">
              <div class="subheader">
                Crop Areas

                <transition name="rotate">
                  <i class="drop-arrow material-icons right">arrow_drop_up</i>
                </transition>
              </div>
              <span class="label">All areas are measured in hectares (<strong>ha</strong>).</span>
            </div>

            <div class="collapsible-body">
              <ul>
                <variable-row
                    v-for="(item, index) in crops"
                    :key="index"
                    :name="item.name"
                    :label="item.label"
                    :value="item.value"
                    :bau-value="item.bau"
                    :description="item.description"
                    :error-message="errors[index]"
                    :remaining-area="remainingLowlandArea"
                    :readonly="readonly"
                    @input="updateValue('crops', item.name, $event)"
                    @change="valueChanged($event)"/>
              </ul>
            </div>
          </li>

          <li class="active">

            <!-- LIVESTOCK AREAS -->
            <div class="collapsible-header">
              <div class="no-hover">
                <div class="subheader">
                  Livestock Areas
                  <i class="drop-arrow material-icons right">arrow_drop_up</i>
                </div>
              </div>
            </div>

            <div class="collapsible-body">
              <ul>
                <variable-row
                    v-for="(item, index) in livestock"
                    :key="index"
                    :name="item.name"
                    :label="item.label"
                    :value="item.value"
                    :bau-value="item.bau"
                    :description="item.description"
                    :error-message="errors[index]"
                    :remaining-area="getRemainingArea(item.name)"
                    :readonly="readonly"
                    @input="updateValue('livestock', item.name, $event)"
                    @change="valueChanged($event)"/>
              </ul>
            </div>
          </li>
        </ul>
      </li>

      <li>
        <div class="divider"></div>
      </li>

      <li class="no-hover">
        <div class="row">
          <div class="col l6">
            <button class="waves-effect waves-light btn red"
                    v-bind:class="{'disabled': (!this.changes) || this.readonly}"
                    v-on:click="resetSidebar">Reset</button>
          </div>
          <div class="col l6">
            <button class="waves-effect waves-light btn green"
                    v-bind:disabled="submitDisabled  || this.readonly"
                    v-on:click="submitForm">Submit</button>
          </div>

          <div class="col s12" v-if="readonly">
            <p class="red-text">You are viewing an older session!<br/>Model queries are currently disabled.</p>
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
        components: {
            LandAreaMenu,
            VariableRow,
            LoadingOverlay
        },
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
            resetSidebar() {
                try {
                    if(!this.changes) return
                    this.$store.dispatch('resetState')
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
                this.changes=true
                this.$emit('submitForm', [this.crops,this.livestock])
            },

            /**
             * Commit the changed form value to the backing data store.
             * Because we're using Vuex, we do a $store.commit rather than using v-model.
             * @param cropOrLivestock
             * @param name
             * @param value
             */
            updateValue(cropOrLivestock, name, value) {
                this.$store.commit('setFormValue', {cropOrLivestock, name, value})
                this.$store.dispatch('sumArea')
            },

            /***
             * Slider change handler
             */
            valueChanged(event) {
                this.changes=true
                this.validateForm(event)
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
                this.submitDisabled =  this.areaExceeded
                                       || !Object.entries(this.errors).every(x=>x[1]===false)
            },

            /**
             * Set changes to true when history loaded
             */
            historyLoaded() {
                this.changes = true
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


            /**
             * Initialize Materialize Tooltips
             *
             * Called from two places: firstly, on page load (for when BAU is already in Vuex). Secondly,
             *   in response to the @loaded event from SidebarMenu when sidebar BAU first-load is ready.
             */
            initialiseTooltips() {
                // Initialise tooltips (if landscape is loaded)
                if (Object.keys(this.$store.state.landscapes[this.$store.state.landscape_id]).length) {
                    // Wait for next tick to run init (it doesn't work without this)
                    this.$nextTick(() => {
                        this.$_M.Tooltip.init(
                            document.querySelectorAll(".sidenav li.variable-row[data-tooltip]:not([data-tooltip=''])")
                        )
                    })
                }
            },

            /**
             * Return true if area label is an upland one, false otherwise
             */
            isUpland(label) {
              return this.$store.state.upland_strings.indexOf(label) >= 0
            },

            /**
             * Return the remaining area for the given label (upland or lowland sensitive)
             */
            getRemainingArea(name) {
              // console.debug(
              //     'remainingUplandArea\t', this.remainingUplandArea,
              //     '\nremainingLowlandArea\t', this.remainingLowlandArea,
              //     '\n+ equals\t\t', this.remainingUplandArea + this.remainingLowlandArea)

              return this.isUpland(name)
                  ? this.remainingUplandArea + this.remainingLowlandArea
                  : this.remainingLowlandArea
            }
        },
        computed: {
          /**
           * Check if crop area is exceeded
           */
          areaExceeded() {
            const maxUpland = this.$store.state.bau[this.$store.state.landscape_id].maxUplandArea
            const maxLowland = this.$store.state.bau[this.$store.state.landscape_id].maxCropArea
            const upland = this.$store.state.area.upland
            const lowland = this.$store.state.area.lowland

            // console.debug(
            //     'upland / lowland\t',         upland, '/', lowland,
            //     '\nmaxUpland / maxLowland\t', maxUpland, '/', maxLowland,
            //     '\nArea Exceeded?\t\t',       ! (upland <= maxUpland && lowland <= maxLowland)
            // )

            return ! (upland <= maxUpland && lowland <= maxLowland)
          },

          /**
           * Return the remaining area in the landscape
           */
          remainingLowlandArea() {
            let maxLowland = this.$store.state.bau[this.$store.state.landscape_id].maxCropArea

            // console.debug('lowland ',
            //     '\nmaxLowland\t', maxLowland,
            //     '\nsumArea lowland\t', this.$store.state.area.lowland,
            //     '\n- equals\t', maxLowland - this.$store.state.area.lowland)

            if(maxLowland === undefined)
              return 0

            return Math.floor(maxLowland - this.$store.state.area.lowland)
          },

          /**
           * Return the remaining area in the landscape
           */
          remainingUplandArea() {
            let maxUpland = this.$store.state.bau[this.$store.state.landscape_id].maxUplandArea

            // console.debug('upland',
            //     '\nmaxUpland\t', maxUpland,
            //     '\nsumArea upland\t', this.$store.state.area.upland,
            //     '\n- equals\t', maxUpland - this.$store.state.area.upland)

            if(maxUpland === undefined)
              return 0

            let remaining = Math.floor(maxUpland - this.$store.state.area.upland)

            // Clamp to zero if exceeded
            return remaining > 0 ? remaining : 0
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
             * Return Landscape (used by watcher)
             * @returns {Object, undefined}
             */
            landscapes() {
                return this.$store.state.landscapes[this.$store.state.landscape_id]
            },

            /**
             * Whether to display the LoadingOverlay (i.e. if BAU state not yet loaded)
             * @returns {boolean}
             */
            loading() {
                return (Object.keys(this.$store.state.bau[this.$store.state.landscape_id]).length === 0
                        && this.errorChecks)
            },

            /**
             * Is the Global read-only flag set?
             */
            readonly() {
                return this.$store.state.readonly
            },

            /**
             * Check for error messages in messages
             */
            errorChecks() {
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
            },
            landscapes(){
                // Materialize tooltips when landscapes loaded after BAU
                this.initialiseTooltips()
            }
        },
        mounted() {
            // On first load, the Ajax request for form data won't have yet returned,
            // so don't validate the form unless there's data in the store!
            if(Object.keys(this.$store.state.bau[this.$store.state.landscape_id]).length > 0)
                this.validateForm()

            // On page reload, check the history to see if we need to enable the 'reset' button
            if(this.$store.state.history.length > 0)
                if(this.$store.state.history[this.$store.state.historyIndex].changes.distance !== 0)
                    this.changes = true

            // Initialise sidebar
            this.$_M.Sidenav.init(document.querySelectorAll(".sidenav"))
            this.$_M.Collapsible.init(document.querySelector(".sidenav .collapsible"),{
              accordion: false
            })

            // Materialize tooltips when landscapes loaded from Vuex on reload
            this.initialiseTooltips()
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

  .collapsible-body ul > li {
    padding: 0 10px;
  }

  .collapsible li i.drop-arrow {
    transform: rotate(180deg);
  }

  .collapsible li.active i.drop-arrow {
    color: rgba(0, 0, 0, 0.87);
    transform: rotate(0deg);
  }

  .rotate-move {
    transition: rotate 1s;
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
  .sidenav li:last-child.dummy {
    height:65px;
    background-color:#fff;
  }

  .label {
    font-size: 0.8rem;
    color: #9e9e9e;
  }
  button {
    z-index:0
  }
</style>