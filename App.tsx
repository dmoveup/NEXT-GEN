
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useMotionValue, AnimatePresence } from 'framer-motion';
import Lottie from 'react-lottie-player';

//================================================================================
// 0. MOCK LOTTIE ANIMATION DATA
//================================================================================
const aiBrainLottie = "https://assets4.lottiefiles.com/packages/lf20_S18zHeoSG5.json";


//================================================================================
// 1. TYPE DEFINITIONS & MOCK DATA
//================================================================================
type SectionId = 'hero' | 'services' | 'portfolio' | 'process' | 'about' | 'testimonials' | 'contact' | 'footer';
type PortfolioTab = 'websites' | 'ai-videos' | 'branding' | 'photography';


const MOCK_DATA = {
    services: [
        { title: "Sponsoring & Ads", description: "Campagnes publicitaires ciblées sur Meta, Google & TikTok pour un ROI maximal." },
        { title: "Développement Web & Mobile", description: "Sites web et applications ultra-performants, optimisés pour la conversion." },
        { title: "Optimisation SEO", description: "Améliorez votre visibilité et dominez les résultats de recherche." },
        { title: "Design & Vidéo", description: "Créations visuelles et contenus vidéo percutants qui captivent votre audience." },
        { title: "Gestion des Réseaux Sociaux", description: "Stratégies de contenu engageantes pour construire et animer votre communauté." },
        { title: "Consulting", description: "Conseils stratégiques pour aligner vos actions marketing avec vos objectifs business." },
    ],
    portfolio: {
        aiVideos: [
            { id: 'dQw4w9WgXcQ', title: "Analyse Prédictive IA", type: 'Prédictif', thumbnail: 'https://picsum.photos/seed/v1/400/300' },
            { id: '3tmd-ClpJxA', title: "Campagne Publicitaire Générative", type: 'Génératif', thumbnail: 'https://picsum.photos/seed/v2/400/300' },
            { id: 'NlsrJbVLi_A', title: "Success Story Client", type: 'Client', thumbnail: 'https://picsum.photos/seed/v3/400/300' },
        ],
        photos: [
            { id: 1, src: `https://picsum.photos/seed/p1/600/800`, title: 'Rêves de Néon', category: 'Événements' },
            { id: 2, src: `https://picsum.photos/seed/p2/600/400`, title: 'Murmure de la Forêt', category: 'Nature' },
            { id: 3, src: `https://picsum.photos/seed/p3/600/600`, title: 'Arôme', category: 'Produits' },
            { id: 4, src: `https://picsum.photos/seed/p4/600/700`, title: 'Le PDG', category: 'Personnes' },
        ],
        brands: [
            { id: 1, name: "Stellar Solutions", logoUrl: "✨", tagline: 'Visez les étoiles.', industry: 'Tech' },
            { id: 2, name: "Apex Industries", logoUrl: "🏔️", tagline: 'La performance au sommet.', industry: 'Industrie' },
            { id: 3, name: "Synergy Co", logoUrl: "🤝", tagline: 'Plus forts ensemble.', industry: 'Conseil' },
        ],
        websites: [
            { id: 1, name: "QuantumLeap", screenshotUrl: "https://picsum.photos/seed/w1/600/400", stack: ['React', 'Node.js', 'Vercel'], client: 'QuantumLeap Inc.', url: '#' },
            { id: 2, name: "EcoFoods", screenshotUrl: "https://picsum.photos/seed/w2/600/400", stack: ['Shopify', 'Liquid', 'GraphQL'], client: 'EcoFoods Marketplace', url: '#' },
            { id: 3, name: "Artisan Collective", screenshotUrl: "https://picsum.photos/seed/w3/600/400", stack: ['Webflow', 'Figma', 'Lottie'], client: 'The Artisan Collective', url: '#' },
        ]
    },
    processSteps: [
        { number: 1, title: 'Découverte & Stratégie', description: "Nous analysons vos besoins et définissons des objectifs clairs et mesurables." },
        { number: 2, title: 'Création & Développement', description: "Nos experts conçoivent et développent des solutions créatives et techniques sur mesure." },
        { number: 3, title: 'Déploiement & Lancement', description: "Nous orchestrons le lancement de vos projets avec précision pour un impact maximal." },
        { number: 4, title: 'Analyse & Optimisation', description: "Nous suivons les KPIs et optimisons en continu pour garantir des performances durables." },
    ],
    testimonials: [
        { quote: "Une transformation digitale incroyable. Notre ROI a augmenté de 200% en 6 mois.", author: "Alice Martin", company: "Stellar Solutions", logo: "✨" },
        { quote: "L'équipe de Digital Move Up est réactive, créative et incroyablement efficace.", author: "Julien Dubois", company: "Apex Industries", logo: "🏔️" },
        { quote: "Leur approche basée sur la data a complètement changé notre stratégie marketing.", author: "Chloé Lambert", company: "Synergy Co", logo: "🤝" },
    ]
};

