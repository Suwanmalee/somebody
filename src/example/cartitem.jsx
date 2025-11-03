// --- Cart Item Component (sub-component for Cart) ---
function CartItem({ item, onAdd, onRemove, onClear }) {
  return (
    <div className="flex items-center gap-4 group">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg'; }}
      />
      <div className="flex-grow min-w-0">
        <h4 className="font-semibold text-gray-800 truncate">{item.name}</h4>
        <p className="text-sm text-gray-600">฿{item.price.toFixed(0)}</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button 
          onClick={() => onRemove(item)}
          className="p-1 rounded-full text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
          aria-label="ลบ 1 ชิ้น"
        >
          <IconMinus size={14} />
        </button>
        <span className="font-medium w-6 text-center text-gray-800" aria-label="จำนวน">{item.quantity}</span>
        <button 
          onClick={() => onAdd(item)}
          className="p-1 rounded-full text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
          aria-label="เพิ่ม 1 ชิ้น"
        >
          <IconPlus size={14} />
        </button>
      </div>
      <button 
        onClick={() => onClear(item)} 
        className="text-gray-400 transition-colors hover:text-red-500 opacity-0 group-hover:opacity-100"
        title="ลบทั้งหมดออกจากตะกร้า"
        aria-label="ลบทั้งหมดออกจากตะกร้า"
      >
        <IconTrash size={18} />
      </button>
    </div>
  );
}
