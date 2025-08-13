// RTK query
import { apiSlice } from "../api/apiSlice";

// NOTE: these are the _SAME_ API reference!
const productApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query({
      query: () => ({
        url: "/products",
        method: "GET",
      }),
    }),
    getProductById: build.query({
      query: (id) => ({
        url: `/products/${id}`,
        method: "GET",
      }),
    }),
    createProduct: build.mutation({
      query: (productData) => ({
        url: `/products`,
        method: "POST",
        body: productData,
      }),
    }),
    deleteProduct: build.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
    }),
    updateProduct: build.mutation({
      query: ({ id, ...patch }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Products"], 
    }),
  }), 
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = productApi;


