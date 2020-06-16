import axios from "axios"

import store from '../store';

export default {
    async queryModel () {
        const data = {
            landscapeId: store.state.landscapeID,
            crops: Object.values(store.state.crops).map( item => [item.name, item.value] ),
            livestock: Object.values(store.state.livestock).map( item => [item.name, item.value] )
        }

        const response = await axios.post(
            '/echo',
            data
        );
        console.log(response.data);
        store.commit("setData", response.data);
        return response.data;
    }
}