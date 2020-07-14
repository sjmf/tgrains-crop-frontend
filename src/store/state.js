export const initial_state = () => ({
    // Used for cache-busting Vuex state on version update
    versionHash: process.env.VUE_APP_GIT_HASH || 'undefined',

    // Landscape definitions
    landscape_id: 101,
    landscapeName: 'East Anglia',

    // Data used by chart.js to render graphs. Loaded via AJAX.
    data: {
        101: {
            // GHG, Nitrogen leaching, Profit, Calories
            production:           [0,0,0,0],
            // Nitrogen leaching, ground water, fish, birds, bees, beneficial arthropods
            pesticideImpacts:     [0,0,0,0,0,0],
            // Whole Grains, Tubers, Vegetables, Fruits, Dairy, Added Fats, Saturated Fats, Sugars, Animal Protein, Vegetable Protein
            nutritionaldelivery:  [0,0,0,0,0,0,0,0,0,0],
            // Stroke, Cancer, Heart Disease, Diabetes
            healthRiskFactors:    [0,0,0,0]
        },
        102: {
            // vue-chartjs doesn't really like loading undefined values. Breaks reactivity. Best define some.
            production:           [0,0,0,0],
            pesticideImpacts:     [0,0,0,0,0,0],
            nutritionaldelivery:  [10,10,10,10,10,10,10,10,10,10],
            healthRiskFactors:    [0,0,0,0]
        }
    },

    /*
     * Each landscape [101],[102] contains a crop and livestock data object {crops: {}, livestock: {}}
     * Within these, we store the string identifier (name), a string label (visually presented to the user),
     * the value of the crop, and an optional description.
     *    E.g.: peas: { name:"peas", label: "Peas & Beans", value: 800, description: ""}
     * These are bound to the VariableRow components in the SidebarMenu, and are used when submitting a Model query.
     */
    landscapes: {
        101: { },
        102: { }
    },

    // Business-as-usual state. Loaded via AJAX.
    bau: {
        101: { },
        102: { }
    },

    // Crop and livestock variable name strings. Loaded via AJAX. Used to populate SidebarMenu
    strings: {
        101: { },
        102: { }
    },

    // Name strings for landscapes
    landscapeNames: {
        101: "East Anglia",
        102: "South Wales"
    },

    // Dictionary used to look up labels from the variable name returned by the model
    dictionary: {
        // Crops
        all_wheat:      "Wheat",
        all_barley:     "Barley",
        all_oats:       "Oats",
        sugarbeet:      "Sugar Beet",
        osr_winter:     "Oilseed Rape",
        all_vegetables: "Vegetables",
        livestock:      "Livestock",
        maize:          "Maize",
        all_peas_beans: "Peas & Beans",
        all_potato:     "Potatoes",
        fruit_soft:     "Soft fruit",
        fruit_top:      "Top fruit",

        // Livestock
        dairy:          "Dairy Cattle",
        beef:           "Beef Cattle",
        cow:            "Beef Cattle",
        chicken:        "Chicken",
        pork:           "Pork",
        eggs:           "Egg Production",
        lamb_lowland:   "Lowland Lamb",
        lamb_upland:    "Upland Lamb",
    },

    // Descriptions used to format tooltips. Not all crop/livestock types need one.
    descriptions: {
        lamblowland: "Lowland Lamb grazing livestock",
        lambupland: "Upland Lamb grazing livestock. Found predominantly in the Brecon Beacons.",
    },

    // Error handling:
    error: {
        message: "",
        visible: false
    },

    // User has accepted the usage terms. Persistence means the modal won't be shown again.
    acceptedTerms: false
})

export default initial_state()