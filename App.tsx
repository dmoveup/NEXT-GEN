
import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion, useScroll, useTransform, useInView, useMotionValue, AnimatePresence } from 'framer-motion';
import Lottie from 'react-lottie-player';

//================================================================================
// 0. MOCK LOTTIE ANIMATION DATA
//================================================================================
const aiBrainLottie = "https://assets4.lottiefiles.com/packages/lf20_S18zHeoSG5.json";


//================================================================================
// 1. TYPE DEFINITIONS & MOCK DATA
//================================================================================
type SectionId = 'hero' | 'ai-videos' | 'photography' | 'branding' | 'websites' | 'about' | 'contact';

// src/data/mockData.ts
const MOCK_DATA = {
  aiVideos: [
    { id: 'dQw4w9WgXcQ', title: "AI Predictive Analytics", type: 'Predictive', thumbnail: 'https://picsum.photos/seed/v1/400/300' },
    { id: '3tmd-ClpJxA', title: "Generative Ad Campaign", type: 'Generative', thumbnail: 'https://picsum.photos/seed/v2/400/300' },
    { id: 'NlsrJbVLi_A', title: "Client Success Story", type: 'Client Work', thumbnail: 'https://picsum.photos/seed/v3/400/300' },
  ],
  photos: [
    { id: 1, src: `https://picsum.photos/seed/p1/600/800`, title: 'Neon Dreams', category: 'Events' },
    { id: 2, src: `https://picsum.photos/seed/p2/600/400`, title: 'Forest Whisper', category: 'Nature' },
    { id: 3, src: `https://picsum.photos/seed/p3/600/600`, title: 'Aroma', category: 'Products' },
    { id: 4, src: `https://picsum.photos/seed/p4/600/700`, title: 'The CEO', category: 'People' },
    { id: 5, src: `https://picsum.photos/seed/p5/600/500`, title: 'Urban Jungle', category: 'Nature' },
    { id: 6, src: `https://picsum.photos/seed/p6/600/900`, title: 'Conference', category: 'Events' },
  ],
  brands: [
    { id: 1, name: "Stellar Solutions", logoUrl: "✨", colors: ['#4F46E5', '#EC4899', '#F59E0B'], typography: 'Orbitron', tagline: 'Reach for the stars.', industry: 'Tech' },
    { id: 2, name: "Apex Industries", logoUrl: "🏔️", colors: ['#1F2937', '#6B7280', '#F9FAFB'], typography: 'Inter', tagline: 'Peak Performance.', industry: 'Manufacturing' },
    { id: 3, name: "Synergy Co", logoUrl: "🤝", colors: ['#10B981', '#3B82F6', '#FBBF24'], typography: 'Poppins', tagline: 'Stronger Together.', industry: 'Consulting' },
  ],
  websites: [
    { id: 1, name: "QuantumLeap", screenshotUrl: "https://picsum.photos/seed/w1/600/400", stack: ['React', 'Node.js', 'Vercel'], client: 'QuantumLeap Inc.', url: '#' },
    { id: 2, name: "EcoFoods", screenshotUrl: "https://picsum.photos/seed/w2/600/400", stack: ['Shopify', 'Liquid', 'GraphQL'], client: 'EcoFoods Marketplace', url: '#' },
    { id: 3, name: "Artisan Collective", screenshotUrl: "https://picsum.photos/seed/w3/600/400", stack: ['Webflow', 'Figma', 'Lottie'], client: 'The Artisan Collective', url: '#' },
  ]
};

//================================================================================
// 2. SVG ICON COMPONENTS
//================================================================================
// src/components/icons.tsx
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const VideoIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>;
const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>;
const LayersIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>;
const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const MailIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24"><path fill="currentColor" d="M16.6,14.2l-1.5-0.8c-0.4-0.2-0.7-0.1-1,0.2l-0.6,0.7c-1.3-0.7-2.5-1.9-3.2-3.2l0.7-0.6c0.3-0.3,0.4-0.6,0.2-1l-0.8-1.5c-0.2-0.4-0.6-0.5-1-0.3l-1.4,0.6c-0.4,0.2-0.7,0.6-0.7,1.1c0,2.9,2.4,5.3,5.3,5.3c0.5,0,0.9-0.3,1.1-0.7L16.9,15.2C17.1,14.8,17,14.4,16.6,14.2z M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10c5.5,0,10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,12,20z"/></svg>;
const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const LogoIcon = () => <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-purple">DMU</div>;

