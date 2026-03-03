import React, { useState, useEffect } from 'react';
import { Code, Cloud, Settings, Users, ArrowRight, Database, BarChart3, Sparkles, Shield, Network, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getCategoryName, getCategoryColor } from '../utils/categories';
import { sanitizeHtml } from '../utils/htmlUtils';
import { getApiUrl } from '../config/api';
import { mockServices } from '../utils/mockData';
import '../styles/richtext.css';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const url = getApiUrl('/api/services');
      const res = await axios.get(url);
      setServices(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setServices(mockServices);
    } finally {
      setLoading(false);
    }
  };

  const getServiceIcon = (iconName) => {
    const icons = {
      code: <Code size={64} />,
      cloud: <Cloud size={64} />,
      integration: <Settings size={64} />,
      consulting: <Users size={64} />,
      analytics: <Database size={64} />,
      business: <BarChart3 size={64} />,
      ai: <Sparkles size={64} />,
      security: <Shield size={64} />,
      data: <Database size={64} />,
      network: <Network size={64} />,
      training: <GraduationCap size={64} />,
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
            Our Solutions
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
              Solutions for a Digital Era.  From bespoke software engineering to seamless cloud transitions, 
              we deliver end-to-end technology ecosystems designed to solve today’s challenges and power
              tomorrow’s growth.
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
              How We Power Your Digital Journey
            </h2>
            <p className="text-gray-600 text-lg">
              A proven methodology designed to accelerate delivery and ensure your digital success. 
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Strategy & Discovery ',
                description: 'We deep-dive into your operational challenges to align our technical roadmap with your long-term business objectives.'
              },
              {
                step: '02',
                title: 'Architecture & Planning ',
                description: 'We design a robust blueprint and project timeline, ensuring every milestone is optimized for scalability and performance.'
              },
              {
                step: '03',
                title: 'Agile Development',
                description: 'Our engineers bring the vision to life using modern tech stacks and iterative sprints, maintaining transparency at every stage.'
              },
              {
                step: '04',
                title: 'Deployment & Evolution ',
                description: 'We launch with rigorous testing and provide the continuous support needed to ensure your solution evolves with your business.  '
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