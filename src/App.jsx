import React, { useState, useEffect, useRef } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { 
    ArrowUp, ArrowDown, User, Users, ShoppingCart, BarChart2, MessageSquare, PlusCircle, Globe, LogIn, 
    LogOut, Package, Settings, LayoutDashboard, Wand2, ShieldCheck, DollarSign, MoreVertical, Trash2, Edit, 
    Save, Building, Mail, Link as LinkIcon, Search
} from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// --- MOCK DATA & CONFIG ---

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

// TODO: Add your Firebase configuration from your Firebase project settings
// It's recommended to use environment variables for these values.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const mockData = {
  artisanProducts: [
    { id: 1, name: 'Handcrafted Clay Vase', category: 'Pottery', price: 45.00, stock: 15, status: 'Active', imageUrl: 'https://placehold.co/100x100/d1c4e9/673ab7?text=Vase' },
    { id: 3, name: 'Sterling Silver Ring', category: 'Jewelry', price: 120.00, stock: 5, status: 'Active', imageUrl: 'https://placehold.co/100x100/b2ebf2/00bcd4?text=Ring' },
    { id: 5, name: 'Jaipur Blue Pottery Plate', category: 'Pottery', price: 85.00, stock: 0, status: 'Sold Out', imageUrl: 'https://placehold.co/100x100/81d4fa/01579b?text=Plate' },
    { id: 7, name: 'Madhubani Painting', category: 'Painting', price: 150.00, stock: 10, status: 'Active', imageUrl: 'https://placehold.co/100x100/ffccbc/e64a19?text=Art' },
  ],
  products: {
    trending: [
      { id: 1, name: 'Handcrafted Clay Vase', category: 'Pottery', price: 45.00, imageUrl: 'https://placehold.co/600x400/d1c4e9/673ab7?text=Clay+Vase' },
      { id: 3, name: 'Sterling Silver Ring', category: 'Jewelry', price: 120.00, imageUrl: 'https://placehold.co/600x400/b2ebf2/00bcd4?text=Silver+Ring' },
      { id: 5, name: 'Jaipur Blue Pottery Plate', category: 'Pottery', price: 85.00, imageUrl: 'https://placehold.co/600x400/81d4fa/01579b?text=Jaipur+Pottery' },
      { id: 7, name: 'Madhubani Painting', category: 'Painting', price: 150.00, imageUrl: 'https://placehold.co/600x400/ffccbc/e64a19?text=Madhubani+Art' },
    ],
    categories: ['Painting', 'Pottery', 'Textiles', 'Jewelry', 'Woodwork', 'Sculpture']
  },
  analytics: {
    kpis: [
      { title: 'Total Revenue', value: '$12,450', change: '+12.5%', icon: <DollarSign className="h-6 w-6 text-white" />, color: 'bg-green-500' },
      { title: 'Visitors', value: '8,980', change: '+8.2%', icon: <User className="h-6 w-6 text-white" />, color: 'bg-blue-500' },
      { title: 'Conversion Rate', value: '3.4%', change: '-1.1%', icon: <BarChart2 className="h-6 w-6 text-white" />, color: 'bg-orange-500' },
      { title: 'New Orders', value: '72', change: '+5', icon: <Package className="h-6 w-6 text-white" />, color: 'bg-purple-500' },
    ],
    salesData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{ label: 'Sales', data: [1200, 1900, 3000, 5000, 2300, 3200], backgroundColor: 'rgba(79, 70, 229, 0.5)', borderColor: '#4F46E5', fill: true, tension: 0.4 }],
    },
     trafficSourceData: {
        labels: ['Direct', 'Search', 'Social'],
        datasets: [{ data: [300, 500, 100], backgroundColor: ['#4F46E5', '#10B981', '#F59E0B'], borderColor: '#111827' }]
    },
    inventoryData: {
        labels: ['In Stock', 'Low Stock', 'Sold Out'],
        datasets: [{ data: [25, 5, 2], backgroundColor: ['#10B981', '#F59E0B', '#EF4444'], borderColor: '#111827'}]
    }
  },
  orders: [
    { id: 'ORD001', customer: 'John Doe', date: '2024-09-11', total: 120.00, status: 'Shipped' },
    { id: 'ORD002', customer: 'Jane Smith', date: '2024-09-10', total: 85.00, status: 'Processing' },
    { id: 'ORD003', customer: 'Sam Wilson', date: '2024-09-09', total: 250.00, status: 'Delivered' },
    { id: 'ORD004', customer: 'Emily Brown', date: '2024-09-08', total: 45.00, status: 'Delivered' },
    { id: 'ORD005', customer: 'Michael Johnson', date: '2024-09-07', total: 150.00, status: 'Cancelled' },
    { id: 'ORD006', customer: 'Jessica Davis', date: '2024-09-06', total: 120.00, status: 'Shipped' },
  ],
  customers: [
      { id: 1, name: 'John Doe', email: 'john.d@example.com', joinDate: '2024-08-15', totalOrders: 2, totalSpent: 240.00 },
      { id: 2, name: 'Jane Smith', email: 'jane.s@example.com', joinDate: '2024-08-20', totalOrders: 1, totalSpent: 85.00 },
      { id: 3, name: 'Sam Wilson', email: 'sam.w@example.com', joinDate: '2024-08-21', totalOrders: 1, totalSpent: 250.00 },
      { id: 4, name: 'Emily Brown', email: 'emily.b@example.com', joinDate: '2024-09-01', totalOrders: 1, totalSpent: 45.00 },
  ],
  artisanDetails: {
      name: 'Riya Sharma',
      businessName: 'Riya\'s Clay Creations',
      email: 'riya.sharma@example.com',
      bio: 'Creating timeless pottery pieces inspired by ancient Indian traditions. Each piece is handcrafted with love and tells a unique story.',
      social: {
          instagram: 'https://instagram.com/riyaclay',
          facebook: 'https://facebook.com/riyaclay'
      }
  }
};

