import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import DistortedCaptcha from '../components/DistortedCaptcha';
import { getApiUrl } from '../config/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  
  // CAPTCHA state
  const [captchaText, setCaptchaText] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  
  // FAQ expanded state - track which FAQs are expanded
  const [expandedFaqs, setExpandedFaqs] = useState({});

  // Fetch services and generate CAPTCHA on component mount
  useEffect(() => {
    fetchServices();
    generateCaptcha();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(getApiUrl('/api/services'));
      const data = Array.isArray(res.data) ? res.data : [];
      setServices(data);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      // Set empty array if fetch fails
      setServices([]);
    }
  };

  const generateCaptcha = () => {
    // Generate random 6-character alphanumeric string
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar looking characters
    let text = '';
    for (let i = 0; i < 6; i++) {
      text += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(text);
    setCaptchaInput('');
    setCaptchaError(false);
  };

  const toggleFaq = (index) => {
    setExpandedFaqs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verify CAPTCHA (case-insensitive)
    if (captchaInput.toUpperCase() !== captchaText) {
      setCaptchaError(true);
      toast.error('CAPTCHA verification failed. Please try again.');
      return;
    }
    
    setLoading(true);

    try {
      await axios.post('/api/contact', formData);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', company: '', email: '', phone: '', subject: '', message: '' });
      generateCaptcha(); // Generate new CAPTCHA after successful submission
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to send message. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Digitize Your Future
          </h1>
          <p className="text-base md:text-lg text-blue-100">
            Have a challenge or a vision? Share the details of your project, and let's work together to build a scalable plan for your business.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-8">
                Fill out the form below and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Your company name (optional)"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="+251 (094) 256-0505"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                  >
                    <option value="">Select a service...</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.title}>
                        {service.title}
                      </option>
                    ))}
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    How can we help? *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    placeholder="Tell us about your project requirements..."
                  />
                </div>

                {/* CAPTCHA Verification */}
                <div className={`p-4 rounded-xl border-2 ${captchaError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    ðŸ¤– Verify you're human - Enter the text below *
                  </label>
                  
                  <DistortedCaptcha 
                    captchaText={captchaText}
                    onRefresh={generateCaptcha}
                  />
                  
                  <input
                    type="text"
                    value={captchaInput}
                    onChange={(e) => {
                      setCaptchaInput(e.target.value);
                      setCaptchaError(false);
                    }}
                    required
                    maxLength={6}
                    className={`mt-3 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent uppercase ${
                      captchaError ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter the text above"
                  />
                  
                  {captchaError && (
                    <p className="text-red-600 text-sm mt-2">âŒ Incorrect CAPTCHA. Please try again.</p>
                  )}
                  <p className="text-gray-500 text-xs mt-2">ðŸ’¡ Not case-sensitive</p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2" size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-secondary mb-6">
                Contact Information
              </h2>
              <p className="text-gray-600 mb-8">
                Connect with us through any of the following channels.
                Weâ€™re here to answer your questions and power your next digital milestone.
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-xl">
                    <Mail className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Email</h3>
                    <p className="text-gray-600">info@lalnova.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-xl">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Phone</h3>
                    <p className="text-gray-600">+251 947 101 989</p>
                    <p className="text-gray-600">+251 942 560 505</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-xl">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Address</h3>
                    <p className="text-gray-600">
                      Kirkos Subcity, Woreda 10, ORDA Ethiopa Bldg, Addis Ababa, Ethiopia
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-secondary mb-4">Business Hours</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Mon - Fri</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>8:00 AM - 5:00 PM (EAT)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Sat</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      <span>8:00 AM - 12:00 PM (EAT)</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Sun</span>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-4">
              Visit Our Office
            </h2>
            <p className="text-gray-600">
              Find us at our location in Addis Ababa
            </p>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-lg" style={{ pointerEvents: 'auto' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.3087234567!2d38.751311!3d9.0116016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85dcf6b10fb3%3A0x1aed1d5cca6b8652!2sOrganization%20for%20Rehabilitation%20and%20Development%20in%20Amhara%20(ORDA)%20HQ!5e0!3m2!1sen!2set!4v1234567890123!5m2!1sen!2set"
              width="100%"
              height="450"
              style={{ border: 0, pointerEvents: 'auto' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="LalNova Technologies Office Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-secondary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600">
              Quick answers to common questions about our services
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "What types of projects do you work on?",
                answer: "We specialize in high-impact digital transformations, including custom web and mobile systems, enterprise-grade software, and seamless cloud migrations. From optimizing internal workflows to building consumer-facing platforms, we engineer solutions tailored to your specific industry needs."
              },
              {
                question: "How long does a typical project take?",
                answer: "Timelines are driven by your goals. While a focused digital presence can be launched in a matter of weeks, comprehensive enterprise transformations typically span 3 to 6 months. We prioritize a Strategy-First approach, providing you with a clear roadmap and milestone-based delivery from day one"
              },
              {
                question: "Do you provide ongoing support and maintenance?",
                answer: "Absolutely. We view our clients as long-term partners. Our post-launch ecosystem includes continuous optimization, security monitoring, and feature evolution to ensure your digital assets remain competitive and secure as your business scales. "
              },
              {
                question: "What is your development process?",
                answer: "We use a transparent, Agile-driven framework designed for speed and precision. You’ll have full visibility into our iterative process, with regular demos and feedback loops. This ensures the final product isn't just functional, but perfectly aligned with your business vision."
              }
            ].map((faq, index) => {
              const isExpanded = expandedFaqs[index];
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="font-semibold text-secondary mb-3">{faq.question}</h3>
                  <p className={`text-gray-600 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                    {faq.answer}
                  </p>
                  <button
                    onClick={() => toggleFaq(index)}
                    className="mt-3 text-primary hover:text-primary-dark font-medium text-sm transition-colors"
                  >
                    {isExpanded ? 'Read less' : 'Read more'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Still Have Questions CTA */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-3">
                Still have questions?
              </h3>
              <p className="text-blue-100 mb-6">
                We're here to help! Reach out to us and we'll get back to you as soon as possible.
              </p>
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  // Focus on the name input after scrolling
                  setTimeout(() => {
                    document.getElementById('name')?.focus();
                  }, 800);
                }}
                className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
