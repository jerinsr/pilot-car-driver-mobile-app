import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  ChevronLeft,
  Mail,
  MessageSquare,
  Phone,
  Send,
  CheckCircle2,
} from "lucide-react";

interface ContactSupportPageProps {
  onBack: () => void;
}

export function ContactSupportPage({ onBack }: ContactSupportPageProps) {
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    message: "",
    email: "michael.thompson@pilotcar.com",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const categories = [
    "Technical Issue",
    "Billing Question",
    "Job Assignment",
    "Account Management",
    "Documentation",
    "Other",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ ...formData, subject: "", category: "", message: "" });
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="size-6 text-white" />
          </button>
          <h1 className="text-lg font-bold text-white">Contact Support</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-4">
          {/* Quick Contact Options */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href="tel:+15551234567"
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="bg-blue-100 rounded-lg p-2 w-fit mb-2">
                <Phone className="size-5 text-blue-600" />
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-1">
                Call Us
              </p>
              <p className="text-xs text-gray-500">24/7 Support</p>
            </a>
            <a
              href="mailto:support@overwize.com"
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="bg-green-100 rounded-lg p-2 w-fit mb-2">
                <Mail className="size-5 text-green-600" />
              </div>
              <p className="font-semibold text-gray-900 text-sm mb-1">
                Email Us
              </p>
              <p className="text-xs text-gray-500">Response in 24h</p>
            </a>
          </div>

          {/* Success Message */}
          {isSubmitted && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-900 mb-1">
                  Message Sent Successfully!
                </p>
                <p className="text-xs text-green-700">
                  We've received your message and will respond within 24 hours.
                </p>
              </div>
            </div>
          )}

          {/* Contact Form */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-orange-100 rounded-lg p-2">
                <MessageSquare className="size-4 text-[#f89823]" />
              </div>
              <h3 className="font-semibold text-gray-900">Send us a message</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-xs text-gray-500 mb-1">
                  Your Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category" className="text-xs text-gray-500 mb-1">
                  Category
                </Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#f89823] focus:border-transparent"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="subject" className="text-xs text-gray-500 mb-1">
                  Subject
                </Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  placeholder="Brief description of your issue"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-xs text-gray-500 mb-1">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  placeholder="Please provide as much detail as possible..."
                  rows={6}
                  required
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#f89823] text-white hover:bg-[#e08820]"
              >
                <Send className="size-5 mr-2" />
                Send Message
              </Button>
            </form>
          </div>

          {/* Support Hours */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Support Hours</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Phone Support:</span>
                <span className="font-medium text-gray-900">24/7</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Email Support:</span>
                <span className="font-medium text-gray-900">24/7</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Live Chat:</span>
                <span className="font-medium text-gray-900">Mon-Fri, 8am-8pm CST</span>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-900 font-semibold mb-2">
              Emergency Support
            </p>
            <p className="text-sm text-red-700 mb-3">
              For urgent issues during an active job, call our emergency hotline:
            </p>
            <a
              href="tel:+18005551234"
              className="inline-flex items-center gap-2 text-sm font-bold text-red-600 hover:text-red-700"
            >
              <Phone className="size-4" />
              1-800-555-1234
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}