<template>
  <aside id="slide-out" class="sidenav sidenav-fixed">

    <loading-overlay :loading="loading"/>

    <!-- VALUE SELECT SIDEBAR -->
    <ul>
      <land-area-menu/>

      <li>
        <div class="divider"></div>
      </li>

      <li class="no-hover no-padding">
        <ul>
          <variable-group
              v-for="(elements, index) in orderedElements"
              :key="groups[index].name"
              :id="groups[index].name"
              :kind="groups[index].kind"
              :title="groups[index].title"
              :subtitle="groups[index].subtitle"
              :groups="groups[index].groups"
              :elements="elements"
              :errors="errors"
              :remaining="getRemainingArea"
              :crop-or-livestock="groups[index].name"
              :readonly="readonly"
              :reset-trigger="resetSignal"
              :show-header="true"
              :show-total="true"
              :show-total-collapsed-only="true"
              :default-collapsed="false"
              @change="valueChanged($event)"/>
        </ul>
      </li>

      <li>
        <div class="divider"></div>
      </li>

      <!-- RESET / SUBMIT BUTTONS -->
      <li class="no-hover">
        <div class="row">
          <div class="col l6">
            <button class="waves-effect waves-light btn red"
                    v-bind:class="{'disabled': resetDisabled}"
                    v-on:click="resetSidebar">Reset</button>
          </div>
          <div class="col l6">
            <button class="waves-effect waves-light btn green"
                    v-bind:disabled="submitDisabled"
                    v-on:click="submitForm">Submit</button>
          </div>

          <div class="col s12 readonly" v-if="readonly">
            <button class="btn btn-small green darken-2 waves-effect waves-green"
                    @click="$store.dispatch('cancelViewSession'); $store.commit('clearMessages')">
              <i class="material-icons right">backspace</i>Close and return
            </button>
            <p class="red-text">You are viewing an older session! Queries are currently disabled.</p>
          </div>
        </div>
      </li>

      <!-- Dummy list element to address https://github.com/Dogfalo/materialize/issues/2112 -->
      <li class="dummy"></li>
    </ul>
  </aside>
</template>

<script>
    import LandAreaMenu from "@/components/sidebar/LandAreaMenu.vue"
    import LoadingOverlay from "@/components/LoadingOverlay.vue";
    import VariableGroup from "@/components/sidebar/VariableGroup.vue";

    export default {
        name: 'SidebarMenu',
        components: {
            VariableGroup,
            LandAreaMenu,
            LoadingOverlay
        },
        data() {
            return {
                inner_submitDisabled: false,
                changes: false,
                errors: {},
                resetSignal: false
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
                    this.resetGroups()
                    this.$nextTick(() => this.validateForm())
                    this.changes = false
                }
                catch(err) {
                    this.$store.commit("raiseError", err)
                }
            },

            /**
             * Pass 'reset' signal down VariableGroup.vue instances (cascades)
             */
            resetGroups() {
              this.resetSignal = !this.resetSignal
            },

            /**
             * Emit an event requesting submission of the form via AJAX.
             */
            submitForm() {
                this.changes=true
                this.$store.dispatch('queryModel')
            },

            /**
             * Slider change handler
             * Commit the changed form value to the backing data store.
             * Because we're using Vuex, we do a $store.commit rather than using v-model.
             * @param event {id, name, value}
             */
            async valueChanged(event) {
                this.changes=true

                if(!isNaN(event['value'])) {
                  this.$store.commit('setFormValue', event)
                  await this.$store.dispatch('sumArea')
                }

                // Validate after the new value and area total are in the store, so that
                // an area over the maximum disables Submit straight away
                this.validateForm()
            },

            /**
             * Run form validation on each item in the sidebar backing data, checking for errors.
             * If errors are found, we disable the 'submit' button to prevent kicking off a model job with bad data.
             */
            validateForm() {
                for (let item in this.crops) {
                    if (Object.prototype.hasOwnProperty.call(this.crops, item)) {
                        this.errors[item] = this.checkErrors(this.crops[item].value)
                    }
                }

                for (let item in this.livestock) {
                    if (Object.prototype.hasOwnProperty.call(this.livestock, item)) {
                        this.errors[item] = this.checkErrors(this.livestock[item].value)
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
              return this.isUpland(name)
                ? (this.remainingUplandArea < this.remainingLowlandArea)
                  ? this.remainingUplandArea : this.remainingLowlandArea
                : this.remainingLowlandArea
            },
        },
        computed: {
          /**
           * Used by UI to check if the submit button should be disabled
           */
          submitDisabled: {
            get() {
              return this.inner_submitDisabled || this.readonly || this.$store.state.loading
            },
            set(val) {
              this.inner_submitDisabled = val
            }
          },

          /**
           * UI check if reset button should be disabled
           */
          resetDisabled() {
            return (!this.changes) || this.readonly || this.$store.state.loading
          },

          /**
           * Check if crop area is exceeded
           */
          areaExceeded() {
            return ! (
                this.$store.state.area.lowland <=
                (this.$store.state.bau[this.$store.state.landscape_id].maxCropArea || 1)
            )
          },

          /**
           * Return the remaining area in the landscape
           */
          remainingLowlandArea() {
            let maxLowland = this.$store.state.bau[this.$store.state.landscape_id].maxCropArea
            if(maxLowland === undefined) return 0
            return Math.floor(maxLowland - this.$store.state.area.lowland)
          },

          /**
           * Return the remaining area in the landscape
           */
          remainingUplandArea() {
            let maxUpland = this.$store.state.bau[this.$store.state.landscape_id].maxUplandArea
            if(maxUpland === undefined) return 0
            let remaining = Math.floor(maxUpland - this.$store.state.area.upland)
            return remaining > 0 ? remaining : 0 // Clamp to zero if exceeded
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
          },

          /**
           * Sidebar groups shortcut
           */
          groups() {
            return this.$store.state.sidebar_groups
          },

          /**
           * Compute an ordering for the sidebar elements
           */
          orderedElements() {
            const rows = { ...this.crops, ...this.livestock }

            // Define a recursion to tree-walk groups and populate data
            const mkgrps = function(_groups, data) {
              for (let i in _groups) {
                if(data.length < i+1)
                  data.push([])

                if (_groups[i]['groups'] !== undefined)
                  data[i] = mkgrps(_groups[i].groups, data[i])

                for (let e of _groups[i].elements)
                  if(rows[e] !== undefined)
                    data[i].push(rows[e])
              }

              return data
            }

            return mkgrps(this.groups, [])
          }
        },
        watch: {
          /**
           * Validate the form again if the backing data changes.
           * This happens when the Landscape Area is changed.
           */
          crops() {
            this.$nextTick(() => this.validateForm())
          },

          // Both crops and livestock change at the same time, so we don't need to re-validate
          // livestock() { this.$nextTick(() => this.validateForm()) },

          /**
           * Init $_Materialize tooltips when landscapes loaded after BAU
           */
          landscapes(){
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

  .sidenav li.no-hover:hover {
    background-color:#fff;
  }

  .sidenav button.btn {
    margin: 10px 0;
    width:  100%;
  }

  /* Fix https://github.com/Dogfalo/materialize/issues/2112 using dummy element */
  .sidenav li:last-child.dummy {
    height:65px;
    background-color:#fff;
  }

  button {
    z-index:0
  }

  .readonly p {
    line-height: 2rem;
    margin: 4px 0;
  }
</style>

<style>
  a.sidenav-trigger {
    position: absolute;
    color: white;
    font-size: 48px;
    line-height: 1.0;
    padding-left: 10px;
  }
</style>