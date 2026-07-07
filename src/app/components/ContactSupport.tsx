import { Mail, Phone, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';
import Header from './Header';

type Screen = 'overview' | 'security' | 'preferences' | 'support' | 'reset-password' | '2fa' | 'help-center' | 'contact-support';

interface ContactSupportProps {
  onNavigate: (screen: Screen) => void;
}

export default function ContactSupport({ onNavigate }: ContactSupportProps) {
  const [formData, setFormData] = useState({
    subject: '',
    category: 'general',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Form submission logic here
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ subject: '', category: 'general', message: '' });
    }, 3000);
  };

  const contactMethods = [
    {
      id: 'email',
      icon: Mail,
      title: 'Email Support',
      value: 'support@overwizeconnect.com',
      description: 'We typically respond within 24 hours',
      color: 'bg-[#eef4ff]',
      iconColor: 'text-[#0066cc]',
    },
    {
      id: 'phone',
      icon: Phone,
      title: 'Phone Support',
      value: '+1 (800) 555-0123',
      description: 'Available Mon-Fri, 9AM-6PM EST',
      color: 'bg-[#f0fdf4]',
      iconColor: 'text-[#10b981]',
    },
    {
      id: 'live-chat',
      icon: MessageSquare,
      title: 'Live Chat',
      value: 'Start a conversation',
      description: 'Average response time: 5 minutes',
      color: 'bg-[#fef3c7]',
      iconColor: 'text-[#f59e0b]',
    },
  ];

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'technical', label: 'Technical Issue' },
    { value: 'account', label: 'Account & Billing' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-[#f6f6f6]">
      <div className="flex-none">
        <Header title="Contact Support" onBack={() => onNavigate('support')} showBackButton />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-4 w-full pb-8 rounded-tl-[20px] rounded-tr-[20px] bg-[#f6f6f6] -mt-[20px] relative z-20">
          {/* Contact Methods */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[16px] font-semibold text-black">How would you like to reach us?</h3>
            <div className="flex flex-col gap-3">
              {contactMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.id}
                    className="bg-white rounded-[8px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_6px_24px_0px_rgba(0,0,0,0.05)] p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-full ${method.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-6 h-6 ${method.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <p className="text-[16px] font-semibold text-black mb-1">{method.title}</p>
                        <p className="text-[14px] text-[#0066cc] font-medium mb-1">{method.value}</p>
                        <p className="text-[13px] text-[#6b7280]">{method.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[16px] font-semibold text-black">Send us a message</h3>
            
            {submitted ? (
              <div className="bg-[#f0fdf4] border border-[#86efac] rounded-[8px] p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-[#10b981] flex items-center justify-center mx-auto mb-3">
                  <Send className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-[16px] font-semibold text-[#166534] mb-2">Message Sent!</h4>
                <p className="text-[14px] text-[#166534]">
                  Thank you for contacting us. We'll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-[8px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_6px_24px_0px_rgba(0,0,0,0.05)] p-5">
                {/* Category Selection */}
                <div className="mb-4">
                  <label className="block text-[14px] font-semibold text-black mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-[6px] border border-[#d1d5db] bg-white text-[15px] text-black focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div className="mb-4">
                  <label className="block text-[14px] font-semibold text-black mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Brief description of your issue"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-[6px] border border-[#d1d5db] bg-white text-[15px] text-black placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
                  />
                </div>

                {/* Message */}
                <div className="mb-5">
                  <label className="block text-[14px] font-semibold text-black mb-2">
                    Message
                  </label>
                  <textarea
                    placeholder="Please provide as much detail as possible..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-[6px] border border-[#d1d5db] bg-white text-[15px] text-black placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-[#0066cc] text-white py-3 rounded-[6px] font-semibold hover:bg-[#0052a3] transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Additional Info */}
          <div className="bg-[#eef4ff] border border-[#c7d7fe] rounded-[8px] p-4">
            <h3 className="text-[14px] font-semibold text-[#0066cc] mb-2">Response Time</h3>
            <p className="text-[13px] text-[#0b1215]">
              Our support team typically responds within 24 hours during business days. For urgent matters, please call our phone support line.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}