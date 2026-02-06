import React, { useState, useEffect } from 'react';
import { Code, Cloud, Settings, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getCategoryName, getCategoryColor } from '../utils/categories';
import { sanitizeHtml } from '../utils/htmlUtils';
import '../styles/richtext.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (iconName) => {
    const icons = {
      code: <Code size={64} />,
      cloud: <Cloud size={64} />,
      integration: <Settings size={64} />,
      consulting: <Users size={64} />
    };
    return icons[iconName] || <Code size={64} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Our Services
          </h1>
          <p className="text-base md:text-lg text-blue-100">
            Comprehensive technology solutions designed to accelerate your business growth 
            and digital transformation journey.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-secondary mb-4">
              What We Offer
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From custom software development to cloud migration, we provide 
              end-to-end technology solutions tailored to your specific needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => (
              <div key={service.id} className="card hover:scale-105 group">
                <div className="flex items-start space-x-6">
                  <div className="text-primary group-hover:text-blue-700 transition-colors flex-shrink-0">
                    {getServiceIcon(service.icon)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-secondary group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(service.category)}`}>
                        {getCategoryName(service.category)}
                      </span>
                    </div>
                    <div 
                      className="text-gray-600 mb-4 leading-relaxed rich-text-content"
                      dangerouslySetInnerHTML={{ __html: sanitizeHtml(service.description) }}
                    />
                    <Link 
                      to="/contact" 
                      className="text-primary hover:text-blue-700 font-medium inline-flex items-center group-hover:translate-x-1 transition-transform"
                    >
                      Get Started <ArrowRight className="ml-2" size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-secondary mb-4">
              Our Process
            </h2>
            <p className="text-gray-600 text-lg">
              A proven methodology that ensures successful project delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Discovery',
                description: 'We analyze your requirements and understand your business goals.'
              },
              {
                step: '02',
                title: 'Planning',
                description: 'We create a detailed project plan with timelines and milestones.'
              },
              {
                step: '03',
                title: 'Development',
                description: 'Our team builds your solution using best practices and modern technologies.'
              },
              {
                step: '04',
                title: 'Delivery',
                description: 'We deploy, test, and provide ongoing support for your solution.'
              }
            ].map((process, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {process.step}
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-3">
                  {process.title}
                </h3>
                <p className="text-gray-600">
                  {process.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Let's discuss your project requirements and how we can help you achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="btn-primary bg-accent hover:bg-sky-500">
              Start Your Project
              <ArrowRight className="ml-2 inline" size={20} />
            </Link>
            <Link to="/projects" className="btn-secondary border-white text-white hover:bg-white hover:text-primary">
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;