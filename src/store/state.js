import {createUniqueID} from "@/store/helpers";

export const initial_state = () => ({
    // Used for cache-busting Vuex state on version update
    versionHash: process.env.VUE_APP_GIT_HASH || 'undefined',

    // Landscape definitions
    landscape_id: 101,
    landscapeName: 'East Anglia',

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

    // Name strings for landscapes
    landscapeNames: {
        101: "East Anglia",
        102: "South Wales"
    },

    // Calculated sum of all crop Areas:
    area: {
        lowland: 0,
        upland: 0,
        total: 0
    },

    // Data used by chart.js to render graphs. Loaded via AJAX.
    data: {
        101: {
            // GHG, Profit, Calories
            production:           [0,0,0],
            // Nitrogen leaching, ground water, fish, birds, bees, beneficial arthropods
            pesticideImpacts:     [0,0,0,0,0,0],
            // Whole Grains, Tubers, Vegetables, Fruits, Dairy, Added Fats, Saturated Fats, Sugars, Animal Protein, Vegetable Protein
            nutritionaldelivery:  [10,10,10,10,10,10,10,10,10],
            // EAT Lancet plate in same order as nutritionalDelivery
            eatLancetPlate:       [32.4, 1.6, 6.1, 6.0, 23.0, 17.9, 4.8, 3.1, 5.0],
        },
        102: {
            // vue-chartjs doesn't really like loading undefined values. Breaks reactivity. Best define some.
            production:           [0,0,0,0],
            pesticideImpacts:     [0,0,0,0,0,0],
            nutritionaldelivery:  [10,10,10,10,10,10,10,10,10],
            eatLancetPlate:       [32.4, 1.6, 6.1, 6.0, 23.0, 17.9, 4.8, 3.1, 5.0],
        },
        // Raw data loaded from server
        raw: {
            101: {},
            102: {}
        }
    },

    // History state stack
    history: [],
    historyIndex: 0,

    // Sessions data structure
    // {id: 'unique ID from server', count: 10, opened: Date.now(), history: []},
    sessions: {
        101:[ ],
        102:[ ]
    },
    sessionIndex: 0,

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

    // Dictionary used to look up labels from the variable name returned by the model
    dictionary: {
        // Crops
        all_wheat:      "Wheat",
        all_barley:     "Barley",
        all_oats:       "Oats",
        sugarbeet:      "Sugar Beet",
        osr_winter:     "Oilseed Rape",
        all_vegetables: "Vegetables",
        maize:          "Maize",
        all_peas_beans: "Peas & Beans",
        all_potato:     "Potatoes",
        fruit_soft:     "Soft fruit",
        fruit_top:      "Top fruit",
        all_feed:       "Animal feed",

        // Livestock
        dairy:          "Dairy Cattle",
        beef_lowland:   "Beef Cattle",
        all_beef:       "Beef Cattle",
        chicken:        "Chicken",
        pork:           "Pork",
        eggs:           "Egg Production",
        lamb_lowland:   "Lamb",
        all_lamb:       "Lamb"
    },

    upland_strings: [
       "all_beef",
       "all_lamb"
    ],

    // Dictionary used to look up labels for food group pie charts
    food_groups_dictionary: {
        // Food Groups
        whole_grain:    "Whole Grains",
        starchy_veg:    "Tubers",
        dairy:          "Dairy",
        animal_protein: "Animal Protein",
        plant_protein:  "Plant Protein",
        fat:            "Added fats",
        sugar:          "Added sugars",
        vegetable:      "Vegetables",
        fruit:          "Fruits",
    },

    // Descriptions used to format tooltips. Not all crop/livestock types need one.
    descriptions: {
        fruit_soft:   "Soft fruit grows on ground plants and bushes, e.g. raspberries and strawberries",
        fruit_top:    "Top fruit grows on trees: apples, pears, plums and cherries grow well in the UK",
        lamb_lowland: "Lowland Lamb are grazing livestock kept in enclosed fields (i.e. not on hills)",
        lamb_upland:  "Upland Lamb graze hills and mountains. Found predominantly in the Brecon Beacons",
        all_beef:     "Beef cattle will be split between uplands and lowlands at a pre-defined percentage",
        all_lamb:     "Lamb will be split between uplands and lowlands at a pre-defined percentage",
    },

    // Groups (and sub-groups) used in the sidebar
    sidebar_groups: [
        {
            name: 'crops',
            title: 'Crop Areas',
            subtitle: "All areas are measured in hectares (<strong>ha</strong>).",
            groups: [
                {
                    name: 'cereals',
                    title: 'Cereals',
                    elements: [ 'all_barley', 'all_oats', 'maize', 'all_wheat' ]
                },
                {
                    name: 'fruit',
                    title: 'Fruit',
                    elements: [ 'fruit_soft', 'fruit_top' ]
                }
            ],
            elements: [ 'osr_winter', 'all_vegetables', 'all_peas_beans', 'all_potato', 'all_feed', 'sugarbeet' ]
        },
        {
            name: 'livestock',
            title: 'Livestock Areas',
            elements: [ 'beef_lowland', 'all_beef', 'lamb_lowland', 'all_lamb', 'dairy', 'chicken', 'pork', 'eggs' ]
        },
    ],

    // Populations (retrieved from Wikipedia. More accurate ones needed)
    population: {
        101: 6235000,
        102: 2200000
    },

    // Comments retrieved from the server
    comments: {
        comments: {},
        page: 1,
        size: 4,
        filter: 0,
        sort: 0,
        length: 0,
    },

    // User details
    user: {
        name: '',
        email: '',
        id: createUniqueID(),
    },

    // TAB10 colors for charts to aid colorblind use
    chartColors: {
        opaque: [
            'rgba( 31, 119, 180, 1)',  // blue
            'rgba(255, 127,  14, 1)',  // orange
            'rgba( 44, 160,  44, 1)',  // green
            'rgba(214,  39,  40, 1)',  // red
            'rgba(148, 103, 189, 1)',  // purple
            'rgba(140,  86,  75, 1)',  // brown
            'rgba(227, 119, 194, 1)',  // pink
            'rgba(188, 189,  34, 1)',  // lime
            'rgba( 23, 190, 207, 1)',  // turquoise
            'rgba(127, 127, 127, 1)',  // grey
        ],
        translucent: [
            'rgba( 31, 119, 180, .3)',  // blue
            'rgba(255, 127,  14, .3)',  // orange
            'rgba( 44, 160,  44, .3)',  // green
            'rgba(214,  39,  40, .3)',  // red
            'rgba(148, 103, 189, .3)',  // purple
            'rgba(140,  86,  75, .3)',  // brown
            'rgba(227, 119, 194, .3)',  // pink
            'rgba(188, 189,  34, .3)',  // lime
            'rgba( 23, 190, 207, .3)',  // turquoise
            'rgba(127, 127, 127, .3)',  // grey
        ]
    },

    // Tag group colours
    tag_groups: {
        '-2':{ colour: "green darken-2" },
        '-1':{ colour: "deep-purple"    },
        0: { colour: "blue lighten-1"   },
        1: { colour: "brown lighten-1"  },
        2: { colour: "green lighten-1"  },
        3: { colour: "amber darken-1"   },
        4: { colour: "purple lighten-2" },
        5: { colour: "red lighten-2"    },
    },

    // Tag data
    tags: {
        // Mapping of tag group IDs to tag IDs
        groups: {},

        // An object list of tags
        tags: [],

        // Tag mappings from variable name to tag id
        mapping: {
            // Crops
            all_wheat:      36,
            all_barley:     34,
            all_oats:       32,
            sugarbeet:      33,
            osr_winter:     38,
            all_vegetables: 37,
            maize:          35,
            all_peas_beans: 31,
            all_potato:     39,
            fruit_soft:     30,
            fruit_top:      40,
            all_feed:       41,

            // Livestock
            dairy:          42,
            all_beef:       43,
            beef_lowland:   43,
            chicken:        44,
            pork:           45,
            eggs:           46,
            lamb_lowland:   47,
            all_lamb:       47,
        },
    },

    // Global read-only flag
    readonly: false,

    // Global loading flag
    loading: false,

    // Error handling: each element contains the following structure:
    // {
    //     message: "",
    //     kind: 'error' | 'warning' | 'info' | 'success'
    // },
    messages: [],

    // Max messages to show in UI
    maxMessages: 3,

    // User has accepted the usage terms. Persistence means the modal won't be shown again.
    acceptedTerms: false
})

export default initial_state()