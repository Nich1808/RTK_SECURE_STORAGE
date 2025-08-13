import { createSlice } from '@reduxjs/toolkit'

// store state
const initialState = {
  value: 0,
  test: "testing"
}

// create action, define reducer
export const countSlice = createSlice({
    name: "count",
    initialState, 
    reducers: {
        increment: (state)=> {
          state.value += 1;
        }
    }
})


// export action
export const {increment} = countSlice.actions

// export reducer 
export default countSlice.reducer;