// --- TRANSLATION HOOK & DATA ---
const translations = {
    en: { welcome: "Welcome", tagline: "Expanding Indian Art into a Global Universe", trending: "Trending Now", shop_by_category: "Shop by Category" },
    es: { welcome: "Bienvenido", tagline: "Expandiendo el Arte Indio a un Universo Global", trending: "Tendencia Ahora", shop_by_category: "Comprar por Categoría" },
    fr: { welcome: "Bienvenue", tagline: "Étendre l'Art Indien à un Univers Mondial", trending: "Tendance Actuelle", shop_by_category: "Acheter par Catégorie" }
};
const useTranslation = (language) => (key) => translations[language][key] || key;

// --- ACETERNITY UI-INSPIRED COMPONENTS ---

const Card = ({ children, className = '' }) => (
    <div className={`bg-[#111827] border border-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 ${className}`}>
        {children}
    </div>
);

const Button = ({ children, onClick, className = '', variant = 'primary', disabled = false }) => {
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-500 focus:ring-indigo-500',
        secondary: 'bg-gray-700 text-gray-200 hover:bg-gray-600 focus:ring-gray-500'
    };
    return (
      <button onClick={onClick} disabled={disabled} className={`px-5 py-2.5 font-semibold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden group disabled:bg-gray-600 disabled:cursor-not-allowed ${variants[variant]} ${className}`}>
        <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
        <span className="relative">{children}</span>
      </button>
    );
};

