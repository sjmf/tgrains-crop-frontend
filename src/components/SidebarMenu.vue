<template>
  <aside id="slide-out" class="sidenav sidenav-fixed">
    <!-- VALUE SELECT SIDEBAR -->
    <ul>

      <land-area-menu v-on="$listeners"/>

      <li>
        <div class="divider"></div>
      </li>

      <!-- CROP AREAS -->
      <li id="crop-area-menu">
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
          @input="updateValue('crops', item.name, $event)"/>

      <li>
        <div class="divider"></div>
      </li>

      <!-- LIVESTOCK NUMBERS -->
      <li id="livestock-areas-menu">
        <span class="subheader">Livestock Areas</span>
      </li>

      <variable-row
          v-for="(item, index) in livestock"
          v-bind:name="item.name"
          v-bind:label="item.label"
          v-bind:key="20+index"
          v-bind:value="item.value"
          v-bind:description="item.description"
          @input="updateValue('livestock', item.name, $event)"/>


      <li>
        <div class="divider"></div>
      </li>

      <li>
        <div class="row">
          <div class="col l6">
            <button class="waves-effect waves-light btn red"
               v-on:click="resetToBAU">Reset values</button>
          </div>
          <div class="col l6">
            <button class="waves-effect waves-light btn green"
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

    import store from '../store';

    export default {
        name: 'SidebarMenu',
        components: {LandAreaMenu, VariableRow},
        props: {
            loading: Boolean
        },
        methods: {
            resetToBAU() {
                store.commit("closeError")
                store.commit("resetToBAU")
            },
            submitForm() {
                this.$emit('submitForm', [this.crops,this.livestock]);
            },
            updateValue: function (cropOrLivestock, name, value) { // {cropOrLivestock, name, value}
                this.$store.commit('setFormValue', {cropOrLivestock, name, value});
            }
        },
        computed: {
            crops() {
                return store.state.landscapes[store.state.landscape_id].crops
            },
            livestock() {
                return store.state.landscapes[store.state.landscape_id].livestock
            }
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
</style>