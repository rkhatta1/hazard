"use client";

import React, { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  MapPin, 
  Code, 
  Briefcase, 
  User, 
  Globe,
  BookOpen,
  Phone,
  FileText,
  Sun,
  Moon,
  Cloud,
  GitCommitVertical
} from 'lucide-react';
import BentoItem from '@/components/BentoItem';
import ExpandedView from '@/components/ExpandedView';
import BlogList from '@/components/BlogList';
import { GridItem, Theme } from '@/types';
import { getAllPosts, BlogPost } from '@/util/blogPosts';
import cravemateImg from '@/public/cravemate.webp'

// --- BACKGROUND DECORATIONS ---

const BackgroundDecorations = ({ theme }: { theme: Theme }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth mouse tracking
  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate from center of screen
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX - innerWidth / 2);
      mouseY.set(e.clientY - innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Parallax layers (dividing by different factors for depth)
  // Positive division moves in direction of cursor (as requested)
  const layer1X = useTransform(springX, (x) => x / 30);
  const layer1Y = useTransform(springY, (y) => y / 30);
  
  const layer2X = useTransform(springX, (x) => x / 60);
  const layer2Y = useTransform(springY, (y) => y / 60);
  
  const layer3X = useTransform(springX, (x) => x / 90);
  const layer3Y = useTransform(springY, (y) => y / 90);

  // Generate stars once
  const stars = useMemo(() => {
    return [...Array(40)].map((_, i) => ({
      id: i,
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      size: Math.random() * 3 + 1 + 'px',
      layer: i % 3 // 0, 1, or 2
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <AnimatePresence mode="wait">
        {theme === 'light' ? (
          <motion.div
            key="clouds"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="w-full h-full relative"
          >
             {/* Cloud 1 - Fastest/Closest */}
             <div className="absolute top-20 left-[10%]">
                <motion.div style={{ x: layer1X, y: layer1Y }}>
                  <motion.div 
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 0.8 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="text-white/40"
                  >
                    <Cloud size={120} fill="currentColor" />
                  </motion.div>
                </motion.div>
             </div>

             {/* Cloud 2 - Medium */}
             <div className="absolute top-40 right-[15%]">
                <motion.div style={{ x: layer2X, y: layer2Y }}>
                  <motion.div 
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 0.6 }}
                    transition={{ duration: 2.5, delay: 0.2, ease: "easeOut" }}
                    className="text-white/30"
                  >
                    <Cloud size={180} fill="currentColor" />
                  </motion.div>
                </motion.div>
             </div>

             {/* Cloud 3 - Slowest/Furthest */}
             <div className="absolute bottom-20 left-[20%]">
                <motion.div style={{ x: layer3X, y: layer3Y }}>
                   <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 0.5 }}
                    transition={{ duration: 3, delay: 0.5, ease: "easeOut" }}
                    className="text-white/20"
                  >
                    <Cloud size={100} fill="currentColor" />
                  </motion.div>
                </motion.div>
             </div>
          </motion.div>
        ) : (
          <motion.div
            key="stars"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="w-full h-full relative"
          >
            {/* Render stars in layers for parallax */}
            {[0, 1, 2].map((layerIndex) => {
                let xMotion, yMotion;
                if (layerIndex === 0) { xMotion = layer1X; yMotion = layer1Y; }
                else if (layerIndex === 1) { xMotion = layer2X; yMotion = layer2Y; }
                else { xMotion = layer3X; yMotion = layer3Y; }

                return (
                  <motion.div 
                    key={`star-layer-${layerIndex}`}
                    className="absolute inset-0 w-full h-full"
                    style={{ x: xMotion, y: yMotion }}
                  >
                    {stars.filter(s => s.layer === layerIndex).map((star) => (
                      <motion.div
                        key={star.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: Math.random() * 0.7 + 0.3 }}
                        transition={{ duration: 0.5, delay: star.id * 0.05 }}
                        className="absolute bg-white rounded-full"
                        style={{
                          width: star.size,
                          height: star.size,
                          top: star.top,
                          left: star.left,
                        }}
                      />
                    ))}
                  </motion.div>
                );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type CommitItem = {
  sha: string;
  message: string;
  repo: string;
  url: string;
};

const RecentCommits = ({
  theme,
  commits,
  isLoading
}: {
  theme: Theme;
  commits: CommitItem[];
  isLoading: boolean;
}) => {
  const isLight = theme === 'light';

  const cardBg = isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-neutral-800/70 border-neutral-700';
  const textColor = isLight ? 'text-slate-900' : 'text-white';
  const subTextColor = isLight ? 'text-slate-600' : 'text-neutral-400';

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((idx) => (
          <div
            key={idx}
            className={`rounded-xl border p-4 animate-pulse ${cardBg}`}
          >
            <div className="flex justify-start items-center gap-3">
              <div className={`h-6 w-6 rounded ${isLight ? 'bg-slate-300' : 'bg-neutral-700'}`} />
              <div className="flex-1 space-y-2">
                <div className={`h-4 w-3/4 rounded ${isLight ? 'bg-slate-300' : 'bg-neutral-700'}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!commits.length) {
    return <div className={subTextColor}>No recent commits found.</div>;
  }

  return (
    <div className="space-y-4">
      {commits.slice(0, 3).map((commit, idx) => (
        <a
          key={`${commit.repo}-${commit.sha}`}
          href="https://github.com/rkhatta1"
          target="_blank"
          rel="noreferrer"
          className={`grid grid-cols-12 items-center justify-start space-x-3 rounded-xl border p-4 transition-colors ${cardBg}`}
          style={{ opacity: Math.max(0.1, 1 - idx * 0.3) }}
        >
          <GitCommitVertical size={20} className={`col-span-1 ${isLight ? 'text-slate-700' : 'text-neutral-200'}`} />
          <div className="min-w-0 col-span-11">
            <div className={`font-semibold ${textColor} truncate`}>{commit.message}</div>
          </div>
        </a>
      ))}
    </div>
  );
};

// --- DATA DEFINITION ---

const getItems = (
  theme: Theme,
  showOpenToWork: boolean,
  recentCommits: CommitItem[],
  isCommitsLoading: boolean,
  blogPosts: BlogPost[],
  isPostsLoading: boolean,
  onCopyToClipboard: (value: string, message: string) => void
): GridItem[] => {
  const isLight = theme === 'light';
  // Dynamic colors based on theme
  const textColor = isLight ? 'text-slate-900' : 'text-white';
  const subTextColor = isLight ? 'text-slate-500' : 'text-neutral-400';
  const cardBg = isLight ? 'bg-sky-100' : 'bg-neutral-800';
  const cardBorder = isLight ? 'border-sky-200' : 'border-neutral-700';
  const accentText = isLight ? 'text-sky-600' : 'text-white';

  return [
    {
      id: 'profile',
      title: 'Hello, I\'m Raajveer',
      originSide: 'left',
      colSpan: 'col-span-1 md:col-span-2',
      rowSpan: 'row-span-2',
      content: (
        <>
          {showOpenToWork && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 225, damping: 17 }}
              className="absolute left-6 top-6 z-20"
            >
              <div className="flex items-center gap-2 rounded-full bg-emerald-500/90 text-white text-[11px] font-semibold px-3 py-1 shadow-lg shadow-emerald-900/30 border border-white/20 backdrop-blur-sm uppercase tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full rounded-full bg-white/90 animate-ping"
                  />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                Open to work
              </div>
            </motion.div>
          )}
          <div className="absolute inset-0 z-0">
             <img 
              src="/pfp.webp"
              alt="Profile" 
              className="w-full h-full object-cover md:grayscale md:group-hover:grayscale-0 transition-all duration-500" 
             />
             {/* Gradient Overlay to ensure text readability */}
             <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          </div>
          
          <div className="relative z-10 h-full flex flex-col justify-end">
            <h1 className="text-3xl font-bold mb-1 text-white">Raajveer Khattar</h1>
            <p className="text-neutral-200 font-medium">Full-Stack Software Engineer</p>
            <div className="flex items-center gap-2 mt-4 text-xs font-medium text-neutral-300 uppercase tracking-wide">
              <MapPin size={12} /> Phoenix, AZ
            </div>
          </div>
        </>
      ),
      expandedContent: (
        <div className="space-y-6 md:space-y-8">
          <header>
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${textColor}`}>About Me</h2>
            <p className={`text-lg md:text-2xl ${isLight ? 'text-slate-600' : 'text-neutral-300'} leading-relaxed max-w-3xl`}>
              I like making things move on screens.
            </p>
          </header>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12 md:mt-12">
              <div>
                  <h3 className={`text-xl font-semibold mb-2 md:mb-4 ${textColor} flex items-center gap-2`}>
                      <User size={20} /> Background
                  </h3>
                  <p className={`${subTextColor} text-sm md:text-md leading-7`}>
                      Recently graduated from ASU with my Masters in Software Engineering, I've been programming for the better part of the past decade and I primarily build end-to-end AI systems on the web.
                      <br />
                      Apart from blasting my eyes with absurd amounts of screen-time, I'm an avid tennis and football fan. Up the Chels!
                      <br />
                      If not with my laptop, you'll find me scrolling through dog videos on the internet :P
                  </p>
              </div>
              <div>
                   <h3 className={`text-xl font-semibold mb-2 md:mb-4 ${textColor} flex items-center gap-2`}>
                      <Code size={20} /> Stack
                  </h3>
                   <div className="flex flex-wrap gap-2">
                      {['React', 'TypeScript', 'Next.js', 'Node.js', 'Tailwind', 'Framer Motion', 'Python (3.12)', 'PostgreSQL', 'Docker', 'NeoVim', 'Linux', 'Google Cloud'].map(tech => (
                          <span key={tech} className={`px-3 py-1 ${cardBg} rounded-full text-sm ${isLight ? 'text-slate-700 border-sky-200' : 'text-neutral-300 border-neutral-700'} border`}>
                              {tech}
                          </span>
                      ))}
                   </div>
              </div>
          </div>
        </div>
      )
    },
    {
      id: 'work',
      title: 'Experience',
      originSide: 'right',
      colSpan: 'col-span-1',
      rowSpan: 'row-span-1',
      content: (
        <div className="flex flex-col h-full justify-between">
           <div className={`${cardBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
              <Briefcase size={20} className={accentText} />
           </div>
           <div>
              <h3 className={`text-xl font-bold ${textColor}`}>Experience</h3>
              <p className={`${subTextColor} text-sm mt-1`}>My professional journey</p>
           </div>
        </div>
      ),
      expandedContent: (
        <div className="max-w-2xl">
           <h2 className={`text-3xl md:text-4xl font-bold mb-8 md:mb-12 ${textColor}`}>Work History</h2>
           <div className={`relative border-l ${isLight ? 'border-slate-300' : 'border-neutral-800'} ml-3 space-y-8 md:space-y-12`}>
              {[
                  { role: 'Multimedia Services Assistant (Part-Time)', company: 'Fulton School of Engineering', period: 'Aug. 2024 - Dec. 2025', desc: 'Aided the faculties in recording their content for the online students.' },
                  { role: 'Software Development Engineer, Full-Stack', company: 'Trade Journal Project', period: 'Feb. 2023 - Dec. 2023', desc: 'Built core trade logging features for a fin-tech startup. Tech stack: Python/Flask, React.js, GCP, Google Analytics, Pytest and Selenium.' },
                  { role: 'Freelance Media Curator', company: 'Self-Employed', period: '2020 - 2023', desc: 'Collaborated with a couple dozen clients to create exciting visuals for their marketing campaigns. Everything from landing pages, to animated videos and captivating graphics.' }
              ].map((job, idx) => (
                  <div key={idx} className="relative pl-8">
                      <div className={`absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full ${isLight ? 'bg-sky-600 ring-sky-100' : 'bg-white ring-neutral-900'} ring-4`} />
                      <h3 className={`text-[1.1rem] md:text-2xl font-bold ${textColor}`}>{job.role}</h3>
                      <div className={`${subTextColor} mb-2 font-mono text-[0.8rem] md:text-sm`}>{job.company} • {job.period}</div>
                      <p className={`text-[0.9rem] md:text-md ${isLight ? 'text-slate-600' : 'text-neutral-300'}`}>{job.desc}</p>
                  </div>
              ))}
           </div>
        </div>
      )
    },
    {
      id: 'projects',
      title: 'Projects',
      originSide: 'right', // Starting right side
      colSpan: 'col-span-1',
      rowSpan: 'row-span-2',
      content: (
        <div className="h-full flex flex-col justify-between">
           <div className={`${cardBg} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
              <Globe size={20} className={accentText} />
           </div>
           <div>
              <h3 className={`text-xl font-bold ${textColor} mb-2`}>Projects</h3>
              <div className="space-y-2 -mb-2 md:mb-0">
                  <div className={`h-9 md:h-16 w-full ${isLight ? 'bg-sky-100/50 border-sky-200' : 'bg-neutral-800/50 border-neutral-800'} rounded-lg border p-2 flex items-center gap-3`}>
                      <div className={`w-4 h-4 md:w-10 md:h-10 ${isLight ? 'bg-sky-200' : 'bg-black'} rounded flex-shrink-0`} />
                      <div className="w-full">
                          <div className={`h-1 md:h-2 w-16 ${isLight ? 'bg-sky-300' : 'bg-neutral-700'} rounded mb-1`} />
                          <div className={`h-1 md:h-2 w-8 ${isLight ? 'bg-sky-200' : 'bg-neutral-800'} rounded`} />
                      </div>
                  </div>
                   <div className={`h-6 md:h-16 w-full ${isLight ? 'bg-sky-100/50 border-sky-200' : 'bg-neutral-800/50 border-neutral-800'} rounded-lg border p-2 hidden md:flex items-center gap-3 opacity-50`}>
                      <div className={`w-3 h-3 md:w-10 md:h-10 ${isLight ? 'bg-sky-200' : 'bg-black'} rounded flex-shrink-0`} />
                      <div className="w-full">
                          <div className={`h-1 md:h-2 w-12 ${isLight ? 'bg-sky-300' : 'bg-neutral-700'} rounded mb-1`} />
                          <div className={`h-1 md:h-2 w-10 ${isLight ? 'bg-sky-200' : 'bg-neutral-800'} rounded`} />
                      </div>
                  </div>
              </div>
           </div>
        </div>
      ),
      expandedContent: (
        <div className="w-full">
          <div className="grid grid-cols-2 gap-8">
              {[
                { title: 'Cravemate', subtext: `A group chat that solves the "where are we eating tonight boys?" debate with Yelp's AI API.`, imageUrl: 'https://opengraph.githubassets.com/1/rkhatta1/Cravemate', cta: 'https://cravemate-swart.vercel.app/' },
                { title: 'JobScoutPro', subtext: 'An event-driven agentic job scraper that periodically scrapes, filters, and logs (google sheets) the latest jobs.', imageUrl: 'https://opengraph.githubassets.com/1/rkhatta1/JobScoutPro', cta: 'https://github.com/rkhatta1/JobScoutPro' },
                { title: 'GitFi', subtext: 'An AI git helper to generate/automate (better) commit messages.', imageUrl: 'https://opengraph.githubassets.com/1/rkhatta1/gitfi', cta: 'https://www.npmjs.com/package/gitfi' },
                { title: 'ChapGen', subtext: 'AI-powered YouTube chapter generation, built on a fully cloud-native, event-driven architecture.', imageUrl: 'https://opengraph.githubassets.com/1/rkhatta1/ChapterGen', cta: 'https://github.com/rkhatta1/ChapterGen' },
                { title: 'SplitThat', subtext: 'A Splitwise helper to automate bill itemization using OCR and Generative AI.', imageUrl: 'https://opengraph.githubassets.com/1/rkhatta1/SplitThat', cta: 'https://github.com/rkhatta1/SplitThat' },
                { title: 'The Versus Project', subtext: 'An AI content tool to fetch the latest, global football news and create @versus style captions for it.', imageUrl: 'https://opengraph.githubassets.com/1/rkhatta1/TheVersusProject', cta: 'https://github.com/rkhatta1/TheVersusProject' },
                { title: 'Equate-TTS', subtext: 'A text-to-speech helper SDK for properly synthesising math expressions', imageUrl: 'https://opengraph.githubassets.com/1/rkhatta1/equate-tts', cta: 'https://github.com/rkhatta1/equate-tts' }
              ].map((p, idx) => (
                  <div key={idx} className={`group ${cardBg} rounded-2xl border ${cardBorder} transition-colors cursor-pointer p-4`}>
                      <div className="relative w-full overflow-hidden rounded-xl shadow-md shadow-black/20 aspect-2/1">
                        <a href={p.cta} target='_blank'>
                        <Image 
                          src={p.imageUrl ?? `https://picsum.photos/1200/600?random=${idx}`} 
                          className="object-cover md:grayscale md:group-hover:grayscale-0 md:transition-[filter] md:duration-500" 
                          alt="Project" 
                          fill
                          sizes="(min-width: 1024px) 900px, 100vw"
                        />
                        </a>
                      </div>
                  </div>
              ))}
          </div>
        </div>
      )
    },
    {
      id: 'linkedin',
      title: 'LinkedIn',
      originSide: 'right',
      colSpan: 'col-span-1',
      content: (
        <div className={`h-full flex flex-col justify-center items-center gap-4 group-hover:text-[#0077B5] transition-colors ${textColor}`}>
           <Linkedin size={32} />
           <span className="font-medium">/raajveer-khattar</span>
        </div>
      ),
      expandedContent: (
        <div className="flex flex-col items-center justify-center h-full text-center mt-[45%] md:mt-0">
              <Linkedin size={64} className="text-[#0077B5] mb-6" />
              <h2 className={`text-3xl font-bold mb-4 ${textColor}`}>Let's Connect!</h2>
              <p className={`${subTextColor} max-w-md mb-8`}>
                  I share my thoughts on engineering, workflow automation, and the tools I'm building. 
                  Drop me a DM!
              </p>
              <a href="https://www.linkedin.com/in/raajveer-khattar" target='_blank' className={`px-8 py-3 ${isLight ? 'bg-slate-900 text-white' : 'bg-white text-black'} font-bold rounded-full hover:bg-[#0077B5] hover:text-white transition-colors`}>
                  @raajveer-khattar
              </a>
          </div>
      )
    },
    {
      id: 'github',
      title: 'GitHub',
      originSide: 'left',
      colSpan: 'col-span-1',
      content: (
        <div className={`h-full flex flex-col justify-center items-center gap-4 group-hover:text-purple-400 transition-colors ${textColor}`}>
           <Github size={32} />
           <span className="font-medium">/rkhatta1</span>
        </div>
      ),
      expandedContent: (
           <div className="flex flex-col items-center justify-center h-full text-center mt-[45%] md:mt-0">
              <Github size={64} className="text-purple-400 mb-6" />
              <h2 className={`text-3xl font-bold mb-4 ${textColor}`}>Perpetually Building</h2>
              <p className={`${subTextColor} max-w-md mb-8`}>
                  Most of my projects are open source. Feel free to explore my repositories and contributions.
              </p>
              <div className="w-full max-w-md text-left">
                <RecentCommits
                  theme={theme}
                  commits={recentCommits}
                  isLoading={isCommitsLoading}
                />
              </div>
          </div>
      )
    },
    {
      id: 'contact',
      title: 'Contact',
      originSide: 'left',
      colSpan: 'col-span-1', // Last block
      content: (
         <div className={`h-full flex flex-col justify-center items-center gap-4 group-hover:text-green-400 transition-colors ${textColor}`}>
           <Mail size={32} />
           <span className="font-medium">Get in touch</span>
        </div>
      ),
      expandedContent: (
           <div className="flex flex-col h-full justify-center items-center md:mt-0 mt-[45%]">
              <div className="space-y-8">
              <div className={`text-4xl flex font-bold mb-12 ${textColor}`}>Get in Touch</div>
                  <button
                    type="button"
                    onClick={() => onCopyToClipboard('khattarraajveer@gmail.com', 'Email copied')}
                    className={`w-full flex items-center gap-4 cursor-pointer text-xl md:text-2xl text-left ${subTextColor} hover:text-green-400 transition-colors`}
                    title="Click to copy email"
                  >
                      <div className={`w-12 h-12 ${cardBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                         <Mail size={24} className={accentText} />
                      </div>
                      <span className="break-all">khattarraajveer@gmail.com</span>
                  </button>
  
                  <button
                    type="button"
                    onClick={() => onCopyToClipboard('+16237553499', 'Phone number copied')}
                    className={`w-full flex items-center gap-4 text-xl cursor-pointer md:text-2xl text-left ${subTextColor} hover:text-green-400 transition-colors`}
                    title="Click to copy phone number"
                  >
                      <div className={`w-12 h-12 ${cardBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                         <Phone size={24} className={accentText} />
                      </div>
                      <span>+1 (623) 755-3499</span>
                  </button>
  
                  <div className="pt-8 flex items-center justify-start">
                      <a href="https://drive.google.com/file/d/1gdjsLIGyG4KSYhS1h1VHnbIcO8sJA1zq/view?usp=sharing" target='_blank' className={`inline-flex items-center gap-3 px-8 py-4 ${isLight ? 'bg-slate-900 text-white hover:bg-slate-700' : 'bg-white text-black hover:bg-neutral-200'} font-bold rounded-full transition-colors text-lg`}>
                         <FileText size={20} />
                         Resume
                      </a>
                  </div>
              </div>
           </div>
      )
    },
    {
      id: 'blog',
      title: 'Blog',
      originSide: 'right',
      colSpan: 'col-span-1 md:col-span-2', 
      rowSpan: 'row-span-1',
      content: (
         <div className={`h-full flex flex-col justify-between group-hover:text-yellow-400 transition-colors`}>
           <div className={`${cardBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
              <BookOpen size={20} className={accentText} />
           </div>
           <div>
              <h3 className={`text-xl font-bold ${textColor}`}>Blogs</h3>
              <p className={`${subTextColor} text-sm mt-1`}>Thoughts on the everchanging tech and my workflows.</p>
           </div>
        </div>
      ),
      expandedContent: (props) => (
        <BlogList {...props} posts={blogPosts} isLoading={isPostsLoading} />
      )
  }
  ];
};

// --- APP COMPONENT ---

export default function HomePage() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 768) {
        return 'dark';
      }
      const saved = localStorage.getItem('portfolio_theme');
      return (saved === 'light' || saved === 'dark') ? saved : 'light';
    }
    return 'light';
  });

  const [selectedId, setSelectedId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('portfolio_selected_id');
    }
    return null;
  });
  
  const [isExiting, setIsExiting] = useState(false);
  const [isGridReady, setIsGridReady] = useState(false);
  const [recentCommits, setRecentCommits] = useState<CommitItem[]>([]);
  const [isCommitsLoading, setIsCommitsLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const handleCopyToClipboard = useCallback(async (value: string, message: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }

    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2200);
  }, []);

  // Memoize items based on theme to prevent unnecessary re-renders
  const items = useMemo(
    () =>
      getItems(
        theme,
        isGridReady,
        recentCommits,
        isCommitsLoading,
        blogPosts,
        isPostsLoading,
        handleCopyToClipboard
      ),
    [
      theme,
      isGridReady,
      recentCommits,
      isCommitsLoading,
      blogPosts,
      isPostsLoading,
      handleCopyToClipboard
    ]
  );

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem('portfolio_theme', theme);
    }
  }, [theme, isMobile]);

  useEffect(() => {
    let isMounted = true;
    const cacheKey = 'portfolio_recent_commits';
    const cacheTtlMs = 24 * 60 * 60 * 1000;

    const loadCommits = async () => {
      try {
        const cachedRaw = localStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw) as { ts: number; commits: CommitItem[] };
          if (cached?.ts && Array.isArray(cached.commits)) {
            const isFresh = Date.now() - cached.ts < cacheTtlMs;
            if (isFresh) {
              if (isMounted) {
                setRecentCommits(cached.commits);
                setIsCommitsLoading(false);
              }
              return;
            }
          }
        }

        const response = await fetch('/api/commits?username=rkhatta1');
        const data = await response.json();
        const commits = Array.isArray(data.commits) ? data.commits : [];

        if (isMounted) {
          setRecentCommits(commits);
        }

        localStorage.setItem(
          cacheKey,
          JSON.stringify({ ts: Date.now(), commits })
        );
      } catch {
        if (isMounted) {
          setRecentCommits([]);
        }
      } finally {
        if (isMounted) {
          setIsCommitsLoading(false);
        }
      }
    };

    loadCommits();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const cacheKey = 'portfolio_blog_posts';
    const cacheTtlMs = 24 * 60 * 60 * 1000;

    const loadPosts = async () => {
      try {
        const cachedRaw = localStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw) as { ts: number; posts: BlogPost[] };
          if (cached?.ts && Array.isArray(cached.posts)) {
            const isFresh = Date.now() - cached.ts < cacheTtlMs;
            if (isFresh) {
              if (isMounted) {
                setBlogPosts(cached.posts);
                setIsPostsLoading(false);
              }
              return;
            }
          }
        }

        const posts = await getAllPosts();
        if (isMounted) {
          setBlogPosts(posts);
        }

        localStorage.setItem(
          cacheKey,
          JSON.stringify({ ts: Date.now(), posts })
        );
      } catch {
        if (isMounted) {
          setBlogPosts([]);
        }
      } finally {
        if (isMounted) {
          setIsPostsLoading(false);
        }
      }
    };

    loadPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (selectedId) {
        localStorage.setItem('portfolio_selected_id', selectedId);
    } else {
        localStorage.removeItem('portfolio_selected_id');
    }
  }, [selectedId]);

  const handleCardClick = (id: string) => {
    if (isExiting || selectedId) return;
    setSelectedId(id);
  };

  const handleClose = () => {
    setIsExiting(true);
    setSelectedId(null);
  };

  const toggleTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  const handleGridReady = () => {
    if (!isGridReady) {
      setIsGridReady(true);
    }
  };

  return (
    <div 
      className={`min-h-screen relative transition-colors duration-700 ease-in-out py-12 px-4 md:px-12 lg:px-24 flex flex-col justify-center items-center overflow-hidden
      ${theme === 'light' ? 'bg-sky-300' : 'bg-[#0f172a]'}`}
    >
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key={toastMessage}
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-[80]"
          >
            <div className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg ${theme === 'light' ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
              {toastMessage}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Decorations (Clouds/Stars) */}
      <div className="hidden md:block">
        <BackgroundDecorations theme={theme} />
      </div>

      {/* THEME TOGGLES */}
      <div className="hidden md:block absolute top-0 left-0 w-full p-6 z-10 pointer-events-none">
        <div className="flex justify-between items-start">
           {/* Moon Button (Top Left) - Active in Dark Mode */}
           <div className="pointer-events-auto">
             <AnimatePresence>
               {theme === 'dark' && (
                  <motion.button
                    initial={{ scale: 0, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, rotate: 90, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleTheme('light')}
                    className="bg-neutral-800 text-yellow-100 p-3 rounded-full shadow-lg border border-neutral-700"
                  >
                    <Moon size={24} fill="currentColor" />
                  </motion.button>
               )}
             </AnimatePresence>
           </div>

           {/* Sun Button (Top Right) - Active in Light Mode */}
           <div className="pointer-events-auto">
             <AnimatePresence>
               {theme === 'light' && (
                  <motion.button
                    initial={{ scale: 0, rotate: 90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, rotate: -90, opacity: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleTheme('dark')}
                    className="bg-yellow-400 text-orange-600 p-3 rounded-full shadow-lg border border-orange-300"
                  >
                    <Sun size={24} fill="currentColor" />
                  </motion.button>
               )}
             </AnimatePresence>
           </div>
        </div>
      </div>

      <div className="w-full max-w-7xl z-10 relative hidden md:block">
        <div className="relative group/grid">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {items.map((item, index) => (
              <BentoItem
                key={item.id}
                item={item}
                index={index}
                isOpen={selectedId === item.id}
                isGrayedOut={!!selectedId && selectedId !== item.id}
                onOpen={handleCardClick}
                onClose={handleClose}
                theme={theme}
                layoutIdPrefix="desktop-card"
                onInitialAnimationComplete={
                  index === items.length - 1 ? handleGridReady : undefined
                }
              />
            ))}
          </div>

          <AnimatePresence onExitComplete={() => setIsExiting(false)}>
            {selectedId && (
              <ExpandedView
                item={items.find((i) => i.id === selectedId)!}
                onClose={handleClose}
                theme={theme}
                isMobile={false}
                layoutIdPrefix="desktop-card"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full max-w-7xl z-10 relative block md:hidden">
        <div className="relative group/grid">
          <div className="grid grid-cols-2 gap-4">
            {items.map((item, index) => {
              const isWideCard = index % 3 === 0;
              const mobileItem = {
                ...item,
                colSpan: isWideCard ? 'col-span-2' : 'col-span-1',
                rowSpan: 'row-span-1',
                className: `${item.className ?? ''} ${isWideCard ? 'aspect-[3/2]' : 'aspect-square'}`.trim()
              };

              return (
                <BentoItem
                  key={item.id}
                  item={mobileItem}
                  index={index}
                  isOpen={selectedId === item.id}
                  isGrayedOut={!!selectedId && selectedId !== item.id}
                  onOpen={handleCardClick}
                  onClose={handleClose}
                  theme={theme}
                  layoutIdPrefix="mobile-card"
                  onInitialAnimationComplete={
                    index === items.length - 1 ? handleGridReady : undefined
                  }
                />
              );
            })}
          </div>

          <AnimatePresence onExitComplete={() => setIsExiting(false)}>
            {selectedId && (
              <ExpandedView
                item={items.find((i) => i.id === selectedId)!}
                onClose={handleClose}
                theme={theme}
                isMobile={true}
                layoutIdPrefix="mobile-card"
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
