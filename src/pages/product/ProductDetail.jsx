import React from "react";
import { useParams } from "react-router";
import { useGetProductByIdQuery } from "../../features/product/productSlice2";
import { FaStar } from "react-icons/fa";
import { FaStarHalf } from "react-icons/fa";

export default function ProductDetail() {
  const { id } = useParams();
  const { data, isLoading } = useGetProductByIdQuery(id);
  return (
    <>
      {isLoading ? (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start animate-pulse">
          <div>
            <div className="h-4 w-32 bg-gray-300 rounded mb-3"></div>
            <div className="h-8 w-3/4 bg-gray-300 rounded mb-4"></div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-5 w-5 bg-gray-300 rounded"></div>
                ))}
              </div>
              <div className="h-4 w-16 bg-gray-300 rounded"></div>
            </div>

            <div className="h-20 w-full bg-gray-300 rounded mb-4"></div>
            <div className="h-8 w-24 bg-gray-300 rounded mb-6"></div>
            <div className="h-12 w-full bg-gray-300 rounded"></div>
          </div>

          <div className="flex gap-4">
            <div className="w-2/3 h-72 bg-gray-300 rounded-lg shadow-md"></div>

            <div className="flex flex-col gap-4 w-1/3">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="h-20 w-full bg-gray-300 rounded-lg shadow"
                ></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div>
            <p className="text-sm text-blue-500 uppercase tracking-wide mb-2">
              {data?.category?.name}
            </p>

            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {data?.name}
            </h1>

            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1 text-yellow-500 text-lg">
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStarHalf />
              </div>
              <p className="text-sm text-gray-600">22 Reviews</p>
            </div>

            <p className="text-gray-700 leading-relaxed mb-3">
              {data?.description}
            </p>
            <p className="text-3xl font-bold text-teal-500">
              $ {data?.priceOut}
            </p>
            <button className="w-[100%] text-white rounded-2xl p-3 mt-5 bg-teal-500 ">
              Add To Card
            </button>
          </div>

          <div className="flex gap-4">
            <img
              src={data?.thumbnail}
              alt={data?.nme}
              className="w-2/3 h-auto object-cover rounded-lg shadow-md"
            />

            <div className="flex flex-col gap-4 w-1/3">
              {data?.images?.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`Image ${index + 1}`}
                  className="h-20 w-full object-cover rounded-lg shadow"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
