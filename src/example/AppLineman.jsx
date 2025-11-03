import React,{useState, useMemo} from "react";
import { IoIosAlert } from "react-icons/io";
import ProductCard from "./components/productcard";
import Cart from "./components/cart";
const myProducts = [
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
    image: "https://scontent.fbkk15-1.fna.fbcdn.net/v/t39.30808-6/480909501_1167112814772952_7156737523084061059_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=HKnzlyCZIJkQ7kNvwHT99RI&_nc_oc=AdkftuYOk5X9MUfuhmaVGEjspsygxntONc8QleI3fB_j2oTxmzJHXt3KpOGtqOXKCHI&_nc_zt=23&_nc_ht=scontent.fbkk15-1.fna&_nc_gid=42X-G-ZoTYsqAWS3N8qECw&oh=00_AffueonkUSMLDWdtKTd4Xj9VjgyJaXgYzooS8J0hY_ISMA&oe=6905066B",
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

function CustomModel ({title, message, onClose}) 
{
  return (
    <div className="fixed inset-0 z-50 flex items-center bg-black bg-opacity-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4 transform transition-all duration-300 scale-100 opacity-100">
        <div className="flex items-center gap-3">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0, items-center justify-center rounded-full bg-blue-100 sm:mx-0">
              <IoIosAlert />
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
          <button className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover: bg-blue-700 sm:ml-3, sm:w-auto"
          onClick={onClose}>
            ตกลง
          </button>
        </div>
      </div>
    </div>
  );
}


export default function App() {

  const [products] = useState(myProducts);
  const [cart, setCart] = useState ([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const addToCart = (product) => 
    {
      setCart((prevCart) => 
      {
        const existItem = prevCart.find((item) => item.id === product.id);

        if(existItem) //Updated item
          {
            console.log("เพิ่มจากเดิม");
            return prevCart.map((item) =>
              item.id === product.id ? {...item, quantity: item.quantity + 1} : item );
          }
        else //New item
          {
            
            console.log("มาใหม่");
            return [...prevCart, {...product, quantity: 1}];
          }
        
      });
    }
    const removeFromCart = (product) => 
    {
      setCart((prevCart) => 
      {
        const existItem = prevCart.find((item) => item.id === product.id);

        if(existItem.quantity === 1)
          {
            return prevCart.filter((item) => item.id === product.id)
          }
        else
          {
            return prevCart.map((item) => item.id === product.id ? {...item, quantity: item.quantity -1} : item)
          }
      });
    }
    const clearItemFromCart = (product) => 
      {
        setCart((prevCart) => prevCart.filter((item) => item.id !== product.id));
      }
    const totalPrice = useMemo(() => {
      return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    });
    const totalItems = useMemo(() => {
      return cart.reduce((total, item) => total + item.quantity, 0);
    });

    const handleShowModal = (message) => 
      {
        setModalMessage(message);
        setShowModal(true);
      }

      const handleCloseModal = () => 
      {
        setModalMessage("");
        setShowModal(false);
      }

  

  return (
   <>
   {showModal && (
    <CustomModel
      title="ชำระเงินเสร็จ"
      message={modalMessage}
      onClose={handleCloseModal} 
    />
   )}
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl p-4 pt-6 md:p-8">
          <header className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 pb-4 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">
              Food Delivery
            </h1>
            <div className="mt-2 sm:mt-0">
              <span className="text-lg text-gray-700">ส่งด่วนทั่วไทย</span>
            </div>
          </header>
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">เมนู</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {products.map((product) => {
                  return (
                  <ProductCard
                    key = {product.id}
                    product = {product}
                    onAddToCart = {addToCart}
                  />
                );
                })}
              </div>
            </div>
            {/* // Sidebar */}
            <div className="lg:w-1/3 mt-8 lg:mt-0">
                <div className="lg:sticky lg:top-8">
                  <Cart 
                    cartItems={cart}
                    totalItems={totalItems}
                    totalPrice={totalPrice}
                    onAddToCart={addToCart}
                    onRemoveFromCart={removeFromCart}
                    onClearItem={clearItemFromCart}
                    onShowModal={handleShowModal}
                  />
                </div>
            </div>
          </div>

      </div>
    </div>


   </>
  );
}
