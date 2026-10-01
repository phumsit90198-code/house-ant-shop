import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, PlusCircle, Search, ShieldCheck, Bug, Users, 
  MessageSquare, Heart, CheckCircle2, AlertTriangle, ArrowRight, 
  User, RefreshCw, Lock, Trash2, Check, X, ShieldAlert, DollarSign
} from 'lucide-react';

// Mock Initial Data
const INITIAL_PRODUCTS = [
  {
    id: 1,
    title: 'นางพญามดตะลานแดง (Camponotus singularis)',
    species: 'Camponotus singularis',
    price: 1200,
    category: 'queen',
    seller: 'AntLoverTH',
    sellerId: 101,
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80',
    description: 'นางพญามดตะลานแดงจับได้เอง สมบูรณ์ 100% ปีกหลุดแล้ว พร้อมไข่ชุดแรก 5 ฟอง',
    careLevel: 'ปานกลาง',
    status: 'AVAILABLE'
  },
  {
    id: 2,
    title: 'รังมดอะคริลิกทรงแนวตั้ง + โซนให้อาหาร',
    species: 'อุปกรณ์เลี้ยงมด',
    price: 450,
    category: 'nest',
    seller: 'NestCraft_Studio',
    sellerId: 102,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=600&q=80',
    description: 'รังมดอะคริลิกขนาด 15x10 cm มีระบบความชื้นในตัว เหมาะสำหรับรังขนาดเล็กถึงปานกลาง',
    careLevel: 'ง่าย',
    status: 'AVAILABLE'
  },
  {
    id: 3,
    title: 'รังมดคันไฟอินเดีย (Solenopsis geminata) รังพร้อมมดงาน 50+',
    species: 'Solenopsis geminata',
    price: 350,
    category: 'colony',
    seller: 'AntKingdom',
    sellerId: 103,
    image: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?auto=format&fit=crop&w=600&q=80',
    description: 'รังแข็งแรง มดงานขยันหาอาหารมาก ขยายไว เหมาะสำหรับผู้เริ่มต้น',
    careLevel: 'ง่ายมาก',
    status: 'AVAILABLE'
  }
];

const INITIAL_USERS = [
  { id: 1, username: 'buyer_demo', name: 'คุณผู้ซื้อ (Demouser)', role: 'USER', balance: 5000 },
  { id: 101, username: 'AntLoverTH', name: 'AntLoverTH (ผู้ขาย)', role: 'SELLER', balance: 1200 },
  { id: 999, username: 'admin_master', name: 'ผู้ดูแลระบบ (Admin)', role: 'ADMIN', balance: 0 }
];