//================================================================================
// 3. LAYOUT & NAVIGATION COMPONENTS
//================================================================================

// src/components/SectionWrapper.tsx
const SectionWrapper = React.forwardRef<HTMLElement, { children: React.ReactNode, id: SectionId }>(({ children, id }, ref) => (
    <section ref={ref} id={id} className="h-screen w-full flex flex-col justify-center items-center p-4 md:p-8 relative scroll-section">
        {children}
    </section>
));

// src/components/NavbarTop.tsx
const NavbarTop = () => (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="container mx-auto flex justify-between items-center bg-black/30 backdrop-blur-lg p-3 rounded-2xl border border-white/10">
            <a href="#hero" className="flex items-center gap-3">
                <LogoIcon />
                <span className="font-bold text-lg hidden sm:block">Digital Move Up</span>
            </a>
            <a href="#contact" className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-brand-cyan to-brand-purple text-black rounded-lg transition-transform hover:scale-105">
                Start a Project
            </a>
        </div>
    </header>
);

// src/components/NavbarBottom.tsx
const Dock = ({ activeSection }: { activeSection: SectionId }) => {
    const mouseX = useMotionValue(Infinity);
    const navItems: { id: SectionId, label: string, icon: React.ComponentType<any> }[] = [
        { id: 'hero', label: 'Home', icon: HomeIcon },
        { id: 'ai-videos', label: 'AI Videos', icon: VideoIcon },
        { id: 'photography', label: 'Photos', icon: CameraIcon },
        { id: 'branding', label: 'Branding', icon: LayersIcon },
        { id: 'websites', label: 'Websites', icon: GlobeIcon },
        { id: 'about', label: 'About', icon: UsersIcon },
        { id: 'contact', label: 'Contact', icon: MailIcon },
    ];

    return (
        <nav 
            onMouseMove={(e) => mouseX.set(e.nativeEvent.x)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex h-16 items-end gap-2 rounded-2xl bg-black/30 backdrop-blur-lg px-4 pb-3 border border-white/10"
        >
            {navItems.map(({ id, label, icon: Icon }) => {
                const ref = useRef<HTMLAnchorElement>(null);
                const distance = useTransform(mouseX, (val) => {
                    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
                    return val - bounds.x - bounds.width / 2;
                });
                const scale = useTransform(distance, [-150, 0, 150], [1, 1.5, 1], { clamp: true });

                return (
                    <a href={`#${id}`} key={id} ref={ref} className="group relative">
                        <motion.div
                            style={{ scale }}
                            className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 ${activeSection === id ? 'bg-brand-cyan text-black' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                            <Icon className="w-5 h-5" />
                        </motion.div>
                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block px-2 py-1 text-xs bg-black/80 rounded-md whitespace-nowrap">
                            {label}
                        </div>
                    </a>
                );
            })}
        </nav>
    );
};

// src/components/FloatingButtons.tsx
const FloatingButtons = () => (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-3">
        <a href="https://wa.me/yourphonenumber" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
            <WhatsAppIcon className="w-7 h-7" />
        </a>
    </div>
);

//================================================================================
// 4. SECTION COMPONENTS
//================================================================================

// src/components/Hero.tsx
const HeroSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="hero">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{ backgroundImage: `url('https://picsum.photos/seed/bg/1920/1080')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/80 to-transparent" />
        <div className="relative text-center z-10">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="text-4xl md:text-7xl font-bold mb-4"
            >
                <span className="text-gray-300">Move Up. Market Smarter. </span><br className="md:hidden" />
                <span className="bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent animate-text-gradient bg-[200%_auto]">
                    Scale Faster.
                </span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8"
            >
                AI-powered marketing agency with a creative soul.
            </motion.p>
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center items-center gap-4"
            >
                <a href="#contact" className="px-6 py-3 font-bold bg-white text-black rounded-lg transition-transform hover:scale-105">Start a Project</a>
                <a href="#ai-videos" className="px-6 py-3 font-bold text-white bg-white/10 border border-white/20 rounded-lg transition-colors hover:bg-white/20">View Portfolio ↓</a>
            </motion.div>
        </div>
    </SectionWrapper>
));

// src/components/Title.tsx
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl md:text-5xl font-bold text-center mb-4 md:mb-12 absolute top-20 md:top-24 left-1/2 -translate-x-1/2">
        {children}
    </h2>
);

// src/components/AiVideos.tsx
const AiVideosSection = React.forwardRef<HTMLElement, {}>((props, ref) => {
    const [filter, setFilter] = useState('All');
    const filteredVideos = filter === 'All' ? MOCK_DATA.aiVideos : MOCK_DATA.aiVideos.filter(v => v.type === filter);
    return (
        <SectionWrapper ref={ref} id="ai-videos">
            <SectionTitle>AI <span className="text-brand-cyan">Video</span> Projects</SectionTitle>
            <div className="flex justify-center gap-2 md:gap-4 mb-8">
                {['All', 'Predictive', 'Generative', 'Client Work'].map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 text-sm rounded-lg border transition-colors ${filter === f ? 'bg-brand-cyan text-black border-brand-cyan' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}>
                        {f}
                    </button>
                ))}
            </div>
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <AnimatePresence>
                {filteredVideos.map(video => (
                    <motion.div 
                        layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                        key={video.id} className="bg-white/5 p-3 rounded-xl border border-white/10 group cursor-pointer"
                    >
                        <div className="aspect-video rounded-lg overflow-hidden mb-3 relative">
                            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover"/>
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <VideoIcon className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        <h3 className="font-bold">{video.title}</h3>
                        <p className="text-sm text-gray-400">{video.type}</p>
                    </motion.div>
                ))}
                </AnimatePresence>
            </motion.div>
        </SectionWrapper>
    );
});

// src/components/Photography.tsx
const PhotographySection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="photography">
        <SectionTitle>Captivating <span className="text-brand-purple">Photography</span></SectionTitle>
        <div className="h-[70vh] w-full max-w-6xl px-4 overflow-y-auto">
            <div className="columns-2 sm:columns-3 md:columns-4 gap-4">
                {MOCK_DATA.photos.map(photo => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }}
                        key={photo.id} className="mb-4 break-inside-avoid group relative overflow-hidden rounded-lg"
                    >
                        <img src={photo.src} alt={photo.title} className="w-full h-auto rounded-lg" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <h3 className="text-white font-bold">{photo.title}</h3>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </SectionWrapper>
));

// src/components/Branding.tsx
const BrandingSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="branding">
        <SectionTitle>Branding that <span className="text-brand-cyan">Resonates</span></SectionTitle>
        <div className="w-full max-w-7xl flex items-center gap-8 overflow-x-auto snap-x snap-mandatory py-8 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {MOCK_DATA.brands.map(brand => (
                <div key={brand.id} className="snap-center flex-shrink-0 w-[90vw] md:w-[400px] h-[500px] bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col justify-between backdrop-blur-sm">
                    <div>
                        <div className="text-6xl mb-4">{brand.logoUrl}</div>
                        <h3 className="text-3xl font-bold mb-1">{brand.name}</h3>
                        <p className="text-gray-400 italic mb-6">"{brand.tagline}"</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-400 mb-2">Color Palette:</p>
                        <div className="flex gap-2 mb-6">
                            {brand.colors.map(color => <div key={color} style={{ backgroundColor: color }} className="w-8 h-8 rounded-full border-2 border-white/20" />)}
                        </div>
                        <p className="text-sm text-gray-400">Typography: <span className="font-bold text-white">{brand.typography}</span></p>
                        <p className="text-sm text-gray-400">Industry: <span className="font-bold text-white">{brand.industry}</span></p>
                    </div>
                </div>
            ))}
        </div>
    </SectionWrapper>
));


// src/components/Websites.tsx
const WebsitesSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="websites">
        <SectionTitle>Websites that <span className="text-brand-purple">Perform</span></SectionTitle>
        <div className="w-full flex items-center">
            <div className="w-full flex items-center gap-8 overflow-x-auto snap-x snap-mandatory py-8 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {MOCK_DATA.websites.map(site => (
                    <a href={site.url} target="_blank" rel="noopener noreferrer" key={site.id} className="snap-center group flex-shrink-0 w-[90vw] md:w-[600px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm hover:border-brand-purple/50 transition-colors">
                        <div className="p-6">
                            <h3 className="text-2xl font-bold mb-1">{site.name}</h3>
                            <p className="text-gray-400 mb-4">for {site.client}</p>
                            <div className="flex gap-2 mb-4">
                                {site.stack.map(tech => <span key={tech} className="text-xs bg-white/10 px-2 py-1 rounded-full">{tech}</span>)}
                            </div>
                            <img src={site.screenshotUrl} alt={site.name} className="w-full aspect-video object-cover rounded-lg mb-4 border border-white/10" />
                             <div className="flex items-center gap-2 text-brand-purple font-bold group-hover:underline">
                                Visit Site <ArrowRightIcon className="w-4 h-4"/>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    </SectionWrapper>
));

// src/components/About.tsx
const AboutSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="about">
        <SectionTitle>Behind the <span className="text-brand-cyan">Screens</span></SectionTitle>
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl items-center">
            <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-300 mb-6">We merge creative passion with AI-driven precision to help brands navigate the digital landscape and achieve exponential growth.</p>
                <h4 className="font-bold text-xl mb-3">Core Technologies:</h4>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {['Generative AI', 'Meta Ads API', 'Google Analytics 4', 'Framer Motion', 'Next.js'].map(tech => (
                         <span key={tech} className="text-sm bg-white/10 px-3 py-1 rounded-full">{tech}</span>
                    ))}
                </div>
            </div>
            <div className="flex flex-col items-center">
                 <Lottie
                    loop
                    path={aiBrainLottie}
                    play
                    style={{ width: '100%', maxWidth: 300, height: 'auto' }}
                />
                <p className="text-gray-400 mt-2 text-center">Powered by Imed, our AI core.</p>
            </div>
        </div>
    </SectionWrapper>
));

// src/components/Contact.tsx
const ContactSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="contact">
        <SectionTitle>Let's <span className="text-brand-purple">Build</span> Together</SectionTitle>
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <form className="space-y-4">
                <input type="text" placeholder="Your Name" className="w-full bg-white/5 p-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                <input type="email" placeholder="Your Email" className="w-full bg-white/5 p-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                <textarea placeholder="Your Message" rows={4} className="w-full bg-white/5 p-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-purple"></textarea>
                <button type="submit" className="w-full p-3 font-bold bg-gradient-to-r from-brand-cyan to-brand-purple text-black rounded-lg transition-transform hover:scale-105">Send Message</button>
            </form>
            <div className="text-center my-4 text-gray-400">OR</div>
            <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer" className="block w-full text-center p-3 font-bold bg-white/10 border border-white/20 text-white rounded-lg transition-colors hover:bg-white/20">
                Book a Call on Calendly
            </a>
        </div>
    </SectionWrapper>
));

//================================================================================
// 5. MAIN APP COMPONENT
//================================================================================
// src/App.tsx
export default function App() {
    const [activeSection, setActiveSection] = useState<SectionId>('hero');
    
    const sectionIds: SectionId[] = ['hero', 'ai-videos', 'photography', 'branding', 'websites', 'about', 'contact'];
    
    const refs = {
        hero: useRef<HTMLElement>(null),
        'ai-videos': useRef<HTMLElement>(null),
        photography: useRef<HTMLElement>(null),
        branding: useRef<HTMLElement>(null),
        websites: useRef<HTMLElement>(null),
        about: useRef<HTMLElement>(null),
        contact: useRef<HTMLElement>(null),
    };

    const inViewMap = {
        hero: useInView(refs.hero, { amount: 0.5 }),
        'ai-videos': useInView(refs['ai-videos'], { amount: 0.5 }),
        photography: useInView(refs.photography, { amount: 0.5 }),
        branding: useInView(refs.branding, { amount: 0.5 }),
        websites: useInView(refs.websites, { amount: 0.5 }),
        about: useInView(refs.about, { amount: 0.5 }),
        contact: useInView(refs.contact, { amount: 0.5 }),
    };

    useEffect(() => {
        const visibleSections = sectionIds.filter(id => inViewMap[id]);

        if (visibleSections.length > 0) {
            // Set the active section to the last one that is visible.
            // This handles scrolling both up and down correctly.
            setActiveSection(visibleSections[visibleSections.length - 1]);
        }
    // The dependency array now correctly lists the boolean in-view states.
    // This prevents the infinite loop.
    }, [inViewMap.hero, inViewMap['ai-videos'], inViewMap.photography, inViewMap.branding, inViewMap.websites, inViewMap.about, inViewMap.contact]);


    return (
        <>
            <NavbarTop />
            <main className="scroll-container">
                <HeroSection ref={refs.hero} />
                <AiVideosSection ref={refs['ai-videos']} />
                <PhotographySection ref={refs.photography} />
                <BrandingSection ref={refs.branding} />
                <WebsitesSection ref={refs.websites} />
                <AboutSection ref={refs.about} />
                <ContactSection ref={refs.contact} />
            </main>
            <Dock activeSection={activeSection} />
            <FloatingButtons />
        </>
    );
}
