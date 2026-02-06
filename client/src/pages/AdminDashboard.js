import React, { useState, useEffect } from 'react';
import {
  BarChart3,
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
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  // Initialize categories from shared utility
  const [categories, setCategories] = useState(() => getCategories());
  const [formData, setFormData] = useState({});

  // Rich text editor configuration
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      ['link'],
      [{ 'align': [] }],
      [{ 'color': [] }, { 'background': [] }],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link', 'align', 'color', 'background'
  ];

  // Save categories to localStorage whenever categories change
  useEffect(() => {
    localStorage.setItem('adminCategories', JSON.stringify(categories));
  }, [categories]);

  // Category management functions
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
      setCategories(categories.map(cat =>
        cat.id === category.id ? { ...cat, name: newName } : cat
      ));
      toast.success('Category updated successfully');
    }
  };

  const handleDeleteCategory = (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    // Check if any services use this category
    const servicesUsingCategory = services.filter(service => service.category === categoryId);
    if (servicesUsingCategory.length > 0) {
      toast.error(`Cannot delete category. ${servicesUsingCategory.length} service(s) are using it.`);
      return;
    }

    setCategories(categories.filter(cat => cat.id !== categoryId));
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
    setFormData({ ...item }); // Create a copy to avoid reference issues
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
      // Clean and validate data before submission
      let submitData = { ...formData };

      if (modalType === 'services') {
        // Ensure all required fields are present and properly formatted
        submitData = {
          title: (formData.title || '').trim(),
          description: (formData.description || '').trim(),
          icon: (formData.icon || 'code').trim(),
          category: formData.category || 'SOFTWARE_DEV'
        };

        // Client-side validation to match backend requirements
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
        // Clean project data
        submitData = {
          title: (formData.title || '').trim(),
          description: (formData.description || '').trim(),
          technologiesUsed: (formData.technologiesUsed || '').trim(),
          imageUrl: (formData.imageUrl || '').trim() || undefined,
          link: (formData.link || '').trim() || undefined
        };

        // Remove empty optional fields
        if (!submitData.imageUrl) delete submitData.imageUrl;
        if (!submitData.link) delete submitData.link;

        // Client-side validation
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

      console.log('Submitting data:', submitData); // Debug log

      if (editingItem) {
        const response = await axios.put(`/api/admin/${modalType}/${editingItem.id}`, submitData);
        console.log('Update response:', response.data); // Debug log
        toast.success('Item updated successfully');
      } else {
        const response = await axios.post(`/api/admin/${modalType}`, submitData);
        console.log('Create response:', response.data); // Debug log
        toast.success('Item created successfully');
      }

      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Submit error:', error.response?.data || error.message); // Debug log

      // Show specific validation errors if available
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-secondary mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your website content and view analytics</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 font-medium transition-colors ${activeTab === tab.id
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
                  }`}
              >
                <tab.icon className="mr-2" size={20} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-600 font-medium">Total Services</p>
                      <p className="text-3xl font-bold text-blue-800">{services.length}</p>
                    </div>
                    <Briefcase className="text-blue-600" size={32} />
                  </div>
                </div>

                <div className="bg-green-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-600 font-medium">Total Projects</p>
                      <p className="text-3xl font-bold text-green-800">{projects.length}</p>
                    </div>
                    <Users className="text-green-600" size={32} />
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-600 font-medium">New Messages</p>
                      <p className="text-3xl font-bold text-purple-800">{messages.length}</p>
                    </div>
                    <MessageSquare className="text-purple-600" size={32} />
                  </div>
                </div>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-secondary">Manage Services</h2>
                  <button
                    onClick={() => handleCreate('services')}
                    className="btn-primary flex items-center"
                  >
                    <Plus className="mr-2" size={20} />
                    Add Service
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-secondary">{service.title}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit('services', service)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete('services', service.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{getPreviewText(service.description, 100)}</p>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {categories.find(cat => cat.id === service.category)?.name || service.category}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects Tab */}
            {activeTab === 'projects' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-secondary">Manage Projects</h2>
                  <button
                    onClick={() => handleCreate('projects')}
                    className="btn-primary flex items-center"
                  >
                    <Plus className="mr-2" size={20} />
                    Add Project
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-semibold text-secondary">{project.title}</h3>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit('projects', project)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete('projects', project.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.technologiesUsed.split(', ').slice(0, 3).map((tech, index) => (
                          <span key={index} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-secondary">Manage Categories</h2>
                  <button
                    onClick={handleAddCategory}
                    className="btn-primary flex items-center"
                  >
                    <Plus className="mr-2" size={20} />
                    Add Category
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.map((category) => (
                    <div key={category.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-secondary">{category.name}</h3>
                          <p className="text-sm text-gray-600">ID: {category.id}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        Used by {services.filter(s => s.category === category.id).length} service(s)
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-secondary">Contact Messages</h2>
                </div>

                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-secondary">{message.name}</h3>
                          <p className="text-sm text-gray-600">{message.email}</p>
                          {message.phone && (
                            <p className="text-sm text-gray-600">{message.phone}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete('messages', message.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-700">{message.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
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