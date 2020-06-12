<template>
  <aside id="slide-out" class="sidenav sidenav-fixed">
    <!-- VALUE SELECT SIDEBAR -->
    <ul>

      <land-area-menu/>

      <li>
        <div class="divider"></div>
      </li>

      <!-- CROP AREAS -->
      <li id="crop-area-menu">
        <span class="subheader">Crop Areas</span>
      </li>

      <variable-row
        v-for="(item, index) in crops"
          v-bind:name="item.name"
          v-bind:label="item.label"
          v-bind:value="item.value"
          v-bind:key="index"/>

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
          v-bind:value="item.value"
          v-bind:disabled="item.disabled"
          v-bind:key="20+index"/>


      <li>
        <div class="divider"></div>
      </li>

      <li>
        <div class="row">
          <div class="col l6">
            <a class="waves-effect waves-light btn red">Reset values</a>
          </div>
          <div class="col l6">
            <a class="waves-effect waves-light btn green">Submit</a>
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

    export default {
        name: 'SidebarMenu',
        components: {LandAreaMenu, VariableRow},
        data: function (){
            return  {
                crops: [
                    { name:"wheat",       label: "Wheat",          value: 800, description: ""},
                    { name:"barley",      label: "Barley",         value: 230, description: ""},
                    { name:"oats",        label: "Oats",           value: 609, description: ""},
                    { name:"osr",         label: "Oilseed Rape",   value: 170, description: ""},
                    { name:"veg",         label: "Vegetables",     value: 853, description: ""},
                    { name:"maize",       label: "Maize",          value: 679, description: ""},
                    { name:"peas",        label: "Peas & Beans",   value: 563, description: ""},
                    { name:"potatoes",    label: "Potatoes",       value: 903, description: ""},
                    { name:"softfruit",   label: "Soft fruit",     value: 223, description: ""},
                    { name:"topfruit",    label: "Top fruit",      value: 396, description: ""},
                    { name:"sugarbeet",   label: "Sugar beet",     value: 514, description: ""},
                ],
                livestock: [
                    { name:"dairy",       label: "Dairy Cattle",   value: 541, description: ""},
                    { name:"beef",        label: "Beef Cattle",    value: 775, description: ""},
                    { name:"chicken",     label: "Chicken",        value: 746, description: ""},
                    { name:"pork",        label: "Pork",           value: 824, description: ""},
                    { name:"eggs",        label: "Egg Production", value: 481, description: ""},
                    { name:"lamblowland", label: "Lowland Lamb",   value: 638, description: ""},
                    { name:"lambupland",  label: "Upland Lamb",    value: 0  , description: "", disabled: ""},
                ]
            }
        }
    }
</script>