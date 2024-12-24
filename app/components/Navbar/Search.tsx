import { FaSearch } from "react-icons/fa";
import useCart from "@/app/hooks/useCart";
const Search = () => {
  const { searchProducts } = useCart();
  return (
    <div className="flex md:w-72 lg:w-120 xl:w-[800px] items-center border border-gray-300 rounded-lg p-2 bg-white ">
      <FaSearch className="text-gray-500 mr-2 cursor-pointer" />
      <input onChange={(e) => searchProducts(e)}
        className="outline-none bg-transparent placeholder-gray-500 text-gray-700 w-full"
        type="text"
        placeholder="Ne arıyorsunuz?"
      />
    </div>
  )
}

export default Search