/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Save, 
  FileText,
  Building2,
  Sun,
  Moon,
} from 'lucide-react';
import { ReportData, SlideData } from './types.ts';
import { BG_IMAGES, INITIAL_REPORT_DATA } from './constants.ts';
import { cn } from './lib/utils.ts';

export default function App() {
  const [reportData, setReportData] = useState<ReportData>(() => {
    const saved = localStorage.getItem('yiruit-report-data');
    return saved ? JSON.parse(saved) : INITIAL_REPORT_DATA;
  });
  const [view, setView] = useState<'editor' | 'presentation'>('editor');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('yiruit-theme');
    return saved === 'dark';
  });

  useEffect(() => {
    localStorage.setItem('yiruit-report-data', JSON.stringify(reportData));
  }, [reportData]);

  useEffect(() => {
    localStorage.setItem('yiruit-theme', isDark ? 'dark' : 'light');
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const slides: SlideData[] = [
    {
      id: 'title',
      title: '成都依瑞特包装有限公司\n业务部 第 ' + (reportData.weekNumber || 'XX') + ' 周工作汇报',
      type: 'title',
      bgImage: BG_IMAGES.TITLE,
    },
    {
      id: 'agenda',
      title: '目录 / CONTENTS',
      type: 'agenda',
      bgImage: BG_IMAGES.AGENDA,
    },
    {
      id: 'completion',
      title: '01 上周工作完成情况',
      content: reportData.lastWeekCompletion,
      type: 'content',
      bgImage: BG_IMAGES.COMPLETION,
    },
    {
      id: 'plan',
      title: '02 本周工作计划',
      content: reportData.thisWeekPlan,
      type: 'content',
      bgImage: BG_IMAGES.PLAN,
    },
    {
      id: 'data',
      title: '03 上周工作数据支撑',
      content: reportData.dataSupport,
      type: 'content',
      bgImage: BG_IMAGES.DATA,
    },
    {
      id: 'problems',
      title: '04 问题',
      content: reportData.problems,
      type: 'content',
      bgImage: BG_IMAGES.PROBLEMS,
    },
    {
      id: 'others',
      title: '05 其他',
      content: reportData.others,
      type: 'content',
      bgImage: BG_IMAGES.OTHERS,
    },
    {
      id: 'end',
      title: '报告完毕',
      type: 'end',
      bgImage: BG_IMAGES.END,
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (view === 'presentation') {
        if (e.key === 'ArrowRight' || e.key === ' ') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'Escape') setView('editor');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, currentSlide]);

  return (
    <div className="min-h-screen bg-natural-bg font-sans text-natural-ink transition-colors duration-300">
      {view === 'editor' ? (
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <aside className="w-72 bg-natural-sidebar border-r border-natural-border flex flex-col p-6 overflow-y-auto transition-colors duration-300">
            <header className="flex justify-between items-center mb-10">
              <div>
                <div className="flex items-center gap-2 text-natural-olive mb-1 italic">
                  <Building2 size={24} strokeWidth={2.5} />
                  <span className="font-bold tracking-tight text-lg font-serif">依瑞特汇报系统</span>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-bold">Report Builder v1.2</p>
              </div>
              <button 
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-full hover:bg-natural-olive/10 dark:hover:bg-white/10 transition-colors text-natural-olive"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </header>

            <div className="flex-1 space-y-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-natural-olive/60 pl-2">幻灯片预览结构</p>
              {[
                { id: 'p1', name: '封面页', slide: 0 },
                { id: 'p2', name: '目录索引', slide: 1 },
                { id: 'p3', name: '完成情况', slide: 2 },
                { id: 'p4', name: '工作计划', slide: 3 },
                { id: 'p5', name: '数据支撑', slide: 4 },
                { id: 'p6', name: '问题反馈', slide: 5 },
                { id: 'p7', name: '其他内容', slide: 6 },
                { id: 'p8', name: '结束语', slide: 7 },
              ].map((item) => (
                <div 
                  key={item.id} 
                  className={cn(
                    "p-3 rounded-xl flex items-center gap-3 border transition-all cursor-default",
                    currentSlide === item.slide 
                      ? "bg-natural-olive text-white border-natural-olive shadow-md" 
                      : "bg-white/50 dark:bg-white/5 text-natural-ink/70 border-natural-border hover:bg-white dark:hover:bg-white/10"
                  )}
                >
                  <div className={cn(
                    "w-12 h-8 rounded flex items-center justify-center text-[10px] font-bold",
                    currentSlide === item.slide ? "bg-natural-olive-light" : "bg-natural-bg border border-natural-border"
                  )}>
                    {item.id.toUpperCase()}
                  </div>
                  <span className="text-xs font-medium">{item.name}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-5 bg-natural-border/30 dark:bg-white/5 rounded-2xl border border-natural-border/50 dark:border-white/10">
              <p className="text-[11px] text-natural-olive font-bold mb-2 flex items-center gap-2">
                 <Save size={14} />
                 实时保存中
              </p>
              <p className="text-[10px] leading-relaxed opacity-70 italic">每一步修改都会自动同步到您的本地浏览器，请放心填写。</p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col p-10 overflow-y-auto bg-natural-bg relative transition-colors duration-300">
            <header className="flex justify-between items-center mb-10">
              <div className="space-y-1">
                <h1 className="text-4xl font-serif font-bold text-natural-olive italic">周报内容编辑</h1>
                <p className="text-sm opacity-60">请在左侧表单中输入本周的核心业务指标与计划。</p>
              </div>
              <button 
                onClick={() => {
                  setCurrentSlide(0);
                  setView('presentation');
                }}
                className="flex items-center gap-3 px-8 py-3.5 bg-natural-olive hover:bg-natural-olive-light text-white rounded-full font-bold transition-all shadow-xl shadow-natural-olive/20 active:scale-95 border-b-4 border-natural-olive-light"
              >
                <Play size={18} fill="currentColor" />
                立即演示报告
              </button>
            </header>

            <div className="grid grid-cols-1 gap-8 max-w-4xl">
              <section className="bg-white dark:bg-natural-sidebar/50 p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-natural-border transition-colors duration-300">
                <h2 className="text-lg font-bold mb-6 flex items-center gap-3 text-natural-olive">
                  <span className="w-8 h-8 rounded-full bg-natural-olive/10 dark:bg-white/5 flex items-center justify-center text-sm italic">00</span>
                  基础信息
                </h2>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 ml-1">第几周汇报？</label>
                  <input 
                    type="text" 
                    placeholder="例如：第 17 周"
                    value={reportData.weekNumber}
                    onChange={e => setData('weekNumber', e.target.value)}
                    className="w-full px-5 py-4 rounded-2xl bg-natural-bg/50 border border-natural-border focus:outline-none focus:ring-4 focus:ring-natural-olive/5 dark:focus:ring-white/5 focus:border-natural-olive transition-all text-xl font-serif italic"
                  />
                </div>
              </section>

              <section className="bg-white dark:bg-natural-sidebar/50 p-8 rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-natural-border grid gap-10 transition-colors duration-300">
                <h2 className="text-lg font-bold mb-2 flex items-center gap-3 text-natural-olive">
                  <span className="w-8 h-8 rounded-full bg-natural-olive/10 dark:bg-white/5 flex items-center justify-center text-sm italic">01</span>
                  具体汇报内容
                </h2>
                
                <div className="space-y-8">
                  <FormField 
                    label="01 上周工作完成情况" 
                    value={reportData.lastWeekCompletion} 
                    onChange={v => setData('lastWeekCompletion', v)}
                    placeholder="请输入上周工作的具体进展..."
                  />
                  
                  <FormField 
                    label="02 本周工作计划" 
                    value={reportData.thisWeekPlan} 
                    onChange={v => setData('thisWeekPlan', v)}
                    placeholder="请输入本周的工作重点..."
                  />
                  
                  <FormField 
                    label="03 上周工作数据支撑" 
                    value={reportData.dataSupport} 
                    onChange={v => setData('dataSupport', v)}
                    placeholder="请输入相关的数据指标..."
                  />
                  
                  <FormField 
                    label="04 问题" 
                    value={reportData.problems} 
                    onChange={v => setData('problems', v)}
                    placeholder="请输入遇到的问题..."
                  />
                  
                  <FormField 
                    label="05 其他" 
                    value={reportData.others} 
                    onChange={v => setData('others', v)}
                    placeholder="补充更多详情..."
                  />
                </div>
              </section>
            </div>
            
            <footer className="mt-12 py-8 border-t border-natural-border/40 dark:border-[#3a3a30] flex justify-between items-center text-slate-400 dark:text-slate-500 text-[11px] font-medium tracking-wide">
              <div className="flex items-center gap-4">
                 <span>© 2026 YIRUITE PACKAGING</span>
                 <span className="opacity-40">|</span>
                 <span>SALES DEPT</span>
              </div>
              <p className="italic opacity-60">专属定制：祝妈妈每天工作都有好心情 ✨</p>
            </footer>
          </main>
        </div>
      ) : (
        <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden select-none">
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              <Slide 
                key={currentSlide}
                data={slides[currentSlide]}
                reportData={reportData}
                slides={slides}
              />
            </AnimatePresence>
          </div>

          <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
             <button 
              onClick={() => setView('editor')}
              className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all active:scale-95"
              title="退出预览 (Esc)"
            >
              <X size={24} />
            </button>
          </div>

          <div className="absolute bottom-10 left-0 right-0 z-50 flex justify-center items-center gap-8 pointer-events-none">
            <button 
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className={cn(
                "p-4 rounded-full backdrop-blur-md transition-all pointer-events-auto active:scale-90",
                currentSlide === 0 ? "bg-white/5 text-white/20" : "bg-white/10 text-white hover:bg-white/20"
              )}
            >
              <ChevronLeft size={32} />
            </button>
            
            <div className="bg-black/30 backdrop-blur-md px-6 py-2 rounded-full text-white/70 font-mono text-sm pointer-events-auto border border-white/10">
              {currentSlide + 1} / {slides.length}
            </div>

            <button 
              onClick={handleNext}
              disabled={currentSlide === slides.length - 1}
              className={cn(
                "p-4 rounded-full backdrop-blur-md transition-all pointer-events-auto active:scale-90",
                currentSlide === slides.length - 1 ? "bg-white/5 text-white/20" : "bg-white/10 text-white hover:bg-white/20 shadow-xl shadow-blue-500/20"
              )}
            >
              <ChevronRight size={32} />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  function setData(key: keyof ReportData, value: string) {
    setReportData(prev => ({ ...prev, [key]: value }));
  }
}

function FormField({ label, value, onChange, placeholder }: { label: string, value: string, onChange: (v: string) => void, placeholder: string }) {
  return (
    <div className="space-y-4">
      <label className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block ml-1">{label}</label>
      <textarea 
        rows={4}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-5 py-4 rounded-2xl bg-natural-bg/50 dark:bg-[#1a1a15]/50 border border-natural-border dark:border-[#3a3a30] focus:outline-none focus:ring-4 focus:ring-natural-olive/5 dark:focus:ring-white/5 focus:border-natural-olive dark:focus:border-[#5A5A40] transition-all resize-none shadow-inner dark:text-[#e0e0d0] dark:placeholder-slate-700"
      />
    </div>
  );
}

const Slide: React.FC<{ data: SlideData, reportData: ReportData, slides: SlideData[] }> = ({ data, reportData, slides }) => {
  const contentLines = data.content?.split('\n').filter(l => l.trim() !== '') || [];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="absolute inset-0 flex flex-col items-center justify-center text-natural-ink dark:text-[#d1d1c7] overflow-hidden"
    >
      {/* Background Image with Enhanced Visibility */}
      <div 
        className="absolute inset-0 bg-slate-900 overflow-hidden z-0"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[20s] ease-linear"
          style={{ 
            backgroundImage: `url("${data.bgImage}")`,
            animation: 'kenburns 40s linear infinite alternate'
          }}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 transition-colors duration-300 z-10" />
        <div className="absolute inset-0 bg-natural-bg/10 dark:bg-black/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-10" />
      </div>

      {/* Content with Text Shadows for Readability */}
      <div className="relative z-20 w-full max-w-6xl px-12 py-16 text-white">
        {data.type === 'title' && (
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="w-24 h-1 bg-white mb-12 shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
            <h3 className="text-3xl font-serif italic text-white/90 tracking-wide mb-6 drop-shadow-lg">
              成都依瑞特包装有限公司
            </h3>
            <h1 className="text-7xl md:text-9xl font-bold leading-tight tracking-tighter text-white text-center drop-shadow-[0_10px_25px_rgba(0,0,0,0.5)]">
              业务部 工作汇报
            </h1>
            
            <div className="flex items-center justify-center gap-6 mt-16 bg-white/20 backdrop-blur-md py-5 px-12 rounded-full border border-white/30 shadow-2xl transition-colors">
               <span className="opacity-70 text-xl font-serif italic">第</span>
               <span className="text-4xl font-serif font-black text-white border-b-4 border-white px-4">{reportData.weekNumber || 'XX'}</span>
               <span className="opacity-70 text-xl font-serif italic">周</span>
            </div>
          </motion.div>
        )}

        {data.type === 'agenda' && (
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <motion.div
               initial={{ x: -40, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="space-y-4"
            >
              <div className="w-16 h-1 bg-white mb-4 shadow-lg" />
              <h2 className="text-8xl font-bold uppercase text-white tracking-tighter font-serif drop-shadow-2xl">目录</h2>
              <p className="text-xl tracking-[0.4em] opacity-80 uppercase font-sans font-bold text-white drop-shadow-md">Contents Index</p>
            </motion.div>
            <div className="space-y-6">
              {[
                '01 上周工作完成情况',
                '02 本周工作计划',
                '03 上周工作数据支撑',
                '04 问题反馈',
                '05 其他内容'
              ].map((item, i) => (
                <motion.div 
                  key={item}
                  initial={{ x: 40, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-8 group"
                >
                  <span className="text-3xl font-serif italic text-white/60 font-bold w-12 border-b-2 border-white/30">
                    {i + 1}
                  </span>
                  <span className="text-3xl font-bold tracking-tight text-white drop-shadow-lg group-hover:translate-x-2 transition-transform duration-300">
                    {item.substring(3)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {data.type === 'content' && (
          <div className="max-w-4xl">
            <motion.div
               initial={{ x: -30, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="mb-14"
            >
              <h2 className="text-6xl font-bold text-white tracking-tighter font-serif italic mb-6 drop-shadow-2xl">
                 {data.title.substring(3)}
              </h2>
              <div className="h-1.5 w-32 bg-white rounded-full shadow-lg" />
            </motion.div>
            
            <div className="space-y-10 pl-8 border-l-4 border-white/20">
              {contentLines.length > 0 ? (
                contentLines.map((line, i) => (
                  <motion.div 
                    key={i}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-6"
                  >
                    <div className="mt-3.5 w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)] flex-shrink-0" />
                    <p className="text-3xl md:text-5xl leading-snug font-serif text-white italic drop-shadow-xl font-medium">
                      {line}
                    </p>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="italic text-white/40 text-3xl font-serif"
                >
                  暂无具体内容填写...
                </motion.div>
              )}
            </div>
          </div>
        )}

        {data.type === 'end' && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1.2, type: "spring" }}
            className="text-center"
          >
            <h1 className="text-9xl font-bold tracking-tighter text-white font-serif italic mb-12 drop-shadow-2xl">
              汇报完毕
            </h1>
            <div className="w-24 h-1 bg-white mx-auto mb-12 shadow-lg" />
            
            <div className="grid grid-cols-2 max-w-2xl mx-auto gap-20 text-left pt-12 border-t border-white/20 text-white/80 text-sm italic font-serif drop-shadow-md">
               <div>
                  <p className="font-bold text-white not-italic uppercase tracking-widest text-[10px] mb-2 font-sans">Location</p>
                  <p>成都依瑞特包装有限公司</p>
                  <p>业务部 汇报中心</p>
               </div>
               <div className="text-right">
                  <p className="font-bold text-white not-italic uppercase tracking-widest text-[10px] mb-2 font-sans">Social</p>
                  <p>Yiruite Packaging Co., Ltd.</p>
                  <p>Weekly Sales Report</p>
               </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation Helper for Slideshow */}
      {data.type !== 'title' && data.type !== 'end' && (
        <div className="absolute top-10 right-10 text-[xs] font-bold uppercase tracking-[0.3em] text-white/60 flex items-center gap-4 drop-shadow-md">
           <span>Page {slides.findIndex(s => s.id === data.id) + 1}</span>
           <div className="w-12 h-px bg-white/40" />
           <span>Weekly {reportData.weekNumber || 'XX'}</span>
        </div>
      )}
    </motion.div>
  );
};
