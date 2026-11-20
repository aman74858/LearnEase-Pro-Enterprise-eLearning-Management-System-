import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success('Your message has been sent to student support!');
  };

  return (
    <div className="pt-28 pb-20 bg-[#F5F7FA] dark:bg-[#0F1319] min-h-screen transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-gray-900 dark:text-white mb-2">
            We'd Love to Hear From You
          </h1>
          <p className="text-sm text-gray-500">
            Have a question about courses, enterprise plans, or instructor partnerships?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-5 bg-white dark:bg-[#18202C] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-soft space-y-6">
            <div>
              <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white mb-4">
                Contact Information
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Reach out anytime. Our student support team typically responds within 2-4 hours.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#128F80]/10 text-[#128F80] flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <span>support@learneasepro.com</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#128F80]/10 text-[#128F80] flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <span>+91 (748) 587-0839</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#128F80]/10 text-[#128F80] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>123 main road, Ranchi, 834001</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-7 bg-white dark:bg-[#18202C] rounded-3xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800 shadow-soft">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#16A36A] mx-auto" />
                <h3 className="font-heading font-bold text-lg text-gray-900 dark:text-white">
                  Message Dispatched!
                </h3>
                <p className="text-xs text-gray-500">
                  Thank you, {name}! Our team has received your message and will reply to {email} shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@domain.com"
                      className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Course inquiry or technical question..."
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you today?..."
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-[#128F80]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-bold text-xs bg-[#128F80] hover:bg-[#087568] text-white shadow-card transition-all active:scale-95"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

