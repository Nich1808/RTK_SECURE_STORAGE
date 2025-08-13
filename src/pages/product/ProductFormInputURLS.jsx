import React from "react";
import { useCreateProductMutation } from "../../features/product/productSlice2";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const schema = z.object({
  name: z.string().nonempty("Name is required"),
  description: z.string().nonempty("Description is required"),
  stockQuantity: z
    .number()
    .int()
    .nonnegative("Stock quantity must be 0 or more"),
  priceIn: z.number().positive("Price In must be greater than 0"),
  priceOut: z.number().positive("Price Out must be greater than 0"),
  thumbnail: z.string().url("Thumbnail must be a valid URL"),
});

export default function ProductForm2() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      thumbnail: "",
    },
  });

  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const staticData = {
    computerSpec: {
      processor: "N/A",
      ram: "N/A",
      storage: "N/A",
      gpu: "N/A",
      os: "N/A",
      screenSize: "N/A",
      battery: "N/A",
    },
    discount: 0,
    color: [
      {
        color: "Fresh Green",
        images: [
          "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=500",
        ],
      },
    ],
    warranty: "5 Days Freshness Guarantee",
    availability: true,
    images: [
      "https://images.unsplash.com/photo-1604977042946-1eecc30f269e?w=800",
    ],
    categoryUuid: "dc071830-ce8a-40e2-ad51-3c1adeeb02cb",
    supplierUuid: "0980127a-dc6d-487d-b166-957bcda2540d",
    brandUuid: "8265f3c7-9aea-498c-88b2-9e1bacb4f716"
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        ...staticData,
      };
      const result = await createProduct(payload).unwrap();
      if (result) {
        toast.success("Product created successfully!", {
          position: "top-center",
          autoClose: 2000,
        });
        setTimeout(() => {
          navigate("/products");
        }, 2200);
      }
    } catch (error) {
      console.error("Failed to create product:", error);
      toast.error("❌ Failed to create product!", {
        position: "top-center",
      });
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto my-10 p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Create New Product
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div>
            <input
              {...register("name")}
              placeholder="Name"
              className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 mt-1 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <textarea
              {...register("description")}
              placeholder="Description"
              rows={3}
              className={`w-full border rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 mt-1 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <input
              {...register("stockQuantity", { valueAsNumber: true })}
              type="number"
              placeholder="Stock Quantity"
              min={0}
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
            <input
              {...register("priceIn", { valueAsNumber: true })}
              type="number"
              placeholder="Price In"
              className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                errors.priceIn ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.priceIn && (
              <p className="text-red-500 mt-1 text-sm">{errors.priceIn.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("priceOut", { valueAsNumber: true })}
              type="number"
              placeholder="Price Out"
              className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition ${
                errors.priceOut ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.priceOut && (
              <p className="text-red-500 mt-1 text-sm">{errors.priceOut.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("thumbnail")}
              type="url"
              placeholder="Thumbnail URL"
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
            disabled={isLoading}
            className={`w-full py-3 rounded-md text-white font-semibold transition ${
              isLoading
                ? "bg-emerald-300 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {isLoading ? "Creating..." : "Create Product"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
