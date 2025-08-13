import React, { useState } from "react";
import { useCreateProductMutation } from "../../features/product/productSlice2";
import { useUploadFileMutation } from "../../features/file/fileSlice";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
const schema = z.object({
  title: z.string().nonempty("Title is required"),
  description: z.string().nonempty("Title is required"),
  price: z
    .number({ invalid_type_error: "Price must be a number" })
    .positive("Price must be greater than 0"),
  categoryId: z
    .number({ invalid_type_error: "Category Id must be a number" })
    .positive("Category Id must be greater than 0"),
});

export default function ProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      categoryId: "",
    },
  });
  const [createProduct, { isLoading }] = useCreateProductMutation();
  const [image, setImage] = useState(null); // use to store meta data
  const [preview, setPreview] = useState(null);
  const [uploadFile] = useUploadFileMutation();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    categoryId: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "categoryId" ? Number(value) : value,
    }));
  };
  const handleImagePreview = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    try {
      let imageUrls = [];
      
      if (image) {
        const imageForm = new FormData();
        imageForm.append("file", image);
        const res = await uploadFile(imageForm).unwrap();
        imageUrls = [res.location];
      }

      const submitData = {
        ...data,
        images:
          imageUrls.length > 0 ? imageUrls : ["https://placehold.co/600x400"],
      };

      await createProduct(submitData).unwrap();
    } catch (error) {
      console.error("Create failed:", error);
    }
  };

  return (
    <div className="m-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3 max-w-md mx-auto"
      >
        <div className="flex flex-col">
          <input
            {...register("title")}
            className="px-2.5 py-2.5 border border-slate-400 rounded-xl"
            placeholder="Title"
            onChange={handleChange}
            type="text"
            name="title"
          />
          {errors.title && (
            <p className="text-red-500">{errors.title.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <input
            {...register("description")}
            className="px-2.5 py-2.5 border border-slate-400 rounded-xl"
            placeholder="Description"
            onChange={handleChange}
            type="text"
            name="description"
          />
          {errors.description && (
            <p className="text-red-500">{errors.description.message}</p>
          )}
        </div>
        <div className="flex flex-col">
          <input
            {...register("price", { valueAsNumber: true })}
            className="px-2.5 py-2.5 border border-slate-400 rounded-xl"
            placeholder="Price"
            onChange={handleChange}
            type="text"
            name="price"
          />
          {errors.price && (
            <p className="text-red-500">{errors.price.message}</p>
          )}
        </div>{" "}
        <div className="flex flex-col">
          <input
            {...register("categoryId", { valueAsNumber: true })}
            className="px-2.5 py-2.5 border border-slate-400 rounded-xl"
            placeholder="Category ID"
            onChange={handleChange}
            type="text"
            name="categoryId"
          />
          {errors.categoryId && (
            <p className="text-red-500">{errors.categoryId.message}</p>
          )}
        </div>
        {preview != null && (
          <div class="flex items-center justify-center w-full">
            <label
              for="dropzone-file"
              class="flex rounded-2xl flex-col items-center justify-center w-64  h-64 border-2 border-gray-300 border-dashed  cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <img
                className=" w-64 rounded-2xl h-64 object-cover"
                src={preview}
              />
              <input
                onChange={(e) => handleImagePreview(e)}
                id="dropzone-file"
                type="file"
                class="hidden"
                accept="image/jpeg,image/png,image/webp,image/jpg"
              />
            </label>
          </div>
        )}
        {preview == null && (
          <div class="flex items-center justify-center w-full">
            <label
              for="dropzone-file"
              class="flex flex-col items-center justify-center w-64 rounded-2xl h-64 border-2 border-gray-300 border-dashed  cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p class="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span class="font-semibold">Click to upload</span> or drag and
                  drop
                </p>
              </div>
              <input
                onChange={(e) => handleImagePreview(e)}
                id="dropzone-file"
                type="file"
                class="hidden"
                accept="image/jpeg,image/png,image/webp,image/jpg"
              />
            </label>
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white cursor-pointer px-4 py-2 rounded"
        >
          {isLoading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