//================================================================================
// 2. SVG ICON COMPONENTS
//================================================================================
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const VideoIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" /></svg>;
const CameraIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>;
const LayersIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>;
const GlobeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>;
const UsersIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const MailIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24"><path fill="currentColor" d="M16.6,14.2l-1.5-0.8c-0.4-0.2-0.7-0.1-1,0.2l-0.6,0.7c-1.3-0.7-2.5-1.9-3.2-3.2l0.7-0.6c0.3-0.3,0.4-0.6,0.2-1l-0.8-1.5c-0.2-0.4-0.6-0.5-1-0.3l-1.4,0.6c-0.4,0.2-0.7,0.6-0.7,1.1c0,2.9,2.4,5.3,5.3,5.3c0.5,0,0.9-0.3,1.1-0.7L16.9,15.2C17.1,14.8,17,14.4,16.6,14.2z M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10c5.5,0,10-4.5,10-10S17.5,2,12,2z M12,20c-4.4,0-8-3.6-8-8s3.6-8,8-8s8,3.6,8,8S16.4,20,12,20z"/></svg>;
const ArrowRightIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const TrendingUpIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>;
const MessageSquareIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>;
const LogoIcon = () => <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-cyan to-brand-purple">DMU</div>;

//================================================================================
// 3. LAYOUT & NAVIGATION COMPONENTS
//================================================================================
const SectionWrapper = React.forwardRef<HTMLElement, { children: React.ReactNode, id: SectionId, withTitle?: boolean }>(({ children, id, withTitle = false }, ref) => (
    <section ref={ref} id={id} className={`h-screen w-full flex flex-col justify-center items-center p-4 md:p-8 ${withTitle ? 'pt-28 md:pt-36' : ''} pb-24 relative scroll-section`}>
        {children}
    </section>
));

const handleHashLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href') || '';
    if (href.startsWith('#')) {
        e.preventDefault();
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
};

const NavbarTop = () => (
    <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="container mx-auto flex justify-between items-center bg-black/30 backdrop-blur-lg p-3 rounded-2xl border border-white/10">
            <a href="#hero" onClick={handleHashLinkClick} className="flex items-center gap-3">
                <LogoIcon />
                <span className="font-bold text-lg hidden sm:block">Digital Move Up</span>
            </a>
            <a href="#contact" onClick={handleHashLinkClick} className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-brand-cyan to-brand-purple text-black rounded-lg transition-transform hover:scale-105">
                Parler à un expert
            </a>
        </div>
    </header>
);

