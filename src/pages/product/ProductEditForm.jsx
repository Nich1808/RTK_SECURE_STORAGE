import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../features/product/productSlice2";
import { useNavigate, useParams } from "react-router";

const schema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  stockQuantity: z
    .number()
    .int()
    .nonnegative("Stock quantity must be 0 or more"),
  priceOut: z.number().nonnegative("Price must be positive"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
});

export default function ProductEditForm() {
  const { id } = useParams(); // Get product id 
  const navigate = useNavigate();

  // Fetch existing product 
  const { data: product, isLoading } = useGetProductByIdQuery(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        stockQuantity: product.stockQuantity,
        priceOut: product.priceOut,
        thumbnail: product.thumbnail,
      });
    }
  }, [product, reset]);

  const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();

  const staticData = {
    priceIn: 1,
    discount: product?.discount,
    color: [
      {
        color: "string",
        images: ["string"],
      },
    ],
    warranty: product?.warranty,
    availability: true,
    categoryUuid: product?.category?.uuid,
    supplierUuid: product?.supplier?.uuid,
    brandUuid: product?.brand?.uuid,
  };

  const onSubmit = async (formData) => {
    try {
      await updateProduct({ id, ...staticData, ...formData }).unwrap();
      navigate("/products");
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Edit Product
      </h2>

      <div>
        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
          Name
        </label>
        <input
          id="name"
          {...register("name")}
          placeholder="Product name"
          className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-gray-700 font-medium mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description")}
          placeholder="Product description"
          rows={4}
          className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition resize-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.description && (
          <p className="text-red-500 mt-1 text-sm">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="stockQuantity"
            className="block text-gray-700 font-medium mb-1"
          >
            Stock Quantity
          </label>
          <input
            id="stockQuantity"
            {...register("stockQuantity", { valueAsNumber: true })}
            type="number"
            placeholder="0"
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
              errors.stockQuantity ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.stockQuantity && (
            <p className="text-red-500 mt-1 text-sm">
              {errors.stockQuantity.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="priceOut"
            className="block text-gray-700 font-medium mb-1"
          >
            Price Out ($)
          </label>
          <input
            id="priceOut"
            {...register("priceOut", { valueAsNumber: true })}
            type="number"
            step="any"
            placeholder="0.00"
            className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
              errors.priceOut ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.priceOut && (
            <p className="text-red-500 mt-1 text-sm">{errors.priceOut.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="thumbnail"
          className="block text-gray-700 font-medium mb-1"
        >
          Thumbnail URL
        </label>
        <input
          id="thumbnail"
          {...register("thumbnail")}
          placeholder="https://example.com/image.jpg"
          className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
            errors.thumbnail ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.thumbnail && (
          <p className="text-red-500 mt-1 text-sm">{errors.thumbnail.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={updating}
        className={`w-full py-3 rounded-md text-white font-semibold transition ${
          updating
            ? "bg-emerald-300 cursor-not-allowed"
            : "bg-emerald-600 hover:bg-emerald-700"
        }`}
      >
        {updating ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
}
