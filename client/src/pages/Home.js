import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Cloud, Settings, Users } from 'lucide-react';
import axios from 'axios';

const Home = () => {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchServices();
    fetchProjects();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      setServices(response.data.slice(0, 4)); // Show first 4 services
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data.slice(0, 3)); // Show first 3 projects
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const getServiceIcon = (iconName) => {
    const icons = {
      code: <Code size={48} />,
      cloud: <Cloud size={48} />,
      integration: <Settings size={48} />,
      consulting: <Users size={48} />
    };
    return icons[iconName] || <Code size={48} />;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white section-padding">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Building Modern Solutions for a{' '}
            <span className="text-accent">Smarter Future</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            We specialize in software development, IT consulting, system integration, 
            cloud solutions, and digital transformation advisory.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/services" className="btn-primary bg-accent hover:bg-sky-500">
              Our Services
              <ArrowRight className="ml-2 inline" size={20} />
            </Link>
            <Link to="/contact" className="btn-secondary border-white text-white hover:bg-white hover:text-primary">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Our Core Services
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive technology solutions tailored to your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div key={service.id} className="card text-center hover:scale-105">
                <div className="text-primary mb-4 flex justify-center">
                  {getServiceIcon(service.icon)}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-secondary">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {service.description.substring(0, 100)}...
                </p>
                <Link 
                  to="/services" 
                  className="text-primary hover:text-blue-700 font-medium inline-flex items-center"
                >
                  Learn More <ArrowRight className="ml-1" size={16} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Showcasing our latest work and innovative solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="card hover:scale-105">
                {project.imageUrl && (
                  <img 
                    src={project.imageUrl} 
                    alt={project.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold mb-3 text-secondary">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {project.description.substring(0, 120)}...
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologiesUsed.slice(0, 3).map((tech, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-primary text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <Link 
                  to="/projects" 
                  className="text-primary hover:text-blue-700 font-medium inline-flex items-center"
                >
                  View Details <ArrowRight className="ml-1" size={16} />
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/projects" className="btn-primary">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Let's discuss how we can help you achieve your technology goals
          </p>
          <Link to="/contact" className="btn-primary bg-accent hover:bg-sky-500">
            Start Your Project
            <ArrowRight className="ml-2 inline" size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;