const Dock = ({ activeSection }: { activeSection: SectionId }) => {
    const mouseX = useMotionValue(Infinity);
    const navItems: { id: SectionId, label: string, icon: React.ComponentType<any> }[] = [
        { id: 'hero', label: 'Accueil', icon: HomeIcon }, // 🏠 Home → Hero
        { id: 'services', label: 'Services', icon: LayersIcon }, // 📑 Services → Nos Services
        { id: 'process', label: 'Méthodologie', icon: TrendingUpIcon }, // 📈 Process → Notre Méthodologie
        { id: 'portfolio', label: 'Travaux', icon: CameraIcon }, // 🖼️ Portfolio → Voir nos travaux
        { id: 'about', label: 'À Propos', icon: UsersIcon }, // 👥 About → Team
        { id: 'contact', label: 'Contact', icon: MessageSquareIcon }, // 💬 Chat/Contact → Contactez-nous
        { id: 'footer', label: 'Email', icon: MailIcon }, // ✉️ Mail → Footer/Contact form
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
                    <a href={`#${id}`} onClick={handleHashLinkClick} key={id} ref={ref} className="group relative">
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

const FloatingButtons = () => (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col gap-3">
        <a href="https://wa.me/yourphonenumber" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform">
            <WhatsAppIcon className="w-7 h-7" />
        </a>
    </div>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-3xl md:text-5xl font-bold text-center mb-6 md:mb-12 absolute top-16 md:top-24 left-1/2 -translate-x-1/2 w-full px-4">
        {children}
    </h2>
);


//================================================================================
// 4. SECTION COMPONENTS
//================================================================================

// 4.1. Hero Section
const HeroSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="hero">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{ backgroundImage: `url('https://picsum.photos/seed/bg/1920/1080')` }} />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/80 to-transparent" />
        <div className="relative text-center z-10">
            <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="text-4xl md:text-7xl font-bold mb-4"
            >
                <span className="text-gray-300">Votre marketing. </span><br className="md:hidden" />
                <span className="bg-gradient-to-r from-brand-cyan to-brand-purple bg-clip-text text-transparent animate-text-gradient bg-[200%_auto]">
                    Plus intelligent.
                </span>
            </motion.h1>
            <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-8"
            >
                Nous fusionnons la créativité avec la précision de l'IA pour booster votre croissance.
            </motion.p>
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                className="flex justify-center items-center gap-4"
            >
                <a href="#contact" onClick={handleHashLinkClick} className="px-6 py-3 font-bold bg-white text-black rounded-lg transition-transform hover:scale-105">Parler à un expert</a>
                <a href="#portfolio" onClick={handleHashLinkClick} className="px-6 py-3 font-bold text-white bg-white/10 border border-white/20 rounded-lg transition-colors hover:bg-white/20">Voir nos travaux ↓</a>
            </motion.div>
        </div>
    </SectionWrapper>
));

// 4.2. Services Section
const ServicesSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="services" withTitle>
        <SectionTitle>Nos <span className="text-brand-cyan">Services</span></SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
            {MOCK_DATA.services.map((service, index) => (
                <motion.div
                    key={service.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-brand-cyan/50 transition-colors"
                >
                    <h3 className="font-bold text-xl mb-2 text-brand-cyan">{service.title}</h3>
                    <p className="text-gray-400">{service.description}</p>
                </motion.div>
            ))}
        </div>
    </SectionWrapper>
));

