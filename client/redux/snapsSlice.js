import { createSlice } from '@reduxjs/toolkit';

// MH - Sets the initial state to and empty array of snaps that correlate to and undefined user
const initialState = {
    snapsList: [],
    user_id: 0,
}

// MH - Declares a redux 'slice' with the name 'snaps', initial state set the previously defined initialState obj, and a reducer (where the business logic is performed)
const snapsSlice = createSlice({
    name: 'snaps',
    initialState,
    reducers: {
        // MH - setSnapsList reducer takes state and an action as args
        setSnapsList: (state, action) => {
            console.log("action here ", action)
            // MH - Resets the passed in state's snapsList to an empty array
            state.snapsList = [];

            // MH - When the SnapsContainer dispatches this action, it's sending the array of Snaps received from the SELECT query on the Snaps table in snapsController as the action.payload here.:
            for (let i = 0; i < action.payload.length; i++) {

                state.snapsList.push(action.payload[i]);
            }
            //! MH - I'm not sure what this is doing yet
            state.user_id = action.payload[0].user_id;
        },
    }
})

export const { setSnapsList } = snapsSlice.actions

export default snapsSlice.reducer