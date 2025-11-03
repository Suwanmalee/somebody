function Cart({ cartItems, totalItems, totalPrice, onAddToCart, onRemoveFromCart, onClearItem, onShowModal }) {
  
  const handleCheckout = () => {
    // Use the custom modal instead of alert()
    onShowModal(`ยอดรวม: ฿${totalPrice.toFixed(0)}\nขอบคุณที่ใช้บริการ!`);
    
    // In a real app, you would also clear the cart after a successful checkout
    // setCart([]); 
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
        <IconShoppingCart size={24} />
        ตะกร้าของคุณ ({totalItems} ชิ้น)
      </h2>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png?20251010093853" alt="Empty Cart" className="mx-auto rounded-full" />
          <p className="text-gray-500 text-lg mt-4">ตะกร้าของคุณว่างเปล่า</p>
          <p className="text-gray-400 text-sm">เพิ่มรายการจากเมนูเพื่อเริ่มต้น</p>
        </div>
      ) : (
        <>
          {/* Cart Items List */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 -mr-2">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onAdd={onAddToCart}
                onRemove={onRemoveFromCart}
                onClear={onClearItem}
              />
            ))}
          </div>
          
          {/* Cart Total */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center text-lg font-semibold text-gray-700">
              <span>ยอดรวมย่อย</span>
              <span>฿{totalPrice.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 mt-1">
              <span>ภาษีและค่าธรรมเนียม</span>
              <span>คำนวณตอนชำระเงิน</span>
            </div>
            
            <div className="flex justify-between items-center text-xl font-bold text-gray-900 mt-4">
              <span>ยอดรวมทั้งหมด</span>
              <span>฿{totalPrice.toFixed(0)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <button 
            onClick={handleCheckout}
            className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-blue-700 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            disabled={cartItems.length === 0}
          >
            ไปที่หน้าชำระเงิน
          </button>
        </>
      )}
    </div>
  );
}
