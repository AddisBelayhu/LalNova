import React, { useState, useEffect } from 'react';
import { ExternalLink, Calendar } from 'lucide-react';
import axios from 'axios';
import { getApiUrl } from '../config/api';
import { mockProjects } from '../utils/mockData';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const url = getApiUrl('/api/projects');
      const res = await axios.get(url);
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
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
            LalNova's Portfolio
          </h1>
          <p className="text-base md:text-lg text-blue-100">
            Explore our latest projects and see how we've helped businesses 
            transform their operations with innovative technology solutions.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-secondary mb-4">
              Featured Projects
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Each project represents our commitment to delivering exceptional 
              results and innovative solutions.
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No projects available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <div key={project.id} className="card hover:scale-105 group">
                  {project.imageUrl && (
                    <div className="relative overflow-hidden rounded-lg mb-6">
                      <img 
                        src={project.imageUrl} 
                        alt={project.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-primary bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <Calendar size={16} className="mr-2" />
                    {formatDate(project.createdAt)}
                  </div>
                  
                  <h3 className="text-xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologiesUsed.split(', ').map((tech, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-primary text-sm rounded-full font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  
                  {project.link && (
                    <a 
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary hover:text-blue-700 font-medium group-hover:translate-x-1 transition-transform"
                    >
                      View Project <ExternalLink className="ml-2" size={16} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Technologies Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-secondary mb-4">
              Technologies We Use
            </h2>
            <p className="text-gray-600 text-lg">
              We leverage cutting-edge technologies to build robust and scalable solutions
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              'React', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'AWS',
              'Docker', 'Kubernetes', 'Vue.js', 'Angular', 'Express', 'Django'
            ].map((tech, index) => (
              <div key={index} className="text-center">
                <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="text-primary font-semibold">{tech}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section-padding bg-primary text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Project Success Metrics</h2>
            <p className="text-blue-100">Our track record speaks for itself</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '98%', label: 'Client Satisfaction' },
              { number: '100%', label: 'On-Time Delivery' },
              { number: '3+', label: 'Projects Completed' },
              { number: '24/7', label: 'Support Available' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-accent mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-6">
            Have a Project in Mind?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Let's collaborate to bring your vision to life with our expertise and innovation.
          </p>
          <a 
            href="/contact" 
            className="btn-primary"
          >
            Start Your Project Today
          </a>
        </div>
      </section>
    </div>
  );
};

export default Projects;