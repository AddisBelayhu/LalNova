import React, { useState } from 'react';
import { Target, Eye, Users, Award, Zap, Lightbulb, Shield, TrendingUp } from 'lucide-react';

const TeamMemberImage = ({ src, fallbackSrc, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

const CompanyImage = ({ src, fallbackSrc, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

const About = () => {
  const team = [
    {
      name: 'Kindie Asmamaw',
      role: 'CEO & Founder',
      image: '/images/team/kindie-asmamaw.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bio: 'Business Strategy & Technology Leadership.'
    },
    {
      name: 'Gebre Alamne',
      role: 'CTO',
      image: '/images/team/gebre-alamne.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face',
      bio: 'Product Architecture, Engineering Leadership & Technical Innovation.'
    },
    
    {
      name: 'Simamlak Admasu',
      role: 'CMO',
      image: '/images/team/simamlak-admasu.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      bio: 'Marketing Strategy, Brand Growth & Customer Acquisition.'
    },
    {
      name: 'Addis Belayhun',
      role: 'COO',
      image: '/images/team/addis-belayhun.jpg',
      fallbackImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: 'Operations, Scalability & Project Execution.'
    }
  ];

  const stats = [
    { number: '1', label: 'Projects Completed' },
    { number: '1', label: 'Happy Clients' },
    { number: '1', label: 'Years Experience' },
    { number: '8+', label: 'Team Members' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            LalNova Technologies
          </h1>
          <p className="text-base md:text-lg text-blue-100">
            We are a catalyst for digital evolution. We engineer high-impact digital solutions 
            that empower businesses to navigate complexity, accelerate growth, and lead with
            confidence in a digital-first economy. 
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Philosophy Hook */}
          <div className="text-center mb-16">
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary leading-tight">
              We engineer software that powers your future.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-6">Our Story</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Founded by a team of visionary professionals with deep expertise in IT,business strategy, and 
                project management, Lalnova Technologies is an emerging company in the digital landscape. 
                We were established with a singular mission: to bridge the gap between technical complexity 
                and business efficiency. In a rapidly evolving digital landscape, we recognized that businesses
                don't just need tools, they need integrated ecosystems.  By combining our energy 
                with state-of-the-art engineering, we empower businesses and organizations to achieve operational
                excellence through a unified ecosystem of bespoke software, strategic IT consulting, intelligent
                data solutions, and secure networking solutions.  
              </p>
             
            </div>
            <div>
              <CompanyImage
                src="/images/company/team-collaboration.jpg"
                fallbackSrc="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                alt="Team collaboration"
                className="rounded-xl shadow-lg max-h-80 w-full object-cover"
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
               
                To engineer high-performance, end-to-end digital solutions that accelerate efficiency and drive
                sustainable growth through cutting-edge technology tailored to the unique goals of our clients.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-primary mb-4 flex justify-center">
                <Eye size={48} />
              </div>
              <h3 className="text-2xl font-bold text-secondary mb-4">Our Vision</h3>
              <p className="text-gray-600">
               
                Be the premier catalyst for digital excellence, and empowering businesses through innovative
                digital solutions and strategic technology leadership. 
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
            <h2 className="text-2xl font-bold text-secondary mb-4">The Minds Behind Lalnova </h2>
            <p className="text-gray-600 text-lg">
              Bridging the gap between technology and business efficiency everyday 
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <TeamMemberImage
                  src={member.image}
                  fallbackSrc={member.fallbackImage}
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
            <h2 className="text-2xl font-bold text-secondary mb-4">Our Values</h2>
            <p className="text-gray-600 text-lg">
              Value-driven: We always provide technology solutions that create real value for clients,    partners, and the society.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-primary mb-4 flex justify-center">
                <TrendingUp size={48} />
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-3">Value-driven</h3>
              <p className="text-gray-600">
                We always provide technology solutions that create real value for clients, partners, and the society.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-primary mb-4 flex justify-center">
                <Zap size={48} />
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-3">Agility</h3>
              <p className="text-gray-600">
                We embrace flexibility and adaptability to respond quickly to changing technology and client needs.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-primary mb-4 flex justify-center">
                <Lightbulb size={48} />
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-3">Innovation</h3>
              <p className="text-gray-600">
                We constantly pursue creative solutions and cutting-edge technologies to meet client needs and their expectations.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-primary mb-4 flex justify-center">
                <Shield size={48} />
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-3">Integrity</h3>
              <p className="text-gray-600">
                We always act with honesty, transparency, and ethical responsibility in all dealings.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-primary mb-4 flex justify-center">
                <Award size={48} />
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-3">Excellence</h3>
              <p className="text-gray-600">
                We strive for the highest quality standards, performance and delivery.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-primary mb-4 flex justify-center">
                <Users size={48} />
              </div>
              <h3 className="text-xl font-semibold text-secondary mb-3">Collaboration</h3>
              <p className="text-gray-600">
                We foster teamwork, and build strong partnerships with clients and stakeholders to achieve shared success.
              </p>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
