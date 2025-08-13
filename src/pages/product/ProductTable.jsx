import {
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "../../features/product/productSlice2";
import { Link } from "react-router";
import DataTable from "react-data-table-component";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

export default function Products() {
  const { data, isLoading } = useGetProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const [updateProduct] = useUpdateProductMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      await deleteProduct(id);
    }
  };

  const columns = [
    {
      name: "Thumbnail",
      selector: (row) =>
        row?.thumbnail ? (
          <img
            src={row.thumbnail}
            alt={row.name}
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          "No Image"
        ),
    },
    {
      name: "Name",
      selector: (row) => row?.name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row?.category?.name,
    },
    {
      name: "Price",
      selector: (row) => row?.priceOut + " $",
    },
    {
      name: "Stock",
      selector: (row) => row?.stockQuantity,
    },
    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="flex gap-2">
          <Link
            to={`/edit/${row.uuid}`}
            className="inline-flex h-[40px] px-3 items-center text-white rounded-md bg-emerald-500 transition-colors duration-300 hover:bg-emerald-600 gap-2 whitespace-nowrap"
          >
            <FiEdit size={18} />
            <span>Edit</span>
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleDelete(row?.uuid);
            }}
            className="inline-flex h-[40px] px-3 items-center text-white rounded-md bg-red-500 transition-colors duration-300 hover:bg-red-600 gap-2 whitespace-nowrap"
          >
            <FiTrash2 size={18} />
            <span>Delete</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Hide horizontal scrollbar track for DataTable */}
      <style>
        {`
          /* Hide horizontal scrollbar in WebKit browsers */
          .react-data-table-component__table-wrapper::-webkit-scrollbar {
            height: 0 !important;
            background: transparent !important;
          }
          /* Hide scrollbar in Firefox */
          .react-data-table-component__table-wrapper {
            scrollbar-width: none !important;
            -ms-overflow-style: none !important;
          }
        `}
      </style>

      <main className="max-w-screen-xl mx-auto container px-10">
        {/* Header: Title and Add Product button on same row */}
        <div className="flex items-center justify-between my-5">
          <h2 className="text-2xl font-semibold text-gray-700">All Products</h2>
          <Link
            to={`/add-product`}
            className="inline-flex h-[40px] items-center text-white rounded-md bg-emerald-500 transition-colors duration-300 hover:bg-emerald-600 px-4 gap-2"
          >
            <FiPlus size={20} />
            <span>Add Product</span>
          </Link>
        </div>

        <DataTable
          columns={columns}
          data={data?.content}
          pagination
          progressPending={isLoading}
        />
      </main>
    </>
  );
}
