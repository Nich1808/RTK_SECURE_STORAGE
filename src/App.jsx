// import "./App.css";
// import { useGetProductsQuery } from "./features/product/productSlice2";
// import CardProduct from "./components/card/card-product";
// import SkeletonCardProduct from "./components/card/skeleton-card-product";





// function App() {
//   const { data, isLoading } = useGetProductsQuery();
//   const array = [1, 2, 3, 4, 5, 6, 7, 8];

//   console.log("data from RTK Query", data);

//   return (
//     <>
//       <main className="max-w-screen-xl mx-auto">
//         <h1 className="text-3xl font-extrabold text-center text-teal-600 mb-8 tracking-tight">
//             welcome to our shop
//           </h1>
        
//         <section className="grid grid-cols-4 gap-5">
//           {isLoading &&
//             array.map((index) => <SkeletonCardProduct key={index} />)}
//           {/* product section */}
//           {!isLoading &&
//             data?.map((p, index) => (
//               <CardProduct
//                 key={index}
//                 thumbnail={p.images[0]}
//                 title={p.title}
//                 id={p.id}
//               />
//             ))}
//         </section>
//       </main>
//     </>
//   );
// }

// export default App;


import "./App.css";
import { useGetProductsQuery } from "./features/product/productSlice2";
import CardProduct from "./components/card/card-product";
import SkeletonCardProduct from "./components/card/skeleton-card-product";



function App() {
  const { data, isLoading } = useGetProductsQuery();
  const array = [1, 2, 3, 4, 5, 6, 7, 8];

  console.log("data from RTK Query", data);

  return (
    <>
      <main className="max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-extrabold text-center text-teal-600 mb-8 tracking-tight">
            welcome to our shop
          </h1>
        
        <section className="grid grid-cols-4 gap-5">
          {isLoading &&
            array.map((index) => <SkeletonCardProduct key={index} />)}
          {/* product section */}
          {!isLoading &&
            data?.content.map((p, index) => (
              <CardProduct
                key={index}
                thumbnail={p.thumbnail}
                title={p.name}
                id={p.uuid}
              />
            ))}
        </section>
      </main>
    </>
  );
}

export default App;
