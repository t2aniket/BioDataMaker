'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Paintbrush, Languages, LogOut, Loader2, Sparkles, Plus, Search, CheckCircle, RefreshCcw, DollarSign, Eye, EyeOff } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';

interface Template {
  id: string;
  slug: string;
  name: string;
  category: string;
  priceInPaise: number;
  isFree: boolean;
  isActive: boolean;
  languageSupport: string[];
}

interface Order {
  id: string;
  orderNumber: string;
  templateId: string;
  amountInPaise: number;
  status: string;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: string;
  paidAt: string | null;
  template: { name: string };
}

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabQuery = searchParams.get('tab');

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'templates' | 'languages'>('overview');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);

  // Stats
  const [stats, setStats] = useState<any>(null);

  // Orders listing
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderQuery, setOrderQuery] = useState<string>('');
  const [isSearchingOrders, setIsSearchingOrders] = useState<boolean>(false);

  // Templates listing
  const [templates, setTemplates] = useState<Template[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState<boolean>(false);

  // New Template Form States
  const [newTmpl, setNewTmpl] = useState({
    slug: '',
    name: '',
    category: 'Classic',
    price: 10,
    isFree: false,
    isActive: true,
  });

  // Languages/Translations
  const [translationLang, setTranslationLang] = useState<string>('en');
  const [translationsJson, setTranslationsJson] = useState<string>('');
  const [transSearch, setTransSearch] = useState<string>('');

  // Handle Tab query parameter change
  useEffect(() => {
    if (tabQuery && ['overview', 'orders', 'templates', 'languages'].includes(tabQuery)) {
      setActiveTab(tabQuery as any);
    }
  }, [tabQuery]);

  // 1. Authenticate and Load Data
  useEffect(() => {
    async function loadDashboard() {
      setIsLoading(true);
      try {
        // Load stats to verify session
        const statsRes = await fetch('/api/admin/stats');
        if (statsRes.status === 401) {
          router.replace('/admin/login');
          return;
        }

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
          setIsAuthorized(true);

          // Fetch orders and templates
          await fetchOrders();
          await fetchTemplates();
          await fetchTranslations('en');
        }
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const fetchOrders = async (query?: string) => {
    setIsSearchingOrders(true);
    try {
      const url = query ? `/api/orders?query=${encodeURIComponent(query)}` : '/api/orders';
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchingOrders(false);
    }
  };

  const fetchTemplates = async () => {
    try {
      const res = await fetch('/api/templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTranslations = async (lang: string) => {
    try {
      const res = await fetch(`/api/translations?lang=${lang}`);
      if (res.ok) {
        const data = await res.json();
        setTranslationsJson(JSON.stringify(data, null, 2));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 2. Action handlers
  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  };

  // Update order status (Mark Refunded, Mark Paid, etc.)
  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      });

      if (res.ok) {
        // Refresh orders & stats
        await fetchOrders(orderQuery);
        const statsRes = await fetch('/api/admin/stats');
        if (statsRes.ok) setStats(await statsRes.json());
      } else {
        alert('Failed to update status');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Template active state
  const handleToggleTemplateActive = async (t: Template) => {
    try {
      const res = await fetch('/api/templates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: t.id,
          isActive: !t.isActive,
        }),
      });

      if (res.ok) {
        await fetchTemplates();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update template price / edit
  const handleUpdateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;

    try {
      const res = await fetch('/api/templates', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingTemplate.id,
          name: editingTemplate.name,
          category: editingTemplate.category,
          priceInPaise: editingTemplate.priceInPaise,
          isFree: editingTemplate.isFree,
        }),
      });

      if (res.ok) {
        setEditingTemplate(null);
        await fetchTemplates();
      } else {
        alert('Failed to update template');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create Template
  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: newTmpl.slug,
          name: newTmpl.name,
          category: newTmpl.category,
          priceInPaise: newTmpl.isFree ? 0 : newTmpl.price * 100,
          isFree: newTmpl.isFree,
          isActive: newTmpl.isActive,
          languageSupport: ['en', 'hi', 'mr'], // Default seeded
          previewImage: `/templates/${newTmpl.slug}.jpg`,
          styleConfig: { theme: 'light', font: 'sans' },
          supportedExports: ['IMAGE', 'PDF', 'DOCX'],
        }),
      });

      if (res.ok) {
        setIsCreatingTemplate(false);
        setNewTmpl({ slug: '', name: '', category: 'Classic', price: 10, isFree: false, isActive: true });
        await fetchTemplates();
      } else {
        const err = await res.json();
        alert(err.error || 'Failed to create template');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-slate-100">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mx-auto" />
          <p className="text-slate-400 font-medium">Authorizing dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      {/* Top navbar */}
      <header className="border-b border-slate-900 bg-slate-900/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
              B
            </span>
            <span className="text-xl font-bold bg-linear-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
              Admin Console
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Left Side: Sidebar navigation */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900/40 p-4 rounded-3xl border border-slate-900 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'overview'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              Overview
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'orders'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <ShoppingCart className="h-5 w-5" />
              Orders list
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'templates'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Paintbrush className="h-5 w-5" />
              Templates
            </button>

            <button
              onClick={() => setActiveTab('languages')}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'languages'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Languages className="h-5 w-5" />
              Translations
            </button>
          </div>
        </aside>

        {/* Right Side: Tab Contents */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-8 animate-fadeIn">
              {/* Stats Card Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Revenue</span>
                  <p className="text-3xl font-black text-indigo-400">₹{stats.totalRevenue}</p>
                </div>
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Paid Orders</span>
                  <p className="text-3xl font-black text-white">{stats.paidOrders}</p>
                </div>
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Drafts</span>
                  <p className="text-3xl font-black text-white">{stats.totalDrafts}</p>
                </div>
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Downloads</span>
                  <p className="text-3xl font-black text-white">{stats.totalDownloads}</p>
                </div>
              </div>

              {/* Site Counters Details (NEVER fake numbers) */}
              <div className="bg-slate-900/40 p-8 rounded-3xl border border-slate-900 space-y-6">
                <h2 className="text-xl font-bold border-b border-slate-800 pb-4">
                  Database & System Counters <span className="text-xs text-slate-500 font-normal">(Real Stats)</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500">Real Biodatas Created</span>
                    <p className="text-2xl font-black text-indigo-400">{stats.counters.total_biodatas_generated}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500">Real Downloads Recorded</span>
                    <p className="text-2xl font-black text-pink-400">{stats.counters.total_downloads}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs text-slate-500">Real Paid Orders Success</span>
                    <p className="text-2xl font-black text-emerald-400">{stats.counters.total_paid_orders}</p>
                  </div>
                </div>
              </div>

              {/* Popular templates & popular languages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 space-y-4">
                  <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Popular Templates</h3>
                  <div className="divide-y divide-slate-800">
                    {stats.popularTemplates.map((t: any) => (
                      <div key={t.id} className="py-2.5 flex justify-between text-xs">
                        <span className="font-semibold">{t.name}</span>
                        <span className="text-slate-400 font-bold">{t.count} sales</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-900 space-y-4">
                  <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Popular Languages</h3>
                  <div className="divide-y divide-slate-800">
                    {stats.popularLanguages.map((l: any) => (
                      <div key={l.code} className="py-2.5 flex justify-between text-xs">
                        <span className="font-semibold uppercase">{l.code}</span>
                        <span className="text-slate-400 font-bold">{l.count} drafts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS LIST */}
          {activeTab === 'orders' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Search Orders */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  fetchOrders(orderQuery);
                }}
                className="flex items-center gap-3 bg-slate-900/40 p-4 rounded-2xl border border-slate-900"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search by Order #, Payment ID, Email..."
                    value={orderQuery}
                    onChange={(e) => setOrderQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-0 outline-hidden text-xs"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                </div>
                <button
                  type="submit"
                  disabled={isSearchingOrders}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Search
                </button>
              </form>

              {/* Table */}
              <div className="bg-slate-900/40 border border-slate-900 rounded-3xl overflow-hidden overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-2xs tracking-wider">
                    <tr>
                      <th className="px-6 py-4">Order Number</th>
                      <th className="px-6 py-4">Template</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Payment ID</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {orders.length > 0 ? (
                      orders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-900/20">
                          <td className="px-6 py-4 font-semibold text-indigo-400">{o.orderNumber}</td>
                          <td className="px-6 py-4">{o.template?.name || 'Unknown'}</td>
                          <td className="px-6 py-4">₹{o.amountInPaise / 100}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-0.5 rounded-md font-bold text-3xs ${
                                o.status === 'PAID'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                                  : o.status === 'REFUNDED'
                                  ? 'bg-blue-950 text-blue-400 border border-blue-900'
                                  : 'bg-rose-950 text-rose-400 border border-rose-900'
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-mono text-3xs">{o.razorpayPaymentId || '-'}</td>
                          <td className="px-6 py-4 text-slate-500">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 flex gap-2">
                            {o.status === 'CREATED' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(o.id, 'PAID')}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-1 rounded-md text-3xs cursor-pointer"
                              >
                                Mark Paid
                              </button>
                            )}
                            {o.status === 'PAID' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(o.id, 'REFUNDED')}
                                className="bg-rose-900 hover:bg-rose-850 text-white font-bold px-2 py-1 rounded-md text-3xs cursor-pointer"
                              >
                                Refund
                              </button>
                            )}
                            {o.status === 'REFUNDED' && (
                              <button
                                onClick={() => handleUpdateOrderStatus(o.id, 'PAID')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2 py-1 rounded-md text-3xs cursor-pointer"
                              >
                                Re-enable
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-slate-500">
                          No orders found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TEMPLATES MANAGEMENT */}
          {activeTab === 'templates' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-900">
                <h3 className="font-bold text-sm text-slate-400 uppercase tracking-wider">Templates ({templates.length})</h3>
                <button
                  onClick={() => setIsCreatingTemplate(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="h-4 w-4" /> Create Template
                </button>
              </div>

              {/* Create Modal Simulation */}
              {isCreatingTemplate && (
                <form onSubmit={handleCreateTemplate} className="bg-slate-900/60 p-6 rounded-2xl border border-indigo-950 space-y-4 max-w-xl">
                  <h4 className="font-bold text-sm text-white">Create New Template</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Slug (e.g. simple-blue)"
                      value={newTmpl.slug}
                      required
                      onChange={(e) => setNewTmpl({ ...newTmpl, slug: e.target.value })}
                      className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Name"
                      value={newTmpl.name}
                      required
                      onChange={(e) => setNewTmpl({ ...newTmpl, name: e.target.value })}
                      className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs"
                    />
                    <select
                      value={newTmpl.category}
                      onChange={(e) => setNewTmpl({ ...newTmpl, category: e.target.value })}
                      className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs cursor-pointer"
                    >
                      <option value="Simple Free">Simple Free</option>
                      <option value="Modern Free">Modern Free</option>
                      <option value="Classic">Classic</option>
                      <option value="Elegant">Elegant</option>
                      <option value="Traditional">Traditional</option>
                      <option value="Regional">Regional</option>
                      <option value="Royal">Royal</option>
                      <option value="Premium Photo">Premium Photo</option>
                    </select>
                    <input
                      type="number"
                      placeholder="Price in Rs (e.g. 10)"
                      value={newTmpl.price}
                      onChange={(e) => setNewTmpl({ ...newTmpl, price: Number(e.target.value) })}
                      className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={newTmpl.isFree}
                        onChange={(e) => setNewTmpl({ ...newTmpl, isFree: e.target.checked })}
                      />
                      Is Free
                    </label>
                    <label className="flex items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={newTmpl.isActive}
                        onChange={(e) => setNewTmpl({ ...newTmpl, isActive: e.target.checked })}
                      />
                      Is Active
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer">
                      Save
                    </button>
                    <button type="button" onClick={() => setIsCreatingTemplate(false)} className="bg-slate-800 hover:bg-slate-750 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Editing Template Form */}
              {editingTemplate && (
                <form onSubmit={handleUpdateTemplate} className="bg-slate-900/60 p-6 rounded-2xl border border-indigo-950 space-y-4 max-w-xl">
                  <h4 className="font-bold text-sm text-white">Edit Template: {editingTemplate.name}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={editingTemplate.name}
                      required
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, name: e.target.value })}
                      className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs"
                    />
                    <input
                      type="number"
                      placeholder="Price in Paise"
                      value={editingTemplate.priceInPaise}
                      required
                      onChange={(e) => setEditingTemplate({ ...editingTemplate, priceInPaise: Number(e.target.value) })}
                      className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs"
                    />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={editingTemplate.isFree}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, isFree: e.target.checked })}
                      />
                      Is Free
                    </label>
                    <label className="flex items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={editingTemplate.isActive}
                        onChange={(e) => setEditingTemplate({ ...editingTemplate, isActive: e.target.checked })}
                      />
                      Is Active
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer">
                      Update
                    </button>
                    <button type="button" onClick={() => setEditingTemplate(null)} className="bg-slate-800 hover:bg-slate-750 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Grid list of templates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {templates.map((t) => (
                  <div key={t.id} className="bg-slate-900/40 p-5 rounded-2xl border border-slate-900 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-white">{t.name}</h4>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-bold uppercase">{t.category}</span>
                      </div>
                      <p className="text-2xs text-slate-500 mt-1">Slug: {t.slug}</p>
                      <p className="text-xs font-bold text-indigo-400 mt-2">
                        {t.isFree ? 'Free' : `₹${t.priceInPaise / 100}`}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 gap-2">
                      <button
                        onClick={() => handleToggleTemplateActive(t)}
                        className={`inline-flex items-center gap-1 text-2xs font-semibold px-2 py-1 rounded-md cursor-pointer ${
                          t.isActive
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-900'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {t.isActive ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                        {t.isActive ? 'Active' : 'Inactive'}
                      </button>

                      <button
                        onClick={() => setEditingTemplate(t)}
                        className="bg-indigo-950 text-indigo-400 border border-indigo-900/50 hover:bg-indigo-900 font-bold px-3 py-1 rounded-md text-2xs cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LANGUAGES / TRANSLATIONS */}
          {activeTab === 'languages' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-900 gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Language:</span>
                  <select
                    value={translationLang}
                    onChange={(e) => {
                      setTranslationLang(e.target.value);
                      fetchTranslations(e.target.value);
                    }}
                    className="bg-slate-950 border border-slate-800 p-2 rounded-lg text-xs cursor-pointer font-bold"
                  >
                    {SUPPORTED_LANGUAGES.map((l: any) => (
                      <option key={l.code} value={l.code}>
                        {l.name} ({l.code})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const blob = new Blob([translationsJson], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `${translationLang}.json`;
                      link.click();
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3 py-2 rounded-xl cursor-pointer"
                  >
                    Export JSON
                  </button>
                </div>
              </div>

              {/* JSON Editor Box */}
              <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-900 space-y-3">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">Translation Dictionary View</h4>
                <textarea
                  readOnly
                  value={translationsJson}
                  rows={20}
                  className="w-full bg-slate-950 border border-slate-800 p-4 rounded-xl text-3xs font-mono text-indigo-300 outline-hidden resize-none"
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-900 text-center text-xs text-slate-600 bg-slate-950/60 no-print">
        <p>© 2026 Free Biodata Maker. Admin Console.</p>
      </footer>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-100">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mx-auto" />
          <p className="text-slate-400 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}
