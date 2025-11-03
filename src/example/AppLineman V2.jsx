import { OctagonAlert , Minus, Plus, ShoppingCart, History, Trash2  }  from 'lucide-react';

import React, { useState, useMemo, useEffect } from 'react';

// --- Conversion Rate ---
const USD_TO_THB_RATE = 33;
// --- LocalStorage Key ---
const HISTORY_STORAGE_KEY = 'VITE_FOOD_APP_HISTORY';

// --- LocalStorage Helper Functions ---

/**
 * Get order history from localStorage
 * @returns {Array} List of order objects
 */
const getHistoryFromStorage = () => {
  try {
    const rawHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (rawHistory) {
      return JSON.parse(rawHistory);
    }
    return [];
  } catch (error) {
    console.error("Could not parse history from localStorage", error);
    return [];
  }
};

/**
 * Save order history to localStorage
 * @param {Array} history - List of order objects to save
 */
const saveHistoryToStorage = (history) => {
  try {
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (error) {
    console.error("Could not save history to localStorage", error);
  }
};


const sampleProducts = [
  {
    id: 1,
    name: "ส้มตำไทย",
    price: 45,
    image: "https://www.unileverfoodsolutions.co.th/th/chef-inspiration/simple-tips-for-great-flavour/somtum-green-papaya-salad-recipes/jcr:content/parsys/content-aside-footer/tipsandadvice/image.img.jpg/1695118621402.jpg",
    description: "ส้มตำไทยใส่พริก มะนาว และ ปู มีน้ำปลาร้า",
  },
  {
    id: 2,
    name: "ไก่ย่าง",
    price: 90,
    image: "https://media.thairath.co.th/image/BDSDEt1hnOBZFuxaLGOvZEUH96Wto7p1V28KSvCeUKYhRwe9vA1.wepb",
    description: "ไก่ย่างบ้านสวน เนื้อไก่บ้าน หมักซอส XO ย่างหอมๆ",
  },
  {
    id: 3,
    name: "ข้าวเหนียว",
    price: 10,
    image: "https://cdn-ildplgb.nitrocdn.com/IsDIEVbKqjLKLwSjgUBetWWfJLAUdaLp/assets/images/optimized/rev-f28e55d/www.thammculture.com/wp-content/uploads/2022/03/Untitled-177.jpg",
    description: "ข้าวเหนียวแท้ 100% นึ่งสุกกำลังดีไม่ติดมือ",
  },
];

// --- Custom Modal Component (to replace alert()) ---
function CustomModal({ title, message, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4 transform transition-all duration-300 scale-100 opacity-100">
        <div className="flex items-center gap-3">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0">
            <OctagonAlert/>
          </div>
          <h3 className="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
            {title}
          </h3>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">
            {message}
          </p>
        </div>
        <div className="mt-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:ml-3 sm:w-auto"
            onClick={onClose}
          >
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
}

// --- NEW History Modal Component ---
function HistoryModal({ show, onClose, history, onReorder }) {
  if (!show) {
    return null;
  }

  const formatOrderDate = (isoDate) => {
    return new Date(isoDate).toLocaleString('th-TH', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  };

  const calculateTotalItems = (items) => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4 transform transition-all duration-300 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center pb-4 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            ประวัติการสั่งซื้อ
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-4 flex-grow overflow-y-auto space-y-4 pr-2 -mr-2">
          {history.length === 0 ? (
            <p className="text-gray-500 text-center py-8">ไม่มีประวัติการสั่งซื้อ</p>
          ) : (
            history.map((order) => (
              <div key={order.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">
                    {formatOrderDate(order.date)}
                  </span>
                  <button
                    onClick={() => onReorder(order.items)}
                    className="bg-blue-100 text-blue-700 text-sm font-semibold py-1 px-3 rounded-full hover:bg-blue-200 transition-colors"
                  >
                    สั่งซ้ำ
                  </button>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}
                </div>
                <div className="text-right font-medium text-gray-800">
                  {calculateTotalItems(order.items)} ชิ้น / รวม ฿{order.totalPrice.toFixed(0)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


// --- Main App Component ---
export default function App() {
  const [products] = useState(sampleProducts);
  const [cart, setCart] = useState([]);
  
  // State for Modals
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // State for History
  const [orderHistory, setOrderHistory] = useState([]);

  // Load history from localStorage on initial render
  useEffect(() => {
    setOrderHistory(getHistoryFromStorage());
  }, []);

  /**
   * Calculates the total price of the cart.
   * useMemo ensures this only recalculates when the cart changes.
   */
  const totalPrice = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);
  
  const totalItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  /**
   * Adds a product to the cart or increments its quantity.
   */
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        // If item exists, update its quantity
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If item doesn't exist, add it with quantity 1
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  /**
   * Decrements a product's quantity or removes it from the cart.
   */
  const removeFromCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem.quantity === 1) {
        // If quantity is 1, remove the item from the cart
        return prevCart.filter((item) => item.id !== product.id);
      } else {
        // Otherwise, decrement the quantity
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
    });
  };

  /**
   * Completely removes an item from the cart, regardless of quantity.
   */
  const clearItemFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== product.id));
  };

  // --- Modal Handlers ---
  const handleShowModal = (message) => {
    setModalMessage(message);
    setShowCheckoutModal(true);
  };

  const handleCloseModal = () => {
    setShowCheckoutModal(false);
    setModalMessage('');
  };

  // --- NEW: History and Checkout Logic ---

  /**
   * Handles the checkout process:
   * 1. Saves the current cart to history (localStorage and state)
   * 2. Shows a success modal
   */
  const handleCheckout = () => {
    if (cart.length === 0) {
      handleShowModal("ตะกร้าของคุณว่างเปล่า", "ไม่สามารถบันทึกได้");
      return;
    }

    // 1. Create new order object
    const newOrder = {
      id: Date.now(),
      date: new Date().toISOString(),
      items: cart,
      totalPrice: totalPrice
    };

    // 2. Get old history and add new one (limit to 10)
    const oldHistory = getHistoryFromStorage();
    const updatedHistory = [newOrder, ...oldHistory].slice(0, 10);

    // 3. Save to localStorage and update state
    saveHistoryToStorage(updatedHistory);
    setOrderHistory(updatedHistory);

    // 4. Show success modal
    handleShowModal(`บันทึกรายการสั่งซื้อแล้ว\nยอดรวม: ฿${totalPrice.toFixed(0)}`);
  };

  /**
   * Handles the "Re-order" action from the history modal
   * @param {Array} items - The items from the past order
   */
  const handleReorder = (items) => {
    // Replace current cart with the selected history items
    setCart(items);
    // Close the history modal
    setShowHistoryModal(false);
  };


  return (
    <>
      {showCheckoutModal && (
        <CustomModal 
          title="ดำเนินการ"
          message={modalMessage}
          onClose={handleCloseModal}
        />
      )}
      
      <HistoryModal
        show={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={orderHistory}
        onReorder={handleReorder}
      />

      <div className="min-h-screen bg-gray-50 font-inter">
        <div className="container mx-auto max-w-7xl p-4 pt-6 md:p-8">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">
              บริการส่งอาหาร
            </h1>
            <div className="mt-2 sm:mt-0">
              <span className="text-lg text-gray-600">มื้อด่วนทันใจ!</span>
            </div>
          </header>
          
          <div className="flex flex-col lg:flex-row lg:gap-8">
            
            {/* Products List (Main Content) */}
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">เมนู</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            </div>

            {/* Cart (Sidebar) */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
              {/* Make cart sticky on large screens */}
              <div className="lg:sticky lg:top-8">
                <Cart
                  cartItems={cart}
                  totalItems={totalItems}
                  totalPrice={totalPrice}
                  onAddToCart={addToCart}
                  onRemoveFromCart={removeFromCart}
                  onClearItem={clearItemFromCart}
                  onCheckoutClick={handleCheckout} // <-- Pass new handler
                  onShowHistory={() => setShowHistoryModal(true)} // <-- Pass handler
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// --- Product Card Component ---
function ProductCard({ product, onAddToCart }) {
  // console.log('Product inside ProductCard:', product); // Uncomment for debugging
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://static.thenounproject.com/png/4440881-200.png'; }}
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
            <ShoppingCart size={18} />
            เพิ่ม
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Cart Component ---
function Cart({ 
  cartItems, 
  totalItems, 
  totalPrice, 
  onAddToCart, 
  onRemoveFromCart, 
  onClearItem, 
  onCheckoutClick, // <-- New prop
  onShowHistory // <-- New prop
}) {
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
          <ShoppingCart size={24} />
          ตะกร้าของคุณ ({totalItems} ชิ้น)
        </h2>
        {/* --- NEW History Button --- */}
        <button 
          onClick={onShowHistory} 
          className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-800 hover:underline"
          title="ดูประวัติการสั่งซื้อ"
        >
          <History size={16} />
          ประวัติ
        </button>
      </div>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-8">
          <img src="https://d31wxntiwn0x96.cloudfront.net/kpykbc/productimages/1042_1.jpeg?etag=%229deea2c2a2684fafe2197cea4d8044af%22&width=800&height=600&nostretch" alt="Empty Cart" className="mx-auto rounded-full" />
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
            onClick={onCheckoutClick} // <-- Use new prop
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

// --- Cart Item Component (sub-component for Cart) ---
function CartItem({ item, onAdd, onRemove, onClear }) {
  return (
    <div className="flex items-center gap-4 group">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/64x64/CCCCCC/777?text=N/A'; }}
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
          <Minus size={14} />
        </button>
        <span className="font-medium w-6 text-center text-gray-800" aria-label="จำนวน">{item.quantity}</span>
        <button 
          onClick={() => onAdd(item)}
          className="p-1 rounded-full text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
          aria-label="เพิ่ม 1 ชิ้น"
        >
          <Plus size={14} />
        </button>
      </div>
      <button 
        onClick={() => onClear(item)} 
        className="text-gray-400 transition-colors hover:text-red-500 opacity-0 group-hover:opacity-100"
        title="ลบทั้งหมดออกจากตะกร้า"
        aria-label="ลบทั้งหมดออกจากตะกร้า"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
