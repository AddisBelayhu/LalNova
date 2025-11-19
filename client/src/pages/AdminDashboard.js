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

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({});

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
    setFormData(item);
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
      if (editingItem) {
        await axios.put(`/api/admin/${modalType}/${editingItem.id}`, formData);
        toast.success('Item updated successfully');
      } else {
        await axios.post(`/api/admin/${modalType}`, formData);
        toast.success('Item created successfully');
      }
      
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error('Failed to save item');
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
          technologiesUsed: [],
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
    { id: 'messages', label: 'Messages', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your website content and view analytics</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-8">
          <div className="flex border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
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
                      <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {service.category}
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
                        {project.technologiesUsed.slice(0, 3).map((tech, index) => (
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
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                  <textarea
                    placeholder="Service Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={3}
                    required
                  />
                  <select
                    value={formData.category || 'SOFTWARE_DEV'}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="SOFTWARE_DEV">Software Development</option>
                    <option value="CONSULTANCY">IT Consulting</option>
                    <option value="CLOUD">Cloud Solutions</option>
                    <option value="INTEGRATION">System Integration</option>
                  </select>
                </>
              )}
              
              {modalType === 'projects' && (
                <>
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                  <textarea
                    placeholder="Project Description"
                    value={formData.description || ''}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows={3}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Technologies (comma-separated)"
                    value={Array.isArray(formData.technologiesUsed) ? formData.technologiesUsed.join(', ') : ''}
                    onChange={(e) => setFormData({...formData, technologiesUsed: e.target.value.split(', ')})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={formData.imageUrl || ''}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="url"
                    placeholder="Project Link"
                    value={formData.link || ''}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
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