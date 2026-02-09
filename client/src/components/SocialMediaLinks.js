import React from 'react';
import { Send, Facebook, Linkedin, Phone } from 'lucide-react';

const SocialMediaLinks = () => {
  const socialLinks = [
    {
      name: 'Telegram',
      icon: Send,
      url: 'https://t.me/LalNova_Technologies',
      color: 'bg-primary hover:bg-teal-700'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://web.facebook.com/profile.php?id=61587409542576',
      color: 'bg-primary hover:bg-teal-700'
    },
    {
      name: 'WhatsApp',
      icon: Phone,
      url: 'https://wa.me/message/UFX7NXAYUGGHK1',
      color: 'bg-primary hover:bg-teal-700'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: 'https://linkedin.com/company/lalnova',
      color: 'bg-primary hover:bg-teal-700'
    }
  ];

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 flex flex-col space-y-3">
      {socialLinks.map((social, index) => {
        const Icon = social.icon;
        return (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${social.color} text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 group relative`}
            aria-label={social.name}
          >
            <Icon size={20} />
            
            {/* Tooltip */}
            <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              {social.name}
            </span>
          </a>
        );
      })}
    </div>
  );
};

export default SocialMediaLinks;
