import React from "react";
import { Link } from "react-router";

export default function CardProduct({ thumbnail, title, id }) {
  return (
    <>
      {/*<!-- Component: Basic image card --> */}
      <Link
        to={`/products/${id}`}
        className="overflow-hidden rounded bg-white text-slate-500 shadow-md shadow-slate-200"
      >
        {/*  <!--  Image --> */}
        <figure>
          <img
            src={thumbnail}
            alt="card image"
            className="aspect-video w-full object-cover h-[280px]"
          />
        </figure>
        {/*  <!-- Body--> */}
        <div className="p-6">
          <header className="">
            <h3 className="text-xl font-medium text-slate-700">{title}</h3>
          </header>
        </div>
      </Link>
      {/*<!-- End Basic image card --> */}
    </>
  );
}