const Input = ({ id, icon, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">{props.label}</label>
        <div className="relative">
            {icon && <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</div>}
            <input id={id} {...props} className={`w-full bg-gray-800 text-white px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow ${icon ? 'pl-10' : ''}`}/>
        </div>
    </div>
);

const Textarea = ({ id, ...props }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">{props.label}</label>
        <textarea id={id} {...props} rows="5" className="w-full bg-gray-800 text-white px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"/>
    </div>
);

const TextGenerateEffect = ({ words, className }) => {
    const [animatedWords, setAnimatedWords] = useState([]);
    useEffect(() => {
        const wordsArray = words.split(" ");
        setAnimatedWords(wordsArray);
    }, [words]);

    return (
        <div className={className}>
            {animatedWords.map((word, idx) => (
                <span key={word + idx} className="text-white opacity-0" style={{ animation: `fadeIn 0.5s ease-in-out forwards ${idx * 0.1}s` }}>
                    {word}{" "}
                </span>
            ))}
        </div>
    );
};

// --- HEADER & NAVIGATION ---

const Header = ({ onNavigate, onLanguageChange, t, user, onLogout }) => (
    <header className="bg-black/50 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-800">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
                <h1 className="text-3xl font-bold text-white cursor-pointer tracking-wider" onClick={() => onNavigate({ page: 'home' })}>Kalaverse</h1>
                 {user?.role === 'customer' && (
                    <div className="hidden md:flex items-center space-x-8">
                        <button className="text-gray-300 hover:text-white transition font-medium">Categories</button>
                        <button className="text-gray-300 hover:text-white transition font-medium">Deals</button>
                        <button className="text-gray-300 hover:text-white transition font-medium">New Arrivals</button>
                    </div>
                )}
                <div className="flex items-center space-x-4">
                    <select onChange={(e) => onLanguageChange(e.target.value)} className="bg-gray-800 text-white pl-4 pr-2 py-2 border border-gray-700 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer">
                        <option value="en">EN</option><option value="es">ES</option><option value="fr">FR</option>
                    </select>
                    {user ? (
                        <>
                            {user.role === 'artisan' && (
                                <Button onClick={() => onNavigate({ page: 'dashboard', subPage: 'dashboard' })} variant="secondary">
                                    <LayoutDashboard size={18} /> Dashboard
                                </Button>
                            )}
                            <div className="relative">
                                <button onClick={onLogout} title="Logout" className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">{user.email.charAt(0).toUpperCase()}</button>
                            </div>
                        </>
                    ) : (
                        <Button onClick={() => onNavigate({ page: 'login' })}><LogIn size={18} /> Login</Button>
                    )}
                </div>
            </div>
        </nav>
    </header>
);

// --- CUSTOMER PAGES ---
const CustomerHomePage = ({ onNavigate, t }) => (
    <>
        <div className="relative h-[80vh] text-white flex flex-col items-center justify-center text-center overflow-hidden bg-black">
             <div className="absolute inset-0 w-full h-full bg-grid-white/[0.1] z-0"></div>
             <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] z-10"></div>
            <div className="relative z-20 p-4">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                    {t('welcome')} to Kalaverse
                </h1>
                <TextGenerateEffect words={t('tagline')} className="text-xl md:text-2xl font-light text-gray-300" />
            </div>
        </div>
        <div className="bg-black text-white border-t border-gray-800">
            <div className="container mx-auto p-4 sm:p-6 lg:p-12 space-y-20">
                <ProductShelf title={t('trending')} products={mockData.products.trending} />
                <CategoryGrid categories={mockData.products.categories} t={t} />
            </div>
        </div>
        <div className="fixed bottom-8 right-8 z-40">
            <Button onClick={() => onNavigate({ page: 'chatbot' })} className="rounded-full !p-4 h-16 w-16 shadow-lg">
                <MessageSquare className="h-8 w-8" />
            </Button>
        </div>
    </>
);

