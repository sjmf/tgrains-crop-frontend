/* Helper functions */

/***
 * Perform percentage difference on old data and new data
 * @param bau
 * @param new_data
 * @returns {{pesticideImpacts: [], production: [], nutritionaldelivery: *}}
 */
export function difference(bau, new_data) {
    let data = {
        production: [],
        pesticideImpacts: [],
        nutritionaldelivery: new_data['nutritionaldelivery'], // Nutri pie chart not diffed
        eatLancetPlate: new_data['eatLancetPlate']            // EAT Lancet plate not diffed
    }

    let fields = ['production', 'pesticideImpacts']
    for (let i of fields) {
        for (let j = 0; j < bau[i].length; j++) {
            //console.debug(i, j, new_data[i][j], bau[i][j])
            data[i][j] = ((new_data[i][j] / bau[i][j]) * 100) - 100
        }
    }
    return data
}

/***
 * Format data returned by model, ready for graphing or differencing
 * @param state
 * @param new_data
 * @returns {{pesticideImpacts: [], production: [], nutritionaldelivery: []}}
 */
export function formatData(state, new_data) {
    let data = {production: [], pesticideImpacts: [], nutritionaldelivery: [], eatLancetPlate: []}

    data['production'] = [
        new_data['greenhouseGasEmissions'],
        new_data['nLeach'],
        new_data['profit'],
        new_data['production']
    ]

    data['pesticideImpacts'] = [new_data['nLeach']].concat(new_data['pesticideImpacts'])
    data['nutritionaldelivery'] = new_data['nutritionaldelivery']
    // .map(x => Math.round(x*10000)/100)   // Round the float-point to 2dp
    data['eatLancetPlate'] = state.data[state.landscape_id].eatLancetPlate // Static. Does not change.

    return data
}

/**
 * Return a score for the distance of the state from BAU, plus an array of the changed values
 * sorted in descending order with the most different value first
 * @param state
 * @returns {{distance: number, changes: []}}
 */
export function distanceFromBAU(state) {
    const crops = state.landscapes[state.landscape_id].crops
    const lives = state.landscapes[state.landscape_id].livestock

    let sum = 0
    let changes = []

    const process = function (name, factor) {
        let dist = Math.abs(factor[name].bau - factor[name].value)
        sum += dist
        if (dist >= 1) changes.push({name, dist})
    }

    for (let name in crops)
        if(Object.hasOwnProperty.call(crops, name))
            process(name, crops)
    for (let name in lives)
        if(Object.hasOwnProperty.call(lives, name))
            process(name, lives)

    // Reverse sort
    changes.sort((a, b) => {
        if (a.dist > b.dist) return -1
        if (b.dist > a.dist) return 1
        return 0
    })

    return {
        distance: sum,
        changes: changes
    }
}