// 4.3. Portfolio Section
const PortfolioSection = React.forwardRef<HTMLElement, {}>((props, ref) => {
    const [activeTab, setActiveTab] = useState<PortfolioTab>('websites');
    const tabs: {id: PortfolioTab, label: string, icon: React.ComponentType<any>}[] = [
        { id: 'websites', label: 'Sites Web', icon: GlobeIcon },
        { id: 'ai-videos', label: 'Vidéos IA', icon: VideoIcon },
        { id: 'branding', label: 'Branding', icon: LayersIcon },
        { id: 'photography', label: 'Photo', icon: CameraIcon },
    ];

    return (
        <SectionWrapper ref={ref} id="portfolio" withTitle>
            <SectionTitle>Voir nos <span className="text-brand-purple">travaux</span></SectionTitle>
            <div className="w-full max-w-7xl h-[80vh] flex flex-col">
                <div className="flex justify-center gap-2 md:gap-4 mb-8">
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 text-sm rounded-lg border transition-colors flex items-center gap-2 ${activeTab === tab.id ? 'bg-brand-purple text-black border-brand-purple' : 'border-white/20 bg-white/5 hover:bg-white/10'}`}>
                            <tab.icon className="w-4 h-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    ))}
                </div>
                <div className="flex-grow relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {activeTab === 'websites' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {MOCK_DATA.portfolio.websites.map(site => (
                                        <a href={site.url} target="_blank" rel="noopener noreferrer" key={site.id} className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-brand-purple/50 transition-colors p-4">
                                            <img src={site.screenshotUrl} alt={site.name} className="w-full aspect-video object-cover rounded-md mb-4 border border-white/10" />
                                            <h3 className="text-xl font-bold">{site.name}</h3>
                                            <p className="text-gray-400 text-sm mb-2">{site.client}</p>
                                            <div className="flex items-center gap-2 text-brand-purple font-bold group-hover:underline text-sm">
                                                Visiter le Site <ArrowRightIcon className="w-4 h-4" />
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            )}
                             {activeTab === 'ai-videos' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {MOCK_DATA.portfolio.aiVideos.map(video => (
                                        <div key={video.id} className="bg-white/5 p-3 rounded-xl border border-white/10 group cursor-pointer">
                                            <div className="aspect-video rounded-lg overflow-hidden mb-3 relative">
                                                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover"/>
                                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <VideoIcon className="w-12 h-12 text-white" />
                                                </div>
                                            </div>
                                            <h3 className="font-bold">{video.title}</h3>
                                            <p className="text-sm text-gray-400">{video.type}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'branding' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                    {MOCK_DATA.portfolio.brands.map(brand => (
                                        <div key={brand.id} className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-center items-center text-center aspect-square">
                                            <div className="text-6xl mb-4">{brand.logoUrl}</div>
                                            <h3 className="text-2xl font-bold">{brand.name}</h3>
                                            <p className="text-gray-400 italic">"{brand.tagline}"</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'photography' && (
                                <div className="columns-2 sm:columns-3 gap-4">
                                    {MOCK_DATA.portfolio.photos.map(photo => (
                                        <div key={photo.id} className="mb-4 break-inside-avoid group relative overflow-hidden rounded-lg">
                                            <img src={photo.src} alt={photo.title} className="w-full h-auto rounded-lg" />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                                                <h3 className="text-white font-bold">{photo.title}</h3>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </SectionWrapper>
    );
});

// 4.4. Process Section
const ProcessSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="process" withTitle>
        <SectionTitle>Notre <span className="text-brand-cyan">Méthodologie</span></SectionTitle>
        <div className="w-full max-w-5xl space-y-8">
            {MOCK_DATA.processSteps.map((step, index) => (
                 <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    viewport={{ once: true, amount: 0.6 }}
                    className="flex items-center gap-6"
                >
                    <div className="flex-shrink-0 w-16 h-16 bg-white/5 border-2 border-brand-cyan rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-brand-cyan">{`0${step.number}`}</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">{step.title}</h3>
                        <p className="text-gray-400">{step.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    </SectionWrapper>
));

// 4.5. About Section
const AboutSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="about" withTitle>
        <SectionTitle>Pourquoi <span className="text-brand-purple">Digital Move Up</span></SectionTitle>
        <div className="grid md:grid-cols-2 gap-8 w-full max-w-5xl items-center">
            <div className="text-center md:text-left">
                <h3 className="text-3xl font-bold mb-4">Notre Mission</h3>
                <p className="text-gray-300 mb-6">Nous fusionnons passion créative et précision de l'IA pour aider les marques à naviguer dans le paysage numérique et à atteindre une croissance exponentielle.</p>
                <h4 className="font-bold text-xl mb-3">Nos Valeurs:</h4>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {['Innovation', 'Transparence', 'Performance', 'Partenariat'].map(tech => (
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
                <p className="text-gray-400 mt-2 text-center">Propulsé par Imed, notre noyau IA.</p>
            </div>
        </div>
    </SectionWrapper>
));

// 4.6. Testimonials Section
const TestimonialsSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="testimonials" withTitle>
        <SectionTitle>Nos <span className="text-brand-cyan">Clients</span></SectionTitle>
        <div className="w-full max-w-7xl flex items-center gap-8 overflow-x-auto snap-x snap-mandatory py-8 px-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {MOCK_DATA.testimonials.map(testimonial => (
                <div key={testimonial.author} className="snap-center flex-shrink-0 w-[90vw] md:w-[450px] bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col justify-center backdrop-blur-sm">
                    <p className="text-lg italic mb-6">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">{testimonial.logo}</div>
                        <div>
                            <p className="font-bold text-white">{testimonial.author}</p>
                            <p className="text-sm text-gray-400">{testimonial.company}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </SectionWrapper>
));

// 4.7. Contact Section
const ContactSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="contact" withTitle>
        <SectionTitle>Parlons de votre <span className="text-brand-purple">projet</span></SectionTitle>
        <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
            <form className="space-y-4">
                <input type="text" placeholder="Votre Nom" className="w-full bg-white/5 p-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                <input type="email" placeholder="Votre Email" className="w-full bg-white/5 p-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-purple" />
                <textarea placeholder="Votre Message" rows={4} className="w-full bg-white/5 p-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-purple"></textarea>
                <button type="submit" className="w-full p-3 font-bold bg-gradient-to-r from-brand-cyan to-brand-purple text-black rounded-lg transition-transform hover:scale-105">Envoyer le Message</button>
            </form>
            <div className="text-center my-4 text-gray-400">OU</div>
            <a href="https://calendly.com/" target="_blank" rel="noopener noreferrer" className="block w-full text-center p-3 font-bold bg-white/10 border border-white/20 text-white rounded-lg transition-colors hover:bg-white/20">
                Réserver un appel sur Calendly
            </a>
        </div>
    </SectionWrapper>
));

// 4.8. Footer Section
const FooterSection = React.forwardRef<HTMLElement, {}>((props, ref) => (
    <SectionWrapper ref={ref} id="footer" withTitle>
        <SectionTitle>Restons en <span className="text-brand-cyan">contact</span></SectionTitle>
        <footer className="w-full max-w-5xl text-center space-y-4">
            <p className="text-gray-400">contact@digitalmoveup.com</p>
            <div className="flex justify-center gap-4 text-sm text-gray-500">
                <a href="#hero" onClick={handleHashLinkClick} className="hover:text-white">Accueil</a>
                <a href="#services" onClick={handleHashLinkClick} className="hover:text-white">Services</a>
                <a href="#portfolio" onClick={handleHashLinkClick} className="hover:text-white">Travaux</a>
                <a href="#process" onClick={handleHashLinkClick} className="hover:text-white">Méthodologie</a>
                <a href="#about" onClick={handleHashLinkClick} className="hover:text-white">À Propos</a>
                <a href="#contact" onClick={handleHashLinkClick} className="hover:text-white">Contact</a>
            </div>
            <p className="text-xs text-gray-600">© {new Date().getFullYear()} Digital Move Up. Tous droits réservés.</p>
        </footer>
    </SectionWrapper>
));

//================================================================================
// 5. MAIN APP COMPONENT
//================================================================================
export default function App() {
    const [activeSection, setActiveSection] = useState<SectionId>('hero');
    
    const sectionIds: SectionId[] = ['hero', 'services', 'portfolio', 'process', 'about', 'testimonials', 'contact', 'footer'];
    
    const refs = {
        hero: useRef<HTMLElement>(null),
        services: useRef<HTMLElement>(null),
        portfolio: useRef<HTMLElement>(null),
        process: useRef<HTMLElement>(null),
        about: useRef<HTMLElement>(null),
        testimonials: useRef<HTMLElement>(null),
        contact: useRef<HTMLElement>(null),
        footer: useRef<HTMLElement>(null),
    };

    const inViewHooks = {
        hero: useInView(refs.hero, { amount: 0.5 }),
        services: useInView(refs.services, { amount: 0.5 }),
        portfolio: useInView(refs.portfolio, { amount: 0.5 }),
        process: useInView(refs.process, { amount: 0.5 }),
        about: useInView(refs.about, { amount: 0.5 }),
        testimonials: useInView(refs.testimonials, { amount: 0.5 }),
        contact: useInView(refs.contact, { amount: 0.5 }),
        footer: useInView(refs.footer, { amount: 0.5 }),
    };

    useEffect(() => {
        const visibleSections = sectionIds.filter(id => inViewHooks[id]);
        if (visibleSections.length > 0) {
            setActiveSection(visibleSections[visibleSections.length - 1]);
        }
    }, [inViewHooks.hero, inViewHooks.services, inViewHooks.portfolio, inViewHooks.process, inViewHooks.about, inViewHooks.testimonials, inViewHooks.contact, inViewHooks.footer]);


    return (
        <>
            <NavbarTop />
            <main className="scroll-container">
                <HeroSection ref={refs.hero} />
                <ServicesSection ref={refs.services} />
                <PortfolioSection ref={refs.portfolio} />
                <ProcessSection ref={refs.process} />
                <AboutSection ref={refs.about} />
                <TestimonialsSection ref={refs.testimonials} />
                <ContactSection ref={refs.contact} />
                <FooterSection ref={refs.footer} />
            </main>
            <Dock activeSection={activeSection} />
            <FloatingButtons />
        </>
    );
}
