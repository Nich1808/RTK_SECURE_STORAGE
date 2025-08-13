// RTK code
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// define handle state
export const initialState = {
  products: [],
  status: "idle"
};

// fetch data
export const getProduct = createAsyncThunk("products/getProduct", async () => {
  const data = await fetch("https://dummyjson.com/products").then((res) =>
    res.json()
  );

  return data;
});

// fetch data
export const getProductById = createAsyncThunk("products/getProduct", async () => {
  const data = await fetch("https://dummyjson.com/products").then((res) =>
    res.json()
  );

  return data;
});

// create slice
export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProduct.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.status = "success";
        state.products = action.payload.products;
      })
      .addCase(getProduct.rejected, (state) => {
        state.status = "failed";
      });
  }
});

// export action

// export reducer
export default productSlice.reducer;