const ProductCard3D = ({ product }) => {
    const cardRef = useRef(null);
    const handleMouseMove = (e) => {
        const { clientX, clientY, currentTarget } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const x = (clientX - left - width / 2) / 25;
        const y = (clientY - top - height / 2) / 25;
        cardRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg) scale(1.05)`;
    };
    const handleMouseLeave = () => { cardRef.current.style.transform = `rotateY(0) rotateX(0) scale(1)`; };

    return (
        <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} style={{ perspective: '1000px' }}
            className="group transition-all duration-300">
            <div ref={cardRef} className="bg-[#111827] rounded-2xl shadow-2xl overflow-hidden transform-style-3d transition-transform duration-500 border border-gray-800">
                <img src={product.imageUrl} alt={product.name} className="w-full h-56 object-cover" />
                <div className="p-5">
                    <h3 className="text-lg font-semibold truncate text-gray-100">{product.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{product.category}</p>
                    <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-indigo-400">${product.price.toFixed(2)}</span>
                        <button className="!px-4 !py-2 text-sm bg-gray-700 text-gray-200 hover:bg-gray-600 rounded-lg">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductShelf = ({ title, products }) => (
    <section>
        <h2 className="text-4xl font-bold mb-8 text-center">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map(p => <ProductCard3D key={p.id} product={p} />)}
        </div>
    </section>
);

const CategoryGrid = ({ categories, t }) => (
    <section>
        <h2 className="text-4xl font-bold mb-8 text-center">{t('shop_by_category')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map(cat => (
                <div key={cat} className="h-32 rounded-lg bg-[#111827] border border-gray-800 flex items-center justify-center text-xl font-semibold cursor-pointer hover:bg-indigo-600 hover:border-indigo-500 hover:-translate-y-1 transition-all">
                    {cat}
                </div>
            ))}
        </div>
    </section>
);

// --- ARTISAN DASHBOARD ---
const ArtisanDashboard = ({ onNavigate, activeSubPage }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pages = {
        dashboard: <DashboardOverview onNavigate={onNavigate} />,
        products: <ProductManagement onNavigate={onNavigate} />,
        addProduct: <AddProductPage onNavigate={onNavigate} />,
        orders: <OrderManagement />,
        customers: <CustomerManagement />,
        analytics: <AnalyticsPage />,
        assistant: <ChatbotPage isAssistant={true} />,
        settings: <SettingsPage />
    };
    return (
        <div className="flex min-h-[calc(100vh-80px)] bg-black">
            <Sidebar onNavigate={onNavigate} activeSubPage={activeSubPage} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className="flex-grow p-4 sm:p-6 md:p-8 text-white md:ml-64 transition-all duration-300">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden mb-4 p-2 bg-gray-800 rounded-lg">
                    <LayoutDashboard size={20} />
                </button>
                {pages[activeSubPage] || <DashboardOverview onNavigate={onNavigate} />}
            </div>
        </div>
    );
};

const Sidebar = ({ onNavigate, activeSubPage, sidebarOpen, setSidebarOpen }) => {
    const NavItem = ({ icon, label, page }) => (
        <button
           onClick={() => { onNavigate({ page: 'dashboard', subPage: page }); setSidebarOpen(false); }}
           className={`flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-colors ${activeSubPage === page ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            {icon} <span className="font-medium">{label}</span>
        </button>
    );
    return (
        <>
            {/* Overlay for mobile */}
            <div onClick={() => setSidebarOpen(false)} className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}></div>
            {/* Sidebar */}
            <div className={`w-64 bg-[#09090b] p-4 border-r border-gray-800 flex flex-col fixed h-full z-40 transform transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <nav className="flex flex-col gap-2">
                    <NavItem icon={<LayoutDashboard />} label="Dashboard" page="dashboard" />
                    <NavItem icon={<Package />} label="Products" page="products" />
                    <NavItem icon={<ShoppingCart />} label="Orders" page="orders" />
                    <NavItem icon={<Users />} label="Customers" page="customers" />
                    <NavItem icon={<BarChart2 />} label="Analytics" page="analytics" />
                    <NavItem icon={<MessageSquare />} label="AI Assistant" page="assistant" />
                </nav>
                <div className="mt-auto"><NavItem icon={<Settings />} label="Settings" page="settings" /></div>
            </div>
        </>
    );
};

const DashboardOverview = ({ onNavigate }) => (
    <div>
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockData.analytics.kpis.map(kpi => (
                    <div key={kpi.title} className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-lg">
                         <div className="flex items-center justify-between"><p className="text-gray-400 font-medium">{kpi.title}</p><div className={`p-2 rounded-md ${kpi.color}`}>{kpi.icon}</div></div>
                         <p className="text-3xl font-bold text-white my-2">{kpi.value}</p>
                         {kpi.change && (
                            <div className={`flex items-center text-sm ${kpi.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                {kpi.change.startsWith('+') ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                                <span>{kpi.change} vs. last month</span>
                            </div>
                         )}
                    </div>
                ))}
                <Card className="md:col-span-2"><h3 className="text-xl font-semibold mb-4">Sales Performance</h3><Line data={mockData.analytics.salesData} options={{ responsive: true, plugins: { legend: { display: false } } }} /></Card>
            </div>
            <div className="lg:col-span-1 flex flex-col gap-8">
                <Card><h3 className="text-xl font-semibold mb-4 text-white">Quick Actions</h3>
                    <div className="flex flex-col gap-4">
                        <Button onClick={() => onNavigate({ subPage: 'addProduct' })}><PlusCircle size={20}/> Add New Product</Button>
                        <Button onClick={() => onNavigate({ page: 'dashboard', subPage: 'assistant'})} variant="secondary"><MessageSquare size={20}/> Ask AI Assistant</Button>
                    </div>
                </Card>
                <Card><h3 className="text-xl font-semibold mb-4 text-white">Inventory Summary</h3><div className="max-w-xs mx-auto"><Doughnut data={mockData.analytics.inventoryData} options={{ responsive: true, plugins: { legend: { position: 'bottom' }}}} /></div></Card>
                <Card><h3 className="text-xl font-semibold mb-4 text-white">Recent Orders</h3>
                    <div className="space-y-3">{mockData.orders.slice(0, 3).map(order => (
                        <div key={order.id} className="flex justify-between items-center text-sm p-3 rounded-md bg-gray-800/50"><div><p className="font-semibold text-gray-200">{order.customer}</p><p className="text-gray-500">{order.id}</p></div><span className={`px-2 py-1 rounded text-xs font-semibold ${order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>{order.status}</span></div>
                    ))}</div>
                </Card>
            </div>
        </div>
    </div>
);

const ProductManagement = ({ onNavigate }) => (
    <div>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">My Products</h1>
            <Button onClick={() => onNavigate({ subPage: 'addProduct' })}><PlusCircle size={20}/> Add New Product</Button>
        </div>
        <Card>
            <table className="w-full text-left">
                <thead><tr className="border-b border-gray-700 text-sm text-gray-400"><th className="py-3 px-4">Product</th><th className="py-3 px-4">Price</th><th className="py-3 px-4">Stock</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">Actions</th></tr></thead>
                <tbody>{mockData.artisanProducts.map(p => (
                    <tr key={p.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-3 px-4 flex items-center gap-4"><img src={p.imageUrl} className="w-12 h-12 rounded-lg object-cover"/><div><p className="font-semibold text-white">{p.name}</p><p className="text-gray-500 text-xs">{p.category}</p></div></td>
                        <td className="py-3 px-4 text-gray-300">${p.price.toFixed(2)}</td>
                        <td className="py-3 px-4 text-gray-300">{p.stock}</td>
                        <td className="py-3 px-4"><span className={`px-2 py-1 text-xs rounded-full font-semibold ${p.status === 'Active' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>{p.status}</span></td>
                        <td className="py-3 px-4"><div className="flex gap-2"><button className="p-2 hover:bg-gray-700 rounded-md"><Edit size={16}/></button><button className="p-2 hover:bg-gray-700 rounded-md text-red-400"><Trash2 size={16}/></button></div></td>
                    </tr>
                ))}</tbody>
            </table>
        </Card>
    </div>
);

const OrderManagement = () => {
    const getStatusChip = (status) => {
        switch(status) {
            case 'Shipped': return 'bg-blue-500/20 text-blue-300';
            case 'Processing': return 'bg-yellow-500/20 text-yellow-300';
            case 'Delivered': return 'bg-green-500/20 text-green-300';
            case 'Cancelled': return 'bg-red-500/20 text-red-300';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };
    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Manage Orders</h1>
            <Card>
                 <div className="flex justify-between items-center mb-4">
                    <div className="relative w-full max-w-xs">
                        <Input id="search-orders" placeholder="Search orders..." icon={<Search className="h-5 w-5 text-gray-500"/>} />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead><tr className="border-b border-gray-700 text-sm text-gray-400"><th className="py-3 px-4">Order ID</th><th className="py-3 px-4">Customer</th><th className="py-3 px-4">Date</th><th className="py-3 px-4">Total</th><th className="py-3 px-4">Status</th><th className="py-3 px-4">Actions</th></tr></thead>
                        <tbody>{mockData.orders.map(order => (
                            <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                <td className="py-3 px-4 font-mono text-sm text-indigo-400">{order.id}</td>
                                <td className="py-3 px-4 text-gray-200">{order.customer}</td>
                                <td className="py-3 px-4 text-gray-400">{order.date}</td>
                                <td className="py-3 px-4 text-gray-300">${order.total.toFixed(2)}</td>
                                <td className="py-3 px-4"><span className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusChip(order.status)}`}>{order.status}</span></td>
                                <td className="py-3 px-4"><button className="p-2 hover:bg-gray-700 rounded-md"><MoreVertical size={16}/></button></td>
                            </tr>
                        ))}</tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

const CustomerManagement = () => (
    <div>
        <h1 className="text-4xl font-bold mb-8">Customers</h1>
        <Card>
             <div className="flex justify-between items-center mb-4">
                 <div className="relative w-full max-w-xs">
                    <Input id="search-customers" placeholder="Search customers..." icon={<Search className="h-5 w-5 text-gray-500"/>} />
                 </div>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead><tr className="border-b border-gray-700 text-sm text-gray-400"><th className="py-3 px-4">Name</th><th className="py-3 px-4">Email</th><th className="py-3 px-4">Joined</th><th className="py-3 px-4">Orders</th><th className="py-3 px-4">Total Spent</th></tr></thead>
                    <tbody>{mockData.customers.map(c => (
                        <tr key={c.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                            <td className="py-3 px-4 font-semibold text-white">{c.name}</td>
                            <td className="py-3 px-4 text-gray-400">{c.email}</td>
                            <td className="py-3 px-4 text-gray-400">{c.joinDate}</td>
                            <td className="py-3 px-4 text-gray-300">{c.totalOrders}</td>
                            <td className="py-3 px-4 font-semibold text-green-400">${c.totalSpent.toFixed(2)}</td>
                        </tr>
                    ))}</tbody>
                </table>
             </div>
        </Card>
    </div>
);

const AnalyticsPage = () => (
    <div>
        <h1 className="text-4xl font-bold mb-8">Analytics</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card><h3 className="text-xl font-semibold text-gray-200 mb-4">Monthly Sales</h3><Bar data={mockData.analytics.salesData} options={{ responsive: true }}/></Card>
            <Card><h3 className="text-xl font-semibold text-gray-200 mb-4">Traffic Sources</h3><div className="max-w-xs mx-auto"><Doughnut data={mockData.analytics.trafficSourceData} /></div></Card>
        </div>
    </div>
);

const SettingsPage = () => {
    const [details, setDetails] = useState(mockData.artisanDetails);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDetails(prev => ({...prev, [name]: value}));
    };
    const handleSocialChange = (e) => {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, social: { ...prev.social, [name]: value } }));
    };

    return (
        <div>
            <h1 className="text-4xl font-bold mb-8">Settings</h1>
            <div className="max-w-4xl mx-auto">
                <Card>
                    <h2 className="text-2xl font-semibold mb-6 text-white">Business Profile</h2>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input id="name" label="Your Name" name="name" value={details.name} onChange={handleInputChange} icon={<User className="h-5 w-5 text-gray-500"/>} />
                            <Input id="businessName" label="Business Name" name="businessName" value={details.businessName} onChange={handleInputChange} icon={<Building className="h-5 w-5 text-gray-500"/>}/>
                        </div>
                        <Input id="email" label="Contact Email" name="email" type="email" value={details.email} onChange={handleInputChange} icon={<Mail className="h-5 w-5 text-gray-500"/>}/>
                        <Textarea id="bio" label="About Your Business" name="bio" placeholder="Tell your story..." value={details.bio} onChange={handleInputChange} />
                        
                        <h3 className="text-xl font-semibold pt-4 border-t border-gray-700 text-white">Social Links</h3>
                        <Input id="instagram" label="Instagram" name="instagram" placeholder="https://instagram.com/..." value={details.social.instagram} onChange={handleSocialChange} icon={<LinkIcon className="h-5 w-5 text-gray-500"/>}/>
                        <Input id="facebook" label="Facebook" name="facebook" placeholder="https://facebook.com/..." value={details.social.facebook} onChange={handleSocialChange} icon={<LinkIcon className="h-5 w-5 text-gray-500"/>}/>

                        <div className="flex justify-end pt-4">
                            <Button><Save size={18}/> Save Changes</Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};


// --- ADD PRODUCT PAGE WITH AI FEATURES ---
const AddProductPage = ({ onNavigate }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [imageQuality, setImageQuality] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    
    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImagePreview(URL.createObjectURL(file));
            setIsAnalyzing(true);
            setImageQuality(null);
            setTimeout(() => { // Mock AI analysis
                setImageQuality({
                    clarity: 'Good',
                    background: 'Clean',
                    defect: 'Minor shadow detected in bottom left. Consider re-shooting in brighter, more even light.'
                });
                setIsAnalyzing(false);
            }, 2000);
        }
    };
    
    return (
        <div>
             <h1 className="text-4xl font-bold mb-2">Product Listing Assistant</h1>
             <p className="text-gray-400 mb-8">Use our AI tools to create the perfect listing.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <form className="space-y-6">
                            <Input id="productName" label="Product Name" placeholder="e.g., Handcrafted Clay Vase" />
                            <Textarea id="description" label="Product Description" placeholder="Describe your product..."/>
                            <Button variant="secondary" className="w-full"><Wand2 size={18} /> Generate Description with AI</Button>
                            <Input id="category" label="Category" placeholder="e.g., Pottery" />
                            <div className="flex gap-4">
                                <Input id="price" label="Price" placeholder="$" className="flex-1" />
                                <Input id="stock" label="Stock" type="number" placeholder="0" className="flex-1" />
                            </div>
                        </form>
                    </Card>
                </div>
                <div className="lg:col-span-1 flex flex-col gap-8">
                    <Card>
                        <h3 className="text-xl font-semibold mb-4 text-white">Smart Pricing</h3>
                        <p className="text-gray-400 text-sm mb-4">Get AI-powered price recommendations based on market data.</p>
                        <Button className="w-full"><DollarSign size={18} /> Get Recommendation</Button>
                    </Card>
                    <Card>
                         <h3 className="text-xl font-semibold mb-4 text-white">Image Quality Detection</h3>
                         <div className="w-full h-48 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-600 relative">
                            {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover rounded-lg"/> : <p className="text-gray-500">Upload an image</p>}
                            <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageChange} accept="image/*" />
                         </div>
                         {isAnalyzing && <p className="text-center mt-4 text-indigo-400">AI is analyzing your image...</p>}
                         {imageQuality && (
                            <div className="mt-4 space-y-2 text-sm">
                                <p><strong>Clarity:</strong> <span className="text-green-400">{imageQuality.clarity}</span></p>
                                <p><strong>Background:</strong> <span className="text-green-400">{imageQuality.background}</span></p>
                                <p><strong>AI Suggestion:</strong> <span className="text-orange-400">{imageQuality.defect}</span></p>
                            </div>
                         )}
                    </Card>
                </div>
            </div>
             <div className="mt-8 flex justify-end gap-4">
                <Button onClick={() => onNavigate({ page: 'dashboard', subPage: 'products' })} variant="secondary">Cancel</Button>
                <Button>Save Product</Button>
             </div>
        </div>
    );
};

// --- UNIVERSAL PAGES ---
const LoginPage = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState('customer');
    const handleSubmit = (e) => { e.preventDefault(); onLogin({ email: e.target.email.value, role }); };
    return (<div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-black p-4"><Card className="w-full max-w-md"><h2 className="text-3xl font-bold text-center text-white mb-2">{isLogin ? 'Welcome Back' : 'Join Kalaverse'}</h2><p className="text-center text-gray-400 mb-8">{isLogin ? 'Sign in to your universe.' : 'Create an account to begin.'}</p><form onSubmit={handleSubmit} className="space-y-6"><Input id="email" type="email" label="Email Address" placeholder="you@example.com" required /><Input id="password" type="password" label="Password" placeholder="••••••••" required /><div><label className="block text-sm font-medium text-gray-400 mb-2">{isLogin ? 'Log in as:' : 'Sign up as:'}</label><div className="flex gap-4"><button type="button" onClick={() => setRole('customer')} className={`flex-1 p-3 rounded-lg border-2 transition ${role === 'customer' ? 'border-indigo-500 bg-indigo-900/50 text-white' : 'border-gray-700 text-gray-300'}`}>Customer</button><button type="button" onClick={() => setRole('artisan')} className={`flex-1 p-3 rounded-lg border-2 transition ${role === 'artisan' ? 'border-indigo-500 bg-indigo-900/50 text-white' : 'border-gray-700 text-gray-300'}`}>Artisan</button></div></div><Button type="submit" className="w-full">{isLogin ? 'Login' : 'Sign Up'}</Button></form><p className="text-center text-sm text-gray-400 mt-6">{isLogin ? "Don't have an account? " : "Already have an account? "}<a onClick={() => setIsLogin(!isLogin)} className="font-medium text-indigo-400 hover:text-indigo-300 cursor-pointer">{isLogin ? 'Sign up' : 'Login'}</a></p></Card></div>);
};
const ChatbotPage = ({ isAssistant = false }) => {
    const initialMessage = isAssistant ? 'Hello! As your AI assistant, I can help with product descriptions, pricing, and analyzing feedback.' : 'Hello! Welcome to Kalaverse. How can I help you?';
    const [messages, setMessages] = useState([{ from: 'bot', text: initialMessage }]);
    const [input, setInput] = useState('');
    const handleSend = () => { if (input.trim() === '') return; setMessages(prev => [...prev, { from: 'user', text: input }]); setInput(''); setTimeout(() => setMessages(prev => [...prev, { from: 'bot', text: `Mock response to: "${input}"` }]), 1000);};
    return (<div className="flex flex-col h-full"><h1 className="text-4xl font-bold mb-8">{isAssistant ? 'AI Assistant' : 'Customer Support Chat'}</h1><Card className="flex-grow flex flex-col bg-[#09090b]"><div className="flex-grow overflow-y-auto pr-4 space-y-4">{messages.map((msg, index) => (<div key={index} className={`flex items-end gap-3 ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-lg px-4 py-3 rounded-2xl ${msg.from === 'user' ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>{msg.text}</div></div>))}</div><div className="mt-6 flex gap-4"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder="Type your message..." className="w-full bg-gray-800 text-white px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500" /><Button onClick={handleSend}>Send</Button></div></Card></div>);
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [user, setUser] = useState(null); 
  const [navState, setNavState] = useState({ page: 'home', subPage: 'dashboard' });
  const [language, setLanguage] = useState('en');
  const t = useTranslation(language);

  const handleLogin = (userData) => { setUser(userData); setNavState(userData.role === 'artisan' ? { page: 'dashboard', subPage: 'dashboard' } : { page: 'home' }); };
  const handleLogout = () => { setUser(null); setNavState({ page: 'home' }); };
  const handleNavigate = (state) => {
    setNavState(s => ({...s, ...state}));
  };
  
  const renderPage = () => {
    if (!user) return <LoginPage onLogin={handleLogin} />;
    
    switch(navState.page) {
        case 'home':
            return <CustomerHomePage onNavigate={handleNavigate} t={t} />;
        
        case 'dashboard':
            if (user.role === 'artisan') {
                return <ArtisanDashboard onNavigate={handleNavigate} activeSubPage={navState.subPage} />;
            }
            return <CustomerHomePage onNavigate={handleNavigate} t={t} />;

        case 'chatbot': 
            return <div className="p-8 bg-black h-[calc(100vh-80px)]"><ChatbotPage /></div>;
            
        default: 
            return <CustomerHomePage onNavigate={handleNavigate} t={t} />;
    }
  };

  return (
    <div className="bg-black min-h-screen font-sans">
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      <Header user={user} onLogout={handleLogout} onNavigate={handleNavigate} onLanguageChange={setLanguage} t={t} />
      <main>{renderPage()}</main>
    </div>
  );
}
