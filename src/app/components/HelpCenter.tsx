import { Search, Book, FileText, Video, MessageCircle, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import Header from './Header';

type Screen = 'overview' | 'security' | 'preferences' | 'support' | 'reset-password' | '2fa' | 'help-center' | 'contact-support';

interface HelpCenterProps {
  onNavigate: (screen: Screen) => void;
}

export default function HelpCenter({ onNavigate }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      id: 'getting-started',
      icon: Book,
      title: 'Getting Started',
      description: 'Learn the basics',
      articleCount: 8,
      color: 'bg-[#eef4ff]',
      iconColor: 'text-[#0066cc]',
    },
    {
      id: 'account-settings',
      icon: FileText,
      title: 'Account & Settings',
      description: 'Manage your profile',
      articleCount: 12,
      color: 'bg-[#f3e8ff]',
      iconColor: 'text-[#7c3aed]',
    },
    {
      id: 'video-tutorials',
      icon: Video,
      title: 'Video Tutorials',
      description: 'Watch and learn',
      articleCount: 6,
      color: 'bg-[#fef3c7]',
      iconColor: 'text-[#f59e0b]',
    },
    {
      id: 'troubleshooting',
      icon: MessageCircle,
      title: 'Troubleshooting',
      description: 'Fix common issues',
      articleCount: 10,
      color: 'bg-[#fee2e2]',
      iconColor: 'text-[#dc2626]',
    },
  ];

  const popularArticles = [
    {
      id: 'article1',
      title: 'How to update your profile information',
      category: 'Account & Settings',
      readTime: '3 min read',
    },
    {
      id: 'article2',
      title: 'Setting up Two-Factor Authentication',
      category: 'Security',
      readTime: '5 min read',
    },
    {
      id: 'article3',
      title: 'Understanding your dashboard',
      category: 'Getting Started',
      readTime: '4 min read',
    },
    {
      id: 'article4',
      title: 'Managing notification preferences',
      category: 'Account & Settings',
      readTime: '2 min read',
    },
    {
      id: 'article5',
      title: 'How to reset your password',
      category: 'Security',
      readTime: '3 min read',
    },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-[#f6f6f6]">
      <div className="flex-none">
        <Header title="Help Center" onBack={() => onNavigate('support')} showBackButton />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-6 p-4 w-full pb-8 rounded-tl-[20px] rounded-tr-[20px] bg-[#f6f6f6] -mt-[20px] relative z-20">
          {/* Search Bar */}
          <div className="flex flex-col gap-2">
            <p className="text-[14px] text-[#6b7280]">Find answers to your questions</p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-[8px] border border-[#d1d5db] bg-white text-[15px] text-black placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#0066cc] focus:border-transparent"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[16px] font-semibold text-black">Browse by Category</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    className="bg-white rounded-[8px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_6px_24px_0px_rgba(0,0,0,0.05)] p-4 flex flex-col gap-3 hover:bg-[#f9f9f9] transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${category.iconColor}`} />
                    </div>
                    <div className="flex flex-col gap-1 text-left">
                      <p className="text-[15px] font-semibold text-black">{category.title}</p>
                      <p className="text-[12px] text-[#6b7280]">{category.description}</p>
                      <p className="text-[12px] text-[#9ca3af] mt-1">{category.articleCount} articles</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Popular Articles */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[16px] font-semibold text-black">Popular Articles</h3>
            <div className="flex flex-col gap-2">
              {popularArticles.map((article) => (
                <button
                  key={article.id}
                  className="bg-white rounded-[8px] shadow-[0px_0px_0px_1px_rgba(0,0,0,0.08),0px_6px_24px_0px_rgba(0,0,0,0.05)] p-4 flex items-center gap-3 hover:bg-[#f9f9f9] transition-colors"
                >
                  <div className="flex-1 text-left">
                    <p className="text-[15px] font-semibold text-black mb-1">{article.title}</p>
                    <div className="flex items-center gap-2 text-[12px] text-[#6b7280]">
                      <span>{article.category}</span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#9ca3af] flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Contact Support CTA */}
          <div className="bg-gradient-to-r from-[#0066cc] to-[#0052a3] rounded-[8px] p-5">
            <h3 className="text-[16px] font-semibold text-white mb-2">Still need help?</h3>
            <p className="text-[13px] text-white/90 mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <button
              onClick={() => onNavigate('contact-support')}
              className="bg-white text-[#0066cc] px-4 py-2.5 rounded-[6px] w-full font-semibold hover:bg-white/95 transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}