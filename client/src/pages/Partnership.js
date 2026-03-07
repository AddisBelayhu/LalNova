import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Target, TrendingUp, Users, CheckCircle, Briefcase, Send } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Partnership = () => {
  const [formData, setFormData] = useState({
    partnershipName: '',
    partnerType: '',
    streetAddress: '',
    city: '',
    stateRegion: '',
    zipCode: '',
    country: '',
    contactName: '',
    contactEmail: '',
    phoneNumber: '',
    message: '',
    keepUpdated: false
  });
  const [loading, setLoading] = useState(false);

  // Country codes mapping
  const countryPhoneCodes = {
    'Afghanistan': '+93',
    'Albania': '+355',
    'Algeria': '+213',
    'Argentina': '+54',
    'Australia': '+61',
    'Austria': '+43',
    'Bangladesh': '+880',
    'Belgium': '+32',
    'Brazil': '+55',
    'Canada': '+1',
    'China': '+86',
    'Colombia': '+57',
    'Denmark': '+45',
    'Egypt': '+20',
    'Ethiopia': '+251',
    'Finland': '+358',
    'France': '+33',
    'Germany': '+49',
    'Ghana': '+233',
    'Greece': '+30',
    'India': '+91',
    'Indonesia': '+62',
    'Iran': '+98',
    'Iraq': '+964',
    'Ireland': '+353',
    'Israel': '+972',
    'Italy': '+39',
    'Japan': '+81',
    'Jordan': '+962',
    'Kenya': '+254',
    'Kuwait': '+965',
    'Lebanon': '+961',
    'Malaysia': '+60',
    'Mexico': '+52',
    'Morocco': '+212',
    'Netherlands': '+31',
    'New Zealand': '+64',
    'Nigeria': '+234',
    'Norway': '+47',
    'Pakistan': '+92',
    'Philippines': '+63',
    'Poland': '+48',
    'Portugal': '+351',
    'Qatar': '+974',
    'Romania': '+40',
    'Russia': '+7',
    'Saudi Arabia': '+966',
    'Singapore': '+65',
    'South Africa': '+27',
    'South Korea': '+82',
    'Spain': '+34',
    'Sweden': '+46',
    'Switzerland': '+41',
    'Tanzania': '+255',
    'Thailand': '+66',
    'Turkey': '+90',
    'Uganda': '+256',
    'Ukraine': '+380',
    'United Arab Emirates': '+971',
    'United Kingdom': '+44',
    'United States': '+1',
    'Vietnam': '+84',
    'Other': '+'
  };

  const getPhonePlaceholder = () => {
    const code = countryPhoneCodes[formData.country] || '+';
    return `${code} (XXX) XXX-XXXX`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/api/partnership', formData);
      
      toast.success('Partnership inquiry submitted successfully! We\'ll get back to you soon.');
      setFormData({
        partnershipName: '',
        partnerType: '',
        streetAddress: '',
        city: '',
        stateRegion: '',
        zipCode: '',
        country: '',
        contactName: '',
        contactEmail: '',
        phoneNumber: '',
        message: '',
        keepUpdated: false
      });
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to submit partnership inquiry. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const partnershipTypes = [
    {
      icon: <Briefcase size={48} />,
      title: 'Technology Partners',
      description: 'Collaborate with us to integrate cutting-edge technologies and deliver innovative solutions to clients.',
      benefits: ['Joint solution development', 'Technical collaboration', 'Shared expertise']
    },
    {
      icon: <Target size={48} />,
      title: 'Reseller Partners',
      description: 'Expand your portfolio by reselling our software solutions and services to your customer base.',
      benefits: ['Competitive margins', 'Sales support', 'Marketing materials']
    },
    {
      icon: <TrendingUp size={48} />,
      title: 'Strategic Partners',
      description: 'Build long-term strategic alliances to drive mutual growth and market expansion.',
      benefits: ['Co-marketing opportunities', 'Business development', 'Market access']
    },
    {
      icon: <Users size={48} />,
      title: 'Referral Partners',
      description: 'Refer clients to us and earn rewards while helping businesses transform digitally.',
      benefits: ['Referral commissions', 'Easy process', 'No technical requirements']
    }
  ];

  const benefits = [
    'Access to cutting-edge technology and expertise',
    'Dedicated partner support team',
    'Co-marketing and lead generation opportunities',
    'Training and certification programs',
    'Competitive pricing and margins',
    'Joint business planning and strategy',
    'Priority access to new products and services',
    'Partner portal and resources'
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-800 text-white section-padding">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Partner With Us
          </h1>
          <p className="text-base md:text-lg text-blue-100">
            Join forces with LalNova Technologies to create innovative solutions, expand your market reach, and drive mutual growth through strategic partnerships.
          </p>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
              Partnership Opportunities
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Choose the partnership model that aligns with your business goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partnershipTypes.map((type, index) => (
              <div key={index} className="card hover:scale-105">
                <div className="text-primary mb-4">
                  {type.icon}
                </div>
                <h3 className="text-xl font-bold text-secondary mb-3">
                  {type.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {type.description}
                </p>
                <div className="space-y-2">
                  {type.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start">
                      <CheckCircle className="text-primary mr-2 flex-shrink-0" size={20} />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
              Why Partner With LalNova?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Unlock exclusive benefits and grow your business with our partnership program
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start bg-white p-6 rounded-xl shadow-sm">
                <CheckCircle className="text-primary mr-3 flex-shrink-0 mt-1" size={24} />
                <span className="text-gray-700 text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Contact Form */}
      <section className="section-padding bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
              Partnership Contact
            </h2>
            <p className="text-gray-600 text-lg">
              Let's build something together — Fill out the partner details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Partnership Name and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="partnershipName" className="block text-sm font-medium text-gray-700 mb-2">
                  Partnership Name *
                </label>
                <input
                  type="text"
                  id="partnershipName"
                  name="partnershipName"
                  value={formData.partnershipName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="e.g. ABC Global Alliance"
                />
              </div>

              <div>
                <label htmlFor="partnerType" className="block text-sm font-medium text-gray-700 mb-2">
                  Partner Type *
                </label>
                <select
                  id="partnerType"
                  name="partnerType"
                  value={formData.partnerType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                >
                  <option value="">– select –</option>
                  <option value="Technology Partner">Technology Partner</option>
                  <option value="Reseller Partner">Reseller Partner</option>
                  <option value="Strategic Partner">Strategic Partner</option>
                  <option value="Referral Partner">Referral Partner</option>
                </select>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-semibold text-secondary flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Address Information
              </h3>

              <div>
                <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="streetAddress"
                  name="streetAddress"
                  value={formData.streetAddress}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="e.g. 121 Main Street, Suite 400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="e.g. San Francisco"
                  />
                </div>

                <div>
                  <label htmlFor="stateRegion" className="block text-sm font-medium text-gray-700 mb-2">
                    State / Region
                  </label>
                  <input
                    type="text"
                    id="stateRegion"
                    name="stateRegion"
                    value={formData.stateRegion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="e.g. CA"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP / Postal Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="e.g. 94105"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                  >
                    <option value="">– select country –</option>
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Albania">Albania</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Canada">Canada</option>
                    <option value="China">China</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Egypt">Egypt</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Greece">Greece</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Iran">Iran</option>
                    <option value="Iraq">Iraq</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Japan">Japan</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="Norway">Norway</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Romania">Romania</option>
                    <option value="Russia">Russia</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Singapore">Singapore</option>
                    <option value="South Africa">South Africa</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Spain">Spain</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Contact Name *
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="e.g. Jane Smith"
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="partner@company.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder={getPhonePlaceholder()}
              />
            </div>

            {/* Additional Notes */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes or Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                placeholder="Tell us about the partnership opportunity, specific goals, etc."
              />
            </div>

            {/* Keep Updated Checkbox */}
            <div className="bg-blue-50 rounded-xl p-4">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  name="keepUpdated"
                  checked={formData.keepUpdated}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-3 text-gray-700">
                  Keep me updated on partnership programs and opportunities
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Partnership Inquiry
                  <Send className="ml-2" size={20} />
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Partnership Process */}
      <section className="section-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-4">
              How to Become a Partner
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Simple steps to start your partnership journey with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Contact Us', description: 'Reach out through our partnership form' },
              { step: '02', title: 'Discussion', description: 'We discuss your goals and partnership model' },
              { step: '03', title: 'Agreement', description: 'Sign partnership agreement and onboarding' },
              { step: '04', title: 'Launch', description: 'Start collaborating and growing together' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-secondary mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Partnership;
