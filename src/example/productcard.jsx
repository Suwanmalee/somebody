function ProductCard({ product, onAddToCart }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/400x300/CCCCCC/777?text=ไม่พบรูปภาพ'; }}
      />
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
        <p className="text-gray-500 text-sm mt-1 mb-3">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-gray-900">฿{product.price.toFixed(0)}</p>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-green-500 text-white py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 hover:bg-green-600 active:scale-95 shadow-md hover:shadow-lg"
          >
            <IconShoppingCart size={18} />
            เพิ่ม
          </button>
        </div>
      </div>
    </div>
  );
}
