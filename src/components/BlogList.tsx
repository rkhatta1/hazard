"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Calendar, Clock, X, Loader2 } from 'lucide-react';
import { ExpandedContentProps } from '@/types';
import { BlogPost } from '@/util/blogPosts';

type BlogListProps = ExpandedContentProps & {
  posts: BlogPost[];
  isLoading: boolean;
};

const BlogList: React.FC<BlogListProps> = ({ theme, posts, isLoading }) => {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const isLight = theme === 'light';

  useEffect(() => {
    if (!posts.length || activePost) return;

    const savedPostId = localStorage.getItem('portfolio_active_blog_id');
    if (savedPostId) {
      const savedPost = posts.find((p) => p.id === savedPostId);
      if (savedPost) setActivePost(savedPost);
    }
  }, [posts, activePost]);

  const handlePostClick = (post: BlogPost) => {
    setActivePost(post);
    localStorage.setItem('portfolio_active_blog_id', post.id);
  };

  const handleBack = () => {
    setActivePost(null);
    localStorage.removeItem('portfolio_active_blog_id');
  };

  const textColor = isLight ? 'text-slate-900' : 'text-white';
  const subText = isLight ? 'text-slate-500' : 'text-neutral-400';
  const cardBg = isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-200' : 'bg-neutral-800/50 hover:bg-neutral-800 border-neutral-800';

  if (isLoading) {
      return (
          <div className="w-full h-full flex items-center justify-center">
              <Loader2 className={`animate-spin ${textColor}`} size={32} />
          </div>
      );
  }

  return (
    <>
      <div className="w-full">
        <div className="grid gap-6">
          {posts.map((post) => (
            <div 
              key={post.id} 
              onClick={() => handlePostClick(post)}
              className={`group flex flex-col md:flex-row gap-6 border p-6 rounded-2xl cursor-pointer transition-all duration-300 ${cardBg}`}
            >
              <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden flex-shrink-0">
                 <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex flex-col justify-center">
                  <div className={`flex items-center gap-3 text-xs ${subText} mb-2`}>
                      <span className={`${isLight ? 'bg-slate-300/50' : 'bg-neutral-700/50'} px-2 py-1 rounded`}>{post.date}</span>
                      <span>{post.readTime}</span>
                  </div>
                  <h3 className={`text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors ${textColor}`}>{post.title}</h3>
                  <p className={`${subText} line-clamp-2`}>{post.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {activePost && (
            <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center pointer-events-none p-0 md:p-8">
               {/* Backdrop */}
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 onClick={handleBack}
                 className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
               />
               
               {/* Slide-up Card */}
               <motion.div
                 initial={{ y: "115%" }}
                 animate={{ y: 0 }}
                 exit={{ y: "115%" }}
                 transition={{ type: "spring", damping: 19, stiffness: 135 }}
                 className={`w-full h-[90vh] md:h-full rounded-t-3xl md:rounded-3xl shadow-2xl pointer-events-auto overflow-hidden flex flex-col relative ${isLight ? 'bg-white' : 'bg-neutral-900'}`}
               >
                  {/* Close Button */}
                  <button 
                    onClick={handleBack}
                    className={`absolute top-6 right-6 p-2 rounded-full z-50 transition-colors ${isLight ? 'bg-slate-100 text-slate-800 hover:bg-slate-200' : 'bg-neutral-800 text-white hover:bg-neutral-700'}`}
                  >
                     <X size={20} />
                  </button>

                  <div className="overflow-y-auto no-scrollbar h-full">
                    <div className="max-w-4xl mx-auto p-6 md:p-12">
                      <button 
                        onClick={handleBack}
                        className={`group flex items-center gap-2 mb-8 transition-colors ${isLight ? 'text-slate-500 hover:text-slate-900' : 'text-neutral-400 hover:text-white'}`}
                      >
                        <div className={`p-2 rounded-full transition-colors ${isLight ? 'bg-slate-100 group-hover:bg-slate-200' : 'bg-neutral-800 group-hover:bg-neutral-700'}`}>
                           <ArrowLeft size={20} />
                        </div>
                        <span className="font-medium">Back to Articles</span>
                      </button>

                      <article>
                        {/* Hero Image - No Title Overlap */}
                        <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-12 relative">
                            <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent opacity-60 ${isLight ? 'from-white' : 'from-neutral-900'}`}></div>
                            <img src={activePost.image} alt={activePost.title} className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                                <div className="flex items-center gap-4 text-sm font-medium text-white/90 bg-black/30 backdrop-blur-md inline-flex px-4 py-2 rounded-full">
                                  <span className="flex items-center gap-2"><Calendar size={14}/> {activePost.date}</span>
                                  <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                                  <span className="flex items-center gap-2"><Clock size={14}/> {activePost.readTime}</span>
                                </div>
                            </div>
                        </div>

                        {/* Title Section (Serif) */}
                        <div className={`mb-12 border-b pb-8 ${isLight ? 'border-slate-200' : 'border-neutral-800'}`}>
                             <h1 className={`text-4xl md:text-6xl font-serif font-bold leading-tight mb-4 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                                {activePost.title}
                             </h1>
                        </div>
                        
                        <div className={`prose prose-lg max-w-none rounded-xl pb-12 min-h-[200px] ${isLight ? 'prose-slate' : 'prose-invert'}
                           prose-headings:font-serif
                           prose-a:text-blue-400
                           prose-code:text-pink-400
                           prose-pre:bg-neutral-800
                           prose-pre:border
                           prose-pre:border-neutral-700
                        `}>
                            <ReactMarkdown>{activePost.content}</ReactMarkdown>
                        </div>
                      </article>
                    </div>
                  </div>
               </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default BlogList;
