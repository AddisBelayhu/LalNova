import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  Users,
  Briefcase,
  MessageSquare,
  Plus,
  Edit,
  Trash2,
  Eye,
  X
} from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { getCategories, getCategoryName } from '../utils/categories';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/richtext.css';
import { getPreviewText } from '../utils/htmlUtils';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [categories, setCategories] = useState(() => getCategories());
  const [formData, setFormData] = useState({});
  const { user, logout } = useAuth();

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      ['link'],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link', 'align', 'color', 'background'
  ];

  useEffect(() => {
    localStorage.setItem('adminCategories', JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = () => {
    const id = prompt('Enter category ID (e.g., MOBILE_DEV):');
    const name = prompt('Enter category display name (e.g., Mobile Development):');

    if (id && name) {
      const newCategory = { id: id.toUpperCase(), name };
      setCategories([...categories, newCategory]);
      toast.success('Category added successfully');
    }
  };

  const handleEditCategory = (category) => {
    const newName = prompt('Enter new display name:', category.name);
    if (newName && newName !== category.name) {
      setCategories(categories.map((cat) =>
        cat.id === category.id ? { ...cat, name: newName } : cat
      ));
      toast.success('Category updated successfully');
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    const servicesUsingCategory = services.filter((service) => service.category === categoryId);
    if (servicesUsingCategory.length > 0) {
      toast.error(`Cannot delete category. ${servicesUsingCategory.length} service(s) are using it.`);
      return;
    }

    setCategories(categories.filter((cat) => cat.id !== categoryId));
    toast.success('Category deleted successfully');
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, projectsRes, messagesRes] = await Promise.all([
        axios.get('/api/admin/services'),
        axios.get('/api/admin/projects'),
        axios.get('/api/admin/messages')
      ]);

      setServices(servicesRes.data);
      setProjects(projectsRes.data);
      setMessages(messagesRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    }
  };

  const handleCreate = (type) => {
    setModalType(type);
    setEditingItem(null);
    setFormData(getEmptyFormData(type));
    setShowModal(true);
  };

  const handleEdit = (type, item) => {
    setModalType(type);
    setEditingItem(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`/api/admin/${type}/${id}`);
      toast.success('Item deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let submitData = { ...formData };

      if (modalType === 'services') {
        submitData = {
          title: (formData.title || '').trim(),
          description: (formData.description || '').trim(),
          icon: (formData.icon || 'code').trim(),
          category: formData.category || 'SOFTWARE_DEV'
        };

        if (submitData.title.length < 3 || submitData.title.length > 200) {
          toast.error('Service title must be between 3 and 200 characters');
          return;
        }
        if (submitData.description.length < 10 || submitData.description.length > 1000) {
          toast.error('Service description must be between 10 and 1000 characters');
          return;
        }
        if (!submitData.icon) {
          toast.error('Icon field is required');
          return;
        }
      } else if (modalType === 'projects') {
        submitData = {
          title: (formData.title || '').trim(),
          description: (formData.description || '').trim(),
          technologiesUsed: (formData.technologiesUsed || '').trim(),
          imageUrl: (formData.imageUrl || '').trim() || undefined,
          link: (formData.link || '').trim() || undefined
        };

        if (!submitData.imageUrl) delete submitData.imageUrl;
        if (!submitData.link) delete submitData.link;

        if (submitData.title.length < 3 || submitData.title.length > 200) {
          toast.error('Project title must be between 3 and 200 characters');
          return;
        }
        if (submitData.description.length < 10 || submitData.description.length > 1000) {
          toast.error('Project description must be between 10 and 1000 characters');
          return;
        }
        if (submitData.technologiesUsed.length < 1) {
          toast.error('Technologies field is required');
          return;
        }
      }

      if (editingItem) {
        await axios.put(`/api/admin/${modalType}/${editingItem.id}`, submitData);
        toast.success('Item updated successfully');
      } else {
        await axios.post(`/api/admin/${modalType}`, submitData);
        toast.success('Item created successfully');
      }

      setShowModal(false);
      fetchData();
    } catch (error) {
      if (error.response?.data?.details) {
        toast.error(`Validation Error: ${error.response.data.details.join(', ')}`);
      } else {
        toast.error(error.response?.data?.error || 'Failed to save item');
      }
    }
  };

  const getEmptyFormData = (type) => {
    switch (type) {
      case 'services':
        return {
          title: '',
          description: '',
          icon: 'code',
          category: 'SOFTWARE_DEV'
        };
      case 'projects':
        return {
          title: '',
          description: '',
          technologiesUsed: '',
          imageUrl: '',
          link: ''
        };
      default:
        return {};
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'services', label: 'Services', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Users },
    { id: 'categories', label: 'Categories', icon: Edit },
    { id: 'messages', label: 'Messages', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <div
          className={
            `fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-200 ` +
            `${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`
          }
        >
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-800">
            <div className="font-semibold tracking-wide">LalNova Admin</div>
            <button
              className="lg:hidden text-slate-300 hover:text-white"
              onClick={() => setSidebarOpen(false)}
              type="button"
            >
              <X size={20} />
            </button>
          </div>

          <nav className="px-4 py-6 space-y-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={
                    `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ` +
                    `${isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`
                  }
                >
                  <tab.icon size={18} />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}

            <div className="pt-6">
              <div className="h-px bg-slate-800" />
            </div>

            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </nav>
        </div>

        <div className="flex-1 lg:pl-0">
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
            <div className="h-16 px-4 sm:px-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl hover:bg-slate-100"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu size={20} />
                </button>

                <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 text-slate-600 w-[360px]">
                  <Search size={18} />
                  <input
                    className="bg-transparent outline-none text-sm w-full"
                    placeholder="Search..."
                    aria-label="Search"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="button" className="w-10 h-10 rounded-xl hover:bg-slate-100 inline-flex items-center justify-center">
                  <Bell size={18} />
                </button>
                <button type="button" className="w-10 h-10 rounded-xl hover:bg-slate-100 inline-flex items-center justify-center">
                  <Settings size={18} />
                </button>

                <div className="flex items-center gap-2 pl-2">
                  <div className="w-9 h-9 rounded-xl bg-slate-200" />
                  <div className="hidden sm:block">
                    <div className="text-sm font-semibold text-slate-900">{user?.name || 'Admin'}</div>
                    <div className="text-xs text-slate-500">{user?.email || 'admin'}</div>
                  </div>
                  <ChevronDown size={16} className="text-slate-400" />
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 sm:p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-600">Manage your website content and view analytics</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="rounded-2xl p-5 bg-gradient-to-r from-orange-400 to-rose-400 text-white shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm/5 opacity-90">Total Services</div>
                      <div className="text-3xl font-bold mt-1">{services.length}</div>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                      <Briefcase size={18} />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl p-5 bg-gradient-to-r from-emerald-400 to-teal-400 text-white shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm/5 opacity-90">Total Projects</div>
                      <div className="text-3xl font-bold mt-1">{projects.length}</div>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                      <Users size={18} />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl p-5 bg-gradient-to-r from-fuchsia-500 to-violet-500 text-white shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm/5 opacity-90">New Messages</div>
                      <div className="text-3xl font-bold mt-1">{messages.length}</div>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                      <MessageSquare size={18} />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl p-5 bg-gradient-to-r from-sky-400 to-cyan-400 text-white shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm/5 opacity-90">Categories</div>
                      <div className="text-3xl font-bold mt-1">{categories.length}</div>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center">
                      <BarChart3 size={18} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
                  <div className="font-semibold text-slate-900">
                    {tabs.find((t) => t.id === activeTab)?.label}
                  </div>

                  {activeTab === 'services' && (
                    <button onClick={() => handleCreate('services')} className="btn-primary flex items-center" type="button">
                      <Plus className="mr-2" size={20} />
                      Add Service
                    </button>
                  )}

                  {activeTab === 'projects' && (
                    <button onClick={() => handleCreate('projects')} className="btn-primary flex items-center" type="button">
                      <Plus className="mr-2" size={20} />
                      Add Project
                    </button>
                  )}

                  {activeTab === 'categories' && (
                    <button onClick={handleAddCategory} className="btn-primary flex items-center" type="button">
                      <Plus className="mr-2" size={20} />
                      Add Category
                    </button>
                  )}
                </div>

                <div className="p-5">
                  {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="font-semibold text-slate-900">Quick Insights</div>
                            <div className="text-sm text-slate-600">Your content summary</div>
                          </div>
                          <button type="button" className="btn-secondary">Refresh</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="rounded-2xl bg-white border border-slate-200 p-4">
                            <div className="text-sm text-slate-600">Services</div>
                            <div className="text-2xl font-bold text-slate-900">{services.length}</div>
                          </div>
                          <div className="rounded-2xl bg-white border border-slate-200 p-4">
                            <div className="text-sm text-slate-600">Projects</div>
                            <div className="text-2xl font-bold text-slate-900">{projects.length}</div>
                          </div>
                          <div className="rounded-2xl bg-white border border-slate-200 p-4">
                            <div className="text-sm text-slate-600">Categories</div>
                            <div className="text-2xl font-bold text-slate-900">{categories.length}</div>
                          </div>
                          <div className="rounded-2xl bg-white border border-slate-200 p-4">
                            <div className="text-sm text-slate-600">Messages</div>
                            <div className="text-2xl font-bold text-slate-900">{messages.length}</div>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="font-semibold text-slate-900 mb-3">Latest Messages</div>
                        <div className="space-y-3">
                          {messages.slice(0, 4).map((m) => (
                            <div key={m.id} className="rounded-xl border border-slate-200 p-3">
                              <div className="flex items-center justify-between">
                                <div className="font-medium text-slate-900 text-sm">{m.name}</div>
                                <div className="text-xs text-slate-500">{new Date(m.createdAt).toLocaleDateString()}</div>
                              </div>
                              <div className="text-xs text-slate-600 mt-1 line-clamp-2">{m.message}</div>
                            </div>
                          ))}

                          {messages.length === 0 && (
                            <div className="text-sm text-slate-600">No messages yet.</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'services' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services.map((service) => (
                        <div key={service.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                          <div className="flex justify-between items-start gap-3 mb-3">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-slate-900 truncate">{service.title}</h3>
                              <div className="text-xs text-slate-600 mt-1">
                                {categories.find((cat) => cat.id === service.category)?.name || service.category}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleEdit('services', service)} className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 inline-flex items-center justify-center" type="button">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleDelete('services', service.id)} className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-red-600 inline-flex items-center justify-center" type="button">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          <p className="text-slate-600 text-sm">{getPreviewText(service.description, 140)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'projects' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map((project) => (
                        <div key={project.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                          <div className="flex justify-between items-start gap-3 mb-3">
                            <div className="min-w-0">
                              <h3 className="font-semibold text-slate-900 truncate">{project.title}</h3>
                              <p className="text-slate-600 text-sm mt-1 line-clamp-2">{project.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleEdit('projects', project)} className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 inline-flex items-center justify-center" type="button">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleDelete('projects', project.id)} className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-red-600 inline-flex items-center justify-center" type="button">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {project.technologiesUsed
                              ?.split(',')
                              .map((t) => t.trim())
                              .filter(Boolean)
                              .slice(0, 6)
                              .map((tech) => (
                                <span key={tech} className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700">
                                  {tech}
                                </span>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'categories' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {categories.map((category) => (
                        <div key={category.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                          <div className="flex justify-between items-start gap-3">
                            <div>
                              <div className="font-semibold text-slate-900">{category.name}</div>
                              <div className="text-xs text-slate-600 mt-1">ID: {category.id}</div>
                              <div className="text-xs text-slate-500 mt-2">
                                Used by {services.filter((s) => s.category === category.id).length} service(s)
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleEditCategory(category)} className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 inline-flex items-center justify-center" type="button">
                                <Edit size={16} />
                              </button>
                              <button onClick={() => handleDeleteCategory(category.id)} className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-red-600 inline-flex items-center justify-center" type="button">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'messages' && (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div key={message.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                          <div className="flex justify-between items-start gap-3 mb-2">
                            <div>
                              <div className="font-semibold text-slate-900">{message.name}</div>
                              <div className="text-sm text-slate-600">{message.email}</div>
                              {message.phone && <div className="text-sm text-slate-600">{message.phone}</div>}
                            </div>
                            <button
                              onClick={() => handleDelete('messages', message.id)}
                              className="w-9 h-9 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-red-600 inline-flex items-center justify-center"
                              type="button"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <p className="text-slate-700">{message.message}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-secondary">
                {editingItem ? 'Edit' : 'Add'} {modalType.slice(0, -1)}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {modalType === 'services' && (
                <>
                  <input
                    type="text"
                    placeholder="Service Title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Service Description
                    </label>
                    <ReactQuill
                      theme="snow"
                      value={formData.description || ''}
                      onChange={(content) => setFormData({ ...formData, description: content })}
                      modules={quillModules}
                      formats={quillFormats}
                      placeholder="Enter service description with rich formatting..."
                      style={{ height: '200px', marginBottom: '50px' }}
                    />
                  </div>
                  <select
                    value={formData.category || 'SOFTWARE_DEV'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </>
              )}

              {modalType === 'projects' && (
                <>
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                  <textarea
                    placeholder="Project Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={3}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Technologies (comma-separated)"
                    value={formData.technologiesUsed || ''}
                    onChange={(e) => setFormData({ ...formData, technologiesUsed: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="url"
                    placeholder="Project Link"
                    value={formData.link || ''}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </>
              )}

              <div className="flex space-x-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingItem ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
