import React from 'react';
import { Target, Eye, Users, Award } from 'lucide-react';

const About = () => {
  const team = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bio: '15+ years in technology leadership and business strategy.'
    },
    {
      name: 'Sarah Johnson',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      bio: 'Expert in cloud architecture and software development.'
    },
    {
      name: 'Michael Chen',
      role: 'Lead Developer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: 'Full-stack developer with expertise in modern frameworks.'
    },
    {
      name: 'Emily Davis',
      role: 'Project Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      bio: 'Agile methodology expert ensuring project success.'
    }
  ];

  const stats = [
    { number: '50+', label: 'Projects Completed' },
    { number: '25+', label: 'Happy Clients' },
    { number: '5+', label: 'Years Experience' },
    { number: '10+', label: 'Team Members' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About LalNova Technologies
          </h1>
          <p className="text-xl text-blue-100">
            We are a forward-thinking technology company dedicated to delivering 
            innovative solutions that drive business growth and digital transformation.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-secondary mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2025, LalNova Technologies emerged from a vision to bridge 
                the gap between cutting-edge technology and practical business solutions. 
                Our journey began with a small team of passionate developers and has 
                grown into a comprehensive technology partner for businesses worldwide.
              </p>
              <p className="text-gray-600 mb-4">
                We believe that technology should empower businesses, not complicate them. 
                This philosophy drives everything we do, from our initial consultation 
                to the final deployment of your solution.
              </p>
              <p className="text-gray-600">
                Today, we continue to innovate and adapt, staying ahead of technology 
                trends to provide our clients with solutions that not only meet their 
                current needs but also prepare them for future challenges.
              </p>
            </div>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop" 
                alt="Team collaboration"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card text-center">
              <div className="text-primary mb-4 flex justify-center">
                <Target size={48} />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To empower businesses with innovative technology solutions that drive 
                growth, efficiency, and competitive advantage in the digital age.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-primary mb-4 flex justify-center">
                <Eye size={48} />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To be the leading technology partner that transforms businesses 
                through intelligent solutions and exceptional service delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-primary text-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Achievements</h2>
            <p className="text-blue-100">Numbers that reflect our commitment to excellence</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
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

      {/* Team */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">Meet Our Team</h2>
            <p className="text-gray-600 text-lg">
              The talented individuals behind our success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  {member.name}
                </h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">Our Values</h2>
            <p className="text-gray-600 text-lg">
              The principles that guide our work and relationships
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-primary mb-4 flex justify-center">
                <Award size={48} />
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for excellence in every project, delivering solutions 
                that exceed expectations and drive real business value.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-primary mb-4 flex justify-center">
                <Users size={48} />
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-3">Collaboration</h3>
              <p className="text-gray-600">
                We believe in the power of collaboration, working closely with 
                our clients to understand their needs and deliver tailored solutions.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-primary mb-4 flex justify-center">
                <Target size={48} />
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-3">Innovation</h3>
              <p className="text-gray-600">
                We embrace innovation and stay at the forefront of technology 
                to provide cutting-edge solutions for our clients.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;