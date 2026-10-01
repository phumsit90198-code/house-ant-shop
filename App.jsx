import React, { useState } from 'react';

export default function App() {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    {
      id: 1,
      name: 'Monomorium pharaonis (มดละเอียด)',
      category: 'easy',
      price: 150,
      image: 'https://images.unsplash.com/photo-1581093458791-9f3c3250a8b0?w=500&auto=format&fit=crop&q=60',
      description: 'มดเริ่มต้นเลี้ยงง่าย ขยายพันธุ์ไว เหมาะสำหรับผู้เริ่มต้น'
    },
    {
      id: 2,
      name: 'Camponotus sangineus (มดบกแดง)',
      category: 'medium',
      price: 450,
      image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&auto=format&fit=crop&q=60',
      description: 'มดขนาดใหญ่ สีสวยงาม สังเกตพฤติกรรมง่าย'
    },
    {
      id: 3,
      name: 'Odontomachus simillimus (มดกับดัก)',
      category: 'hard',
      price: 850,
      image: 'https://images.unsplash.com/photo-1533450718592-29d45635f0a9?w=500&auto=format&fit=crop&q=60',
      description: 'มดล่าเหยื่อขนาดใหญ่ มีเขี้ยวดีดงับที่รวดเร็ว'
    }
  ];

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-12">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🐜</span>
            <h1 className="text-xl font-bold tracking-wider text-emerald-400">HOUSE ANT SHOP</h1>
          </div>
          <div className="bg-slate-700 px-3 py-1.5 rounded-full text-sm font-medium">
            🛒 ตระกร้า ({cart.length})
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-slate-800/50 py-10 px-4 text-center border-b border-slate-800">
        <h2 className="text-3xl font-extrabold text-white mb-2">อาณาจักรมดในบ้านคุณ</h2>
        <p className="text-slate-400 max-w-md mx-auto text-sm">จำหน่ายรังมด อุปกรณ์เลี้ยง และนางพญามดคุณภาพสูง</p>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 mt-8">
        {/* Category Filter */}
        <div className="flex justify-center space-x-2 mb-8 overflow-x-auto pb-2">
          {['all', 'easy', 'medium', 'hard'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {cat === 'all' ? 'ทั้งหมด' : cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-emerald-500/50 transition-all">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="font-bold text-lg text-white mb-1">{product.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold text-emerald-400">฿{product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    เพิ่มลงตระกร้า
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