export default function App() {
  // Application States
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('house_ant_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]); // Default Buyer
  const [activeTab, setActiveTab] = useState('market'); // market, sell, admin, orders
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState(null);

  // Form State for Adding Product
  const [newProduct, setNewProduct] = useState({
    title: '',
    species: '',
    price: '',
    category: 'queen',
    careLevel: 'ง่าย',
    description: '',
    image: ''
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('house_ant_products', JSON.stringify(products));
  }, [products]);

  const showNotify = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Switch User Profile Role
  const handleSwitchUserRole = (role) => {
    const targetUser = users.find(u => u.role === role) || users[0];
    setCurrentUser(targetUser);
    showNotify(`สลับสิทธิ์ใช้งานเป็น: ${targetUser.name} (${targetUser.role})`, 'info');
  };

  // Filter Products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.species.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Create Product Listing
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) {
      showNotify('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
      return;
    }

    const item = {
      id: Date.now(),
      ...newProduct,
      price: parseFloat(newProduct.price),
      seller: currentUser.username,
      sellerId: currentUser.id,
      image: newProduct.image || 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=600&q=80',
      status: 'AVAILABLE'
    };

    setProducts([item, ...products]);
    setNewProduct({ title: '', species: '', price: '', category: 'queen', careLevel: 'ง่าย', description: '', image: '' });
    setActiveTab('market');
    showNotify('ลงประกาศขายมดสำเร็จเรียบร้อย!');
  };

  // Escrow Buy Product
  const handleBuyProduct = (product) => {
    if (currentUser.id === product.sellerId) {
      showNotify('คุณไม่สามารถซื้อสินค้าของตัวเองได้', 'error');
      return;
    }

    // Create Escrow Order
    const newOrder = {
      orderId: 'ORD-' + Date.now(),
      productId: product.id,
      productTitle: product.title,
      price: product.price,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      sellerId: product.sellerId,
      sellerName: product.seller,
      escrowStatus: 'HOLDING', // HOLDING, RELEASED, REFUNDED
      createdAt: new Date().toLocaleDateString('th-TH')
    };

    setOrders([newOrder, ...orders]);

    // Update Product Status
    setProducts(products.map(p => p.id === product.id ? { ...p, status: 'RESERVED' } : p));
    showNotify('สั่งซื้อสำเร็จ! เงินของคุณถูกพักไว้ในระบบกลาง (Escrow) ปลอดภัย 100%');
  };

  // Buyer Confirms Received -> Release Money to Seller
  const handleConfirmReceived = (orderId) => {
    setOrders(orders.map(o => o.orderId === orderId ? { ...o, escrowStatus: 'RELEASED' } : o));
    showNotify('ยืนยันรับมดปลอดภัยแล้ว! ระบบทำการโอนเงินให้ผู้ขายเรียบร้อย');
  };

  // Admin Dispute Actions
  const handleAdminAction = (orderId, action) => {
    if (currentUser.role !== 'ADMIN') return;

    if (action === 'RELEASE') {
      setOrders(orders.map(o => o.orderId === orderId ? { ...o, escrowStatus: 'RELEASED' } : o));
      showNotify('ADMIN: อนุมัติการโอนเงินให้ผู้ขายเรียบร้อย');
    } else if (action === 'REFUND') {
      setOrders(orders.map(o => o.orderId === orderId ? { ...o, escrowStatus: 'REFUNDED' } : o));
      showNotify('ADMIN: คืนเงินให้ผู้ซื้อเรียบร้อย');
    }
  };

  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    showNotify('ลบรายการสินค้าเรียบร้อย');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-xl text-sm font-medium flex items-center space-x-2 border ${
          notification.type === 'error' ? 'bg-red-900/90 border-red-500 text-red-200' :
          notification.type === 'info' ? 'bg-blue-900/90 border-blue-500 text-blue-200' :
          'bg-amber-900/90 border-amber-500 text-amber-200'
        }`}>
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Header / Navbar */}
      <header className="bg-slate-800/80 backdrop-blur border-b border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('market')}>
            <div className="bg-amber-500 p-2 rounded-xl text-slate-950 font-bold">
              <Bug className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-tight text-amber-400">HOUSE ANT SHOP</h1>
              <p className="text-[10px] text-slate-400 -mt-1">ตลาดกลางซื้อขายมดและอุปกรณ์</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <button 
              onClick={() => setActiveTab('market')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'market' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-700'}`}>
              ตลาดซื้อขาย
            </button>
            <button 
              onClick={() => setActiveTab('sell')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1 ${activeTab === 'sell' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-700'}`}>
              <PlusCircle className="w-4 h-4" />
              <span>ลงขายมด</span>
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1 ${activeTab === 'orders' ? 'bg-amber-500/10 text-amber-400' : 'text-slate-300 hover:bg-slate-700'}`}>
              <ShoppingBag className="w-4 h-4" />
              <span>รายการสั่งซื้อ ({orders.length})</span>
            </button>

            {currentUser.role === 'ADMIN' && (
              <button 
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1 bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30`}>
                <ShieldAlert className="w-4 h-4" />
                <span>แดชบอร์ดแอดมิน</span>
              </button>
            )}
          </nav>

          {/* User Profile & Demo Switcher */}
          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-200">{currentUser.name}</div>
              <div className="text-[10px] text-amber-400 font-mono">สถานะ: {currentUser.role}</div>
            </div>

            {/* Quick Switch Role Dropdown */}
            <div className="bg-slate-700 p-1 rounded-lg flex space-x-1 text-xs">
              <button 
                onClick={() => handleSwitchUserRole('USER')}
                className={`px-2 py-1 rounded ${currentUser.role === 'USER' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}`}>
                ผู้ซื้อ
              </button>
              <button 
                onClick={() => handleSwitchUserRole('SELLER')}
                className={`px-2 py-1 rounded ${currentUser.role === 'SELLER' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-300'}`}>
                ผู้ขาย
              </button>
              <button 
                onClick={() => handleSwitchUserRole('ADMIN')}
                className={`px-2 py-1 rounded ${currentUser.role === 'ADMIN' ? 'bg-red-500 text-white font-bold' : 'text-slate-300'}`}>
                Admin
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        
        {/* TAB 1: MARKETPLACE */}
        {activeTab === 'market' && (
          <div className="space-y-6">
            {/* Hero / Banner */}
            <div className="bg-gradient-to-r from-amber-600/20 via-slate-800 to-slate-800 border border-amber-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="max-w-2xl space-y-2 relative z-10">
                <span className="bg-amber-500/20 text-amber-400 text-xs px-2.5 py-1 rounded-full font-semibold border border-amber-500/30 inline-flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>ระบบพักเงินซื้อขายปลอดภัย (Escrow Protected)</span>
                </span>
                <h2 className="text-2xl font-bold text-slate-100">แหล่งรวมนางพญามด รังมด และอุปกรณ์เลี้ยงมด</h2>
                <p className="text-slate-400 text-sm">ซื้อขายอย่างมั่นใจผ่านระบบพักเงินกลาง มดตายระหว่างจัดส่งเคลมเงินคืนได้ทันที</p>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 justify-between items-center bg-slate-800/50 p-3 rounded-xl border border-slate-700">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="ค้นหาชื่อมด สายพันธุ์ หรืออุปกรณ์..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                {[
                  { id: 'all', label: 'ทั้งหมด' },
                  { id: 'queen', label: '👑 นางพญา/รังเริ่มต้น' },
                  { id: 'colony', label: '🐜 มดรังใหญ่' },
                  { id: 'nest', label: '🏠 รังมด/อุปกรณ์' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${selectedCategory === cat.id ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-amber-500/50 transition flex flex-col">
                  <div className="h-48 overflow-hidden relative bg-slate-900">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur text-amber-400 text-xs px-2 py-1 rounded font-mono font-bold border border-amber-500/30">
                      ฿{product.price.toLocaleString()}
                    </span>
                    {product.status === 'RESERVED' && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur flex items-center justify-center">
                        <span className="bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1 rounded-full">ถูกจองแล้ว (อยู่ในระบบพักเงิน)</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="text-[11px] text-amber-400 font-mono">{product.species}</div>
                      <h3 className="font-bold text-slate-100 text-base line-clamp-1">{product.title}</h3>
                      <p className="text-slate-400 text-xs mt-1 line-clamp-2">{product.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                      <span>ผู้ขาย: <strong className="text-slate-200">{product.seller}</strong></span>
                      {product.status === 'AVAILABLE' && (
                        <button 
                          onClick={() => handleBuyProduct(product)}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 transition">
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>สั่งซื้อ (Escrow)</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: SELL FORM */}
        {activeTab === 'sell' && (
          <div className="max-w-2xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-amber-400 mb-4 flex items-center space-x-2">
              <PlusCircle className="w-5 h-5" />
              <span>ลงประกาศขายมด / อุปกรณ์</span>
            </h2>

            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">ชื่อหัวข้อประกาศ *</label>
                <input 
                  type="text" 
                  required
                  placeholder="เช่น นางพญามดตะลานแดง พร้อมไข่"
                  value={newProduct.title}
                  onChange={e => setNewProduct({...newProduct, title: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ชื่อสายพันธุ์ (ถ้ามี)</label>
                  <input 
                    type="text" 
                    placeholder="เช่น Camponotus singularis"
                    value={newProduct.species}
                    onChange={e => setNewProduct({...newProduct, species: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">ราคา (บาท) *</label>
                  <input 
                    type="number" 
                    required
                    placeholder="450"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">หมวดหมู่</label>
                  <select 
                    value={newProduct.category}
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100">
                    <option value="queen">👑 นางพญา/รังเริ่มต้น</option>
                    <option value="colony">🐜 มดรังใหญ่</option>
                    <option value="nest">🏠 รังมด/อุปกรณ์</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">URL รูปภาพ</label>
                  <input 
                    type="url" 
                    placeholder="https://..."
                    value={newProduct.image}
                    onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">รายละเอียดเพิ่มเติม</label>
                <textarea 
                  rows={3}
                  placeholder="อธิบายสภาพมด ประวัติการลงไข่ หรือรายละเอียดรังมด..."
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100"
                ></textarea>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition">
                ยืนยันลงประกาศขาย
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: ORDERS & ESCROW LIST */}
        {activeTab === 'orders' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <h2 className="text-xl font-bold text-amber-400 flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5" />
              <span>รายการสั่งซื้อผ่านระบบกลางพักเงิน (Escrow Status)</span>
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700 text-slate-400 text-sm">
                ยังไม่มีรายการสั่งซื้อในขณะนี้
              </div>
            ) : (
              orders.map(order => (
                <div key={order.orderId} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-mono text-slate-400">{order.orderId}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        order.escrowStatus === 'HOLDING' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        order.escrowStatus === 'RELEASED' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {order.escrowStatus === 'HOLDING' ? '🔒 ระบบพักเงินอยู่ (Holding)' :
                         order.escrowStatus === 'RELEASED' ? '✅ โอนเงินให้ผู้ขายแล้ว' : '↩️ คืนเงินผู้ซื้อแล้ว'}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-100 mt-1">{order.productTitle}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">ผู้ซื้อ: {order.buyerName} | ผู้ขาย: {order.sellerName} | ราคา: ฿{order.price.toLocaleString()}</p>
                  </div>

                  {order.escrowStatus === 'HOLDING' && (
                    <button 
                      onClick={() => handleConfirmReceived(order.orderId)}
                      className="bg-green-600 hover:bg-green-500 text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center space-x-1 transition">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ยืนยันรับมดปลอดภัย (โอนเงินให้ผู้ขาย)</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: ADMIN DASHBOARD */}
        {activeTab === 'admin' && currentUser.role === 'ADMIN' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="bg-red-950/40 border border-red-500/30 p-4 rounded-xl flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-red-400 flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5" />
                  <span>แอดมินแดชบอร์ด (Admin Control Panel)</span>
                </h2>
                <p className="text-xs text-slate-400">ควบคุมธุรกรรมการซื้อขาย ตัดสินข้อพาท และจัดการผู้ใช้งานในระบบ</p>
              </div>
            </div>

            {/* Escrow Dispute Resolution */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <h3 className="font-bold text-slate-200 text-sm mb-3">จัดการเงินพักกลาง (Escrow Management)</h3>
              {orders.length === 0 ? (
                <p className="text-xs text-slate-400">ไม่มีคำสั่งซื้อให้จัดการ</p>
              ) : (
                <div className="space-y-3">
                  {orders.map(o => (
                    <div key={o.orderId} className="bg-slate-900 p-3 rounded-lg flex justify-between items-center text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{o.productTitle} ({o.orderId})</div>
                        <div className="text-slate-400">ยอดเงิน: ฿{o.price} | สถานะ: {o.escrowStatus}</div>
                      </div>
                      {o.escrowStatus === 'HOLDING' && (
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleAdminAction(o.orderId, 'RELEASE')}
                            className="bg-green-600 text-white px-2.5 py-1 rounded font-bold hover:bg-green-500">
                            ปลดล็อกเงินให้ผู้ขาย
                          </button>
                          <button 
                            onClick={() => handleAdminAction(o.orderId, 'REFUND')}
                            className="bg-red-600 text-white px-2.5 py-1 rounded font-bold hover:bg-red-500">
                            สั่งคืนเงินผู้ซื้อ
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Moderate Product Listings */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
              <h3 className="font-bold text-slate-200 text-sm mb-3">จัดการรายการสินค้าในระบบ</h3>
              <div className="space-y-2">
                {products.map(p => (
                  <div key={p.id} className="bg-slate-900 p-2.5 rounded-lg flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-200">{p.title}</span>
                      <span className="text-slate-400 ml-2">(ผู้ขาย: {p.seller})</span>
                    </div>
                    <button 
                      onClick={() => handleDeleteProduct(p.id)}
                      className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
