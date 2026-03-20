import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Code2, PenTool, Shield, CodeSquare,
  Users, Award, BookOpen, Headphones,
  Briefcase, ChevronDown, Menu, X,
  CheckCircle, Rocket, Target, Zap,
  Globe, ArrowRight, GraduationCap,
  Laptop, TrendingUp, Mail, Phone,
  MapPin, Star, ArrowUp, MessageCircle,
  Terminal, Cpu, GitBranch, Wifi,
} from "lucide-react";

/* ── Scroll reveal ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useReveal();
  const isFullHeight = className.includes("h-full");
  return (
    <div ref={ref} className={`${className}${isFullHeight ? " flex flex-col" : ""}`}
      style={{ transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)" }}>
      {children}
    </div>
  );
}

/* ── Floating particles canvas ── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let raf: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const dots = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = canvas.width; if (d.x > canvas.width) d.x = 0;
        if (d.y < 0) d.y = canvas.height; if (d.y > canvas.height) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,165,250,${d.alpha})`;
        ctx.fill();
      });
      // draw lines between close dots
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(96,165,250,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}

/* ── Spotlight cursor glow ── */
function Spotlight() {
  const [pos, setPos] = useState({ x: -999, y: -999 });
  useEffect(() => {
    const h = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);
  return (
    <div className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{ background: `radial-gradient(600px circle at ${pos.x}px ${pos.y}px, rgba(59,130,246,0.06), transparent 70%)` }} />
  );
}

/* ── Glowing border card ── */
function GlowCard({ children, className = "", color = "blue" }: { children: React.ReactNode; className?: string; color?: string }) {
  const colors: Record<string, string> = {
    blue: "rgba(59,130,246,0.5)", violet: "rgba(139,92,246,0.5)",
    emerald: "rgba(16,185,129,0.5)", rose: "rgba(244,63,94,0.5)",
  };
  const [hovered, setHovered] = useState(false);
  return (
    <div className={`relative rounded-2xl transition-all duration-300 flex flex-col ${hovered ? "-translate-y-2" : ""} ${className}`}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ boxShadow: hovered ? `0 0 30px ${colors[color] ?? colors.blue}, 0 0 60px ${colors[color] ?? colors.blue}33` : "none" }}>
      <div className="absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none"
        style={{ opacity: hovered ? 1 : 0, background: `linear-gradient(135deg, ${colors[color] ?? colors.blue}15, transparent)`, border: `1px solid ${colors[color] ?? colors.blue}40` }} />
      <div className="relative flex flex-col flex-1">{children}</div>
    </div>
  );
}

/* ── Terminal code animation ── */
const terminalLines = [
  { text: "$ npm create codecove-app", color: "text-green-400" },
  { text: "✓ Setting up your dev environment...", color: "text-blue-400" },
  { text: "✓ Installing React + TypeScript", color: "text-blue-400" },
  { text: "✓ Configuring Node.js backend", color: "text-blue-400" },
  { text: "✓ Connecting MongoDB Atlas", color: "text-emerald-400" },
  { text: "✓ Deploying to AWS...", color: "text-violet-400" },
  { text: "🚀 Your career is ready!", color: "text-yellow-400" },
];

function TerminalWidget() {
  const [lines, setLines] = useState<typeof terminalLines>([]);
  const [done, setDone] = useState(false);
  const [cursor, setCursor] = useState(true);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    let i = 0;
    const t = setInterval(() => {
      if (i < terminalLines.length) {
        const line = terminalLines[i];
        setLines(prev => [...prev, line]);
        i++;
      } else {
        clearInterval(t);
        setDone(true);
      }
    }, 650);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => setCursor(c => !c), 500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-[#050a14] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#0a1628] border-b border-white/5">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <span className="ml-2 text-gray-500 text-xs font-mono">codecove — bash</span>
        <Terminal size={12} className="ml-auto text-gray-600" />
      </div>
      <div className="p-4 font-mono text-xs">
        {lines.map((l, i) => (
          <div key={i} className={`${l.color} mb-0.5 leading-relaxed`}>{l.text}</div>
        ))}
        {!done && (
          <span className={`text-green-400 ${cursor ? "opacity-100" : "opacity-0"} transition-opacity`}>▋</span>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [activeTab, setActiveTab] = useState(0);
  const [glowAngle, setGlowAngle] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const [typed, setTyped] = useState("");
  const [activeSection, setActiveSection] = useState("");
  const words = ["a Career.", "the Future.", "Success."];
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const i = setInterval(() => setGlowAngle(a => (a + 1.5) % 360), 20);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
      const sections = ["hero", "courses", "features", "instructors", "faq", "contact"];
      for (const id of sections.reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) { setActiveSection(id); break; }
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const current = words[wordIdx];
    const t = setTimeout(() => {
      if (!deleting) {
        setTyped(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), 1800);
        else setCharIdx(c => c + 1);
      } else {
        setTyped(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) { setDeleting(false); setWordIdx(w => (w + 1) % words.length); setCharIdx(0); }
        else setCharIdx(c => c - 1);
      }
    }, deleting ? 50 : 90);
    return () => clearTimeout(t);
  }, [charIdx, deleting, wordIdx]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setIsSubmitting(true); setSubmitStatus("idle");
    try {
      const res = await fetch("https://codecove-pemx.onrender.com/api/contact", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), signal: AbortSignal.timeout(15000),
      });
      setSubmitStatus(res.ok ? "success" : "error");
      if (res.ok) setFormData({ name: "", email: "", message: "" });
    } catch { setSubmitStatus("error"); }
    finally { setIsSubmitting(false); }
  };

  const scroll = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  }, []);

  const pageHeight = typeof document !== "undefined" ? document.body.scrollHeight - window.innerHeight : 1;
  const progress = Math.min((scrollY / (pageHeight || 1)) * 100, 100);

  const courses = [
    { title: "Full Stack Development", desc: "Build complete web apps with React, Node.js & MongoDB.", icon: Code2, tags: ["React", "Node.js", "MongoDB"], color: "from-blue-500 to-blue-700", glowColor: "blue", projects: "5+ Projects", mode: "Live Online", support: "24/7 Mentorship" },
    { title: "Python Programming", desc: "From basics to data science and automation.", icon: CodeSquare, tags: ["Python", "Django", "Data Science"], color: "from-emerald-500 to-emerald-700", glowColor: "emerald", projects: "4+ Projects", mode: "Live Online", support: "24/7 Mentorship" },
    { title: "Ethical Hacking", desc: "Cybersecurity fundamentals and penetration testing.", icon: Shield, tags: ["Kali Linux", "Networking", "Pentesting"], color: "from-rose-500 to-rose-700", glowColor: "rose", projects: "6+ Labs", mode: "Live Online", support: "24/7 Mentorship" },
    { title: "DSA Mastery", desc: "Master algorithms and crack top tech interviews.", icon: PenTool, tags: ["Java", "C++", "LeetCode"], color: "from-violet-500 to-violet-700", glowColor: "violet", projects: "100+ Problems", mode: "Live Online", support: "24/7 Mentorship" },
  ];

  const features = [
    { title: "Live Interactive Classes", desc: "Real-time sessions with Q&A, not pre-recorded videos.", icon: BookOpen, color: "blue" },
    { title: "Industry Expert Mentors", desc: "Learn from engineers at top product companies.", icon: Users, color: "violet" },
    { title: "Recognized Certification", desc: "Certificates valued by recruiters and hiring managers.", icon: Award, color: "emerald" },
    { title: "Placement Assistance", desc: "Resume reviews, mock interviews, and job referrals.", icon: Briefcase, color: "blue" },
    { title: "Real-World Projects", desc: "Build a portfolio that stands out to employers.", icon: Code2, color: "violet" },
    { title: "24/7 Doubt Support", desc: "Never get stuck — help is always available.", icon: Headphones, color: "emerald" },
  ];

  const steps = [
    { n: "01", title: "Pick Your Track", desc: "Choose a program aligned with your career goals.", icon: Target },
    { n: "02", title: "Learn by Doing", desc: "Live classes, assignments, and real projects.", icon: Laptop },
    { n: "03", title: "Get Certified", desc: "Earn an industry-recognized certificate.", icon: GraduationCap },
    { n: "04", title: "Land the Job", desc: "Placement support to crack your dream role.", icon: TrendingUp },
  ];

  const instructors = [
    { name: "Vishal Singh", role: "Senior Software Engineer III", image: "/assets/vishal.png", company: "5+ yrs at GreekyAnts", skills: ["React", "Node.js", "AWS"] },
    { name: "Satyam Raj", role: "Data Engineer", image: "/assets/satyam.png", company: "Nielsen", skills: ["Java", "DSA", "SQL"] },
    { name: "Shani Kumar", role: "Software Dev Engineer", image: "/assets/shani.png", company: "2+ yrs at Infra.Market", skills: ["React Native", "Mobile Dev"] },
  ];

  const faqs = [
    { q: "Do I need prior coding experience?", a: "No. Our Full Stack and Python tracks start from absolute zero. DSA and Ethical Hacking benefit from basic programming knowledge." },
    { q: "Are classes live or recorded?", a: "All classes are live and interactive. Recordings are shared after each session so you never miss anything." },
    { q: "What kind of placement support do you offer?", a: "We provide resume reviews, LinkedIn optimization, mock interviews, and direct referrals to our hiring network." },
    { q: "How long are the courses?", a: "Programs range from 2 to 4 months depending on the track, with flexible scheduling for working professionals." },
    { q: "Will I get a certificate?", a: "Yes. You receive an industry-recognized certificate upon completing the course and projects." },
    { q: "What is the batch size?", a: "We keep batches small (under 20 students) to ensure personalized attention from mentors." },
  ];

  const techStack = [
    { name: "React", icon: "⚛️" }, { name: "Node.js", icon: "🟢" }, { name: "MongoDB", icon: "🍃" },
    { name: "Python", icon: "🐍" }, { name: "Django", icon: "🎸" }, { name: "AWS", icon: "☁️" },
    { name: "Docker", icon: "🐳" }, { name: "Git", icon: "🔀" }, { name: "TypeScript", icon: "🔷" },
    { name: "Java", icon: "☕" }, { name: "C++", icon: "⚙️" }, { name: "Kali Linux", icon: "🐉" },
    { name: "PostgreSQL", icon: "🐘" }, { name: "Redis", icon: "🔴" }, { name: "Figma", icon: "🎨" },
  ];

  const whyUs = [
    { icon: Zap, title: "Learn Faster", desc: "Structured curriculum designed by engineers who've been through the hiring process.", color: "blue" },
    { icon: Globe, title: "100% Online", desc: "Join from anywhere in India. All you need is a laptop and internet connection.", color: "violet" },
    { icon: CheckCircle, title: "Job-Ready Skills", desc: "Every project and assignment is designed to match what companies actually look for.", color: "emerald" },
    { icon: Rocket, title: "Career Launch", desc: "From zero to your first tech job — we're with you every step of the way.", color: "rose" },
  ];

  const gradX = 50 + 45 * Math.cos((glowAngle * Math.PI) / 180);
  const gradY = 50 + 45 * Math.sin((glowAngle * Math.PI) / 180);

  const iconColors: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400",
    violet: "bg-violet-500/10 text-violet-400",
    emerald: "bg-emerald-500/10 text-emerald-400",
    rose: "bg-rose-500/10 text-rose-400",
  };

  const navLinks = ["courses", "features", "instructors", "faq", "contact"];

  return (
    <div className="min-h-screen bg-[#080d1a] text-white font-sans overflow-x-hidden">
      <Spotlight />

      {/* Scroll Progress */}
      <div className="fixed top-0 left-0 z-[100] h-[2px] transition-all duration-75"
        style={{ width: `${progress}%`, background: "linear-gradient(90deg,#3b82f6,#8b5cf6,#3b82f6)", backgroundSize: "200% 100%", animation: "shimmer 2s linear infinite" }} />

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 40 ? "bg-[#080d1a]/80 backdrop-blur-xl border-b border-white/[0.06] shadow-2xl shadow-black/40" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => scroll("hero")} className="flex items-center gap-2 group">
              <img src="/assets/Company_Logo.png" alt="CodeCove" className="h-8 w-auto group-hover:scale-105 transition-transform" />
            </button>
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(s => (
                <button key={s} onClick={() => scroll(s)}
                  className={`px-3 py-1.5 text-sm rounded-lg capitalize transition-all ${activeSection === s ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                  {s === "faq" ? "FAQ" : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
              <button onClick={() => scroll("contact")}
                className="ml-3 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105">
                Contact Us
              </button>
            </div>
            <button className="md:hidden text-gray-300 hover:text-white p-1" onClick={() => setIsMenuOpen(o => !o)}>
              {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-[#0a1220]/95 backdrop-blur-xl border-t border-white/5 px-4 py-4 flex flex-col gap-2">
            {navLinks.map(s => (
              <button key={s} onClick={() => scroll(s)} className="text-sm text-gray-300 hover:text-white capitalize text-left py-2 px-3 rounded-lg hover:bg-white/5 transition-colors">
                {s === "faq" ? "FAQ" : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
            <button onClick={() => scroll("contact")} className="mt-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors text-left">
              Contact Us
            </button>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <ParticleCanvas />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "50px 50px" }} />
        {/* Glow blobs */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col lg:flex-row gap-12 lg:gap-10 items-center justify-between w-full">
          {/* Left */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6 backdrop-blur-sm w-fit">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Enrollments Open — Limited Seats
              <Wifi size={10} className="ml-1 animate-pulse" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 tracking-tight">
              Code Your Way<br />
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400"
                  style={{ backgroundSize: "200% 100%", animation: "shimmer 3s linear infinite" }}>
                  to {typed}
                </span>
                <span className="text-blue-400 animate-pulse">|</span>
              </span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed">
              Live, hands-on tech training by engineers from top companies. Build real projects, earn certifications, and land your dream job.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <button onClick={() => scroll("courses")}
                className="group px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 flex items-center gap-2">
                Explore Courses
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => scroll("contact")}
                className="px-6 py-3 border border-white/15 hover:border-blue-500/50 text-white font-semibold rounded-xl transition-all hover:bg-blue-500/5 backdrop-blur-sm">
                Contact Us
              </button>
            </div>
            {/* Mini stats row */}
            <div className="flex gap-8 flex-wrap">
              {[["500+", "Students"], ["4", "Courses"], ["85%", "Placed"]].map(([v, l]) => (
                <div key={l}>
                  <div className="text-2xl font-black text-white">{v}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — animated course card + terminal */}
          <div className="w-full lg:w-[380px] flex-shrink-0 flex flex-col gap-4 items-center lg:items-end">
            {/* Rotating glow border card */}
            <div className="relative p-[2px] rounded-2xl w-full"
              style={{ background: `conic-gradient(from ${glowAngle}deg at ${gradX}% ${gradY}%, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)` }}>
              <div className="bg-[#0a1220] rounded-2xl p-6">
                <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                  {courses.map((c, i) => (
                    <button key={i} onClick={() => setActiveTab(i)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeTab === i ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
                      {c.title.split(" ")[0]}
                    </button>
                  ))}
                </div>
                {(() => {
                  const c = courses[activeTab];
                  const Icon = c.icon;
                  return (
                    <div>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon size={20} className="text-white" />
                      </div>
                      <h3 className="text-white font-bold text-lg mb-1">{c.title}</h3>
                      <p className="text-gray-400 text-sm mb-4">{c.desc}</p>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[["Mode", c.mode], ["Projects", c.projects], ["Support", c.support]].map(([k, v]) => (
                          <div key={k} className="bg-white/5 rounded-lg p-2 text-center border border-white/5">
                            <div className="text-gray-500 text-[10px] mb-1">{k}</div>
                            <div className="text-white text-xs font-semibold">{v}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {c.tags.map(t => <span key={t} className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-full">{t}</span>)}
                      </div>
                      <button onClick={() => scroll("contact")}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/30">
                        Contact Us
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
            {/* Terminal widget */}
            <div className="w-full">
              <TerminalWidget />
            </div>
          </div>
        </div>
      </section>

      {/* ── TECH STACK MARQUEE ── */}
      <div className="relative bg-[#080d1a] border-y border-white/[0.06] py-5 overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#080d1a] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#080d1a] to-transparent z-10 pointer-events-none" />
        <div className="flex animate-marquee whitespace-nowrap">
          {[...techStack, ...techStack].map((t, i) => (
            <span key={i} className="mx-6 text-gray-500 text-sm font-medium flex items-center gap-2 hover:text-gray-300 transition-colors cursor-default">
              <span>{t.icon}</span>{t.name}
            </span>
          ))}
        </div>
      </div>

      {/* ── WHY CODECOVE ── */}
      <section className="py-24 bg-[#080d1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">CodeCove?</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">We're not just another online course platform. We're your career partner.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {whyUs.map((w, i) => (
              <Reveal key={i} delay={i * 100} className="h-full">
                <GlowCard color={w.color} className="h-full">
                  <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 h-full flex flex-col">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 flex-shrink-0 ${iconColors[w.color]}`}>
                      <w.icon size={22} />
                    </div>
                    <h3 className="text-white font-bold mb-2">{w.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{w.desc}</p>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-[#080d1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Works</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">Four simple steps from enrollment to employment.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <Reveal key={i} delay={i * 100}>
                <div className="relative bg-[#0d1526] border border-white/5 rounded-2xl p-6 hover:border-blue-500/20 transition-all hover:-translate-y-2 group">
                  <div className="text-6xl font-black text-white/[0.04] absolute top-3 right-4 select-none group-hover:text-white/[0.07] transition-colors">{s.n}</div>
                  <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <s.icon size={22} className="text-blue-400" />
                  </div>
                  <h3 className="text-white font-bold mb-2">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[1px] bg-gradient-to-r from-blue-500/50 to-transparent" />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 bg-[#080d1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Everything You <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Need</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">Built for learners who want real outcomes, not just certificates.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 80}>
                <GlowCard color={f.color} className="h-full">
                  <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 h-full group">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 ${iconColors[f.color]}`}>
                      <f.icon size={22} />
                    </div>
                    <h3 className="text-white font-bold mb-2">{f.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section id="courses" className="py-24 bg-[#080d1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Training <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Tracks</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">Pick the path that matches your goals. All tracks include live classes, projects, and placement support.</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.map((c, i) => (
              <Reveal key={i} delay={i * 100}>
                <GlowCard color={c.glowColor} className="h-full">
                  <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 flex flex-col h-full group">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                      <c.icon size={22} className="text-white" />
                    </div>
                    <h3 className="text-white font-black mb-2">{c.title}</h3>
                    <p className="text-gray-400 text-sm mb-4 flex-1 leading-relaxed">{c.desc}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {c.tags.map(t => <span key={t} className="px-2 py-0.5 bg-white/5 text-gray-400 text-xs rounded-full border border-white/5">{t}</span>)}
                    </div>
                    <button onClick={() => scroll("contact")}
                      className="w-full py-2 border border-blue-500/30 hover:bg-blue-600 hover:border-blue-600 text-blue-400 hover:text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20">
                      Contact Us
                    </button>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTRUCTORS ── */}
      <section id="instructors" className="py-24 bg-[#080d1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Meet Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Mentors</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">Learn from engineers who've built real products at real companies.</p>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {instructors.map((inst, i) => (
              <Reveal key={i} delay={i * 120}>
                <GlowCard color="blue" className="h-full">
                  <div className="bg-[#0d1526] border border-white/5 rounded-2xl p-6 text-center group h-full">
                    {/* Animated ring around photo */}
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-full animate-spin-slow"
                        style={{ background: `conic-gradient(from ${glowAngle}deg, #3b82f6, #8b5cf6, transparent, #3b82f6)`, padding: "2px", borderRadius: "9999px" }} />
                      <div className="absolute inset-[2px] rounded-full bg-[#0d1526]" />
                      <img src={inst.image} alt={inst.name} className="absolute inset-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-full object-cover" />
                    </div>
                    <h3 className="text-white font-black mb-1">{inst.name}</h3>
                    <p className="text-blue-400 text-sm mb-1 font-medium">{inst.role}</p>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      <Cpu size={11} className="text-gray-600" />
                      <p className="text-gray-500 text-xs">{inst.company}</p>
                    </div>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {inst.skills.map(s => <span key={s} className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs rounded-full">{s}</span>)}
                    </div>
                  </div>
                </GlowCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="py-20 bg-[#080d1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <div className="relative rounded-3xl p-[1px] overflow-hidden"
              style={{ background: "linear-gradient(135deg,#3b82f620,#8b5cf620,#3b82f620)" }}>
              <div className="bg-[#0a1220] rounded-3xl p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5"
                  style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 50%, #8b5cf6 0%, transparent 50%)" }} />
                <GitBranch size={32} className="text-blue-400 mx-auto mb-4 relative z-10" />
                <h2 className="text-3xl sm:text-4xl font-black mb-4 relative z-10">Our Mission</h2>
                <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed relative z-10">
                  To make world-class tech education accessible to every student in India — regardless of background or location. We believe talent is everywhere; opportunity shouldn't be limited.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 bg-[#080d1a]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Questions</span></h2>
            <p className="text-gray-400">Got questions? We've got answers.</p>
          </Reveal>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className={`bg-[#0d1526] border rounded-xl overflow-hidden transition-all ${openFaq === i ? "border-blue-500/30 shadow-lg shadow-blue-500/5" : "border-white/5 hover:border-white/10"}`}>
                  <button className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="text-white font-medium text-sm">{f.q}</span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ml-4 ${openFaq === i ? "rotate-180 text-blue-400" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-4 text-gray-400 text-sm border-t border-white/5 pt-3 leading-relaxed">{f.a}</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-24 bg-[#080d1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black mb-4">Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400">Touch</span></h2>
            <p className="text-gray-400 max-w-xl mx-auto">Have questions about a course? Ready to enroll? Drop us a message.</p>
          </Reveal>
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <Reveal>
              <form onSubmit={handleSubmit} className="bg-[#0d1526] border border-white/5 rounded-2xl p-8 space-y-5 hover:border-blue-500/10 transition-colors">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Your Name</label>
                  <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Enter your name"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Email Address</label>
                  <Input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com"
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all" />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Message</label>
                  <Textarea name="message" value={formData.message} onChange={handleChange} required placeholder="Tell us which course you're interested in..." rows={4}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 resize-none transition-all" />
                </div>
                <button type="submit" disabled={isSubmitting}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02]">
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
                {submitStatus === "success" && <p className="text-green-400 text-sm text-center flex items-center justify-center gap-2"><CheckCircle size={14} /> Message sent! We'll get back to you soon.</p>}
                {submitStatus === "error" && <p className="text-red-400 text-sm text-center">Server waking up — wait 30s and try again.</p>}
              </form>
            </Reveal>

            <Reveal delay={150}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-white mb-2">Let's Talk</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">We're here to help you pick the right course and answer any questions about our programs.</p>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: Mail, label: "Email", value: "codecove.edu@gmail.com", href: "mailto:codecove.edu@gmail.com" },
                    { icon: Phone, label: "WhatsApp / Call", value: "+91 7080549218", href: "https://wa.me/917080549218" },
                    { icon: MapPin, label: "Location", value: "Uttar Pradesh, India (Online)", href: null },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-center gap-4 p-4 bg-[#0d1526] border border-white/5 rounded-xl hover:border-blue-500/20 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                        <Icon size={18} className="text-blue-400" />
                      </div>
                      <div>
                        <div className="text-gray-500 text-xs mb-0.5">{label}</div>
                        {href ? (
                          <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
                            className="text-white text-sm hover:text-blue-400 transition-colors">{value}</a>
                        ) : (
                          <span className="text-white text-sm">{value}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-blue-500/10 to-violet-500/10 border border-blue-500/10 rounded-xl p-5">
                  <p className="text-gray-400 text-sm leading-relaxed">
                    <span className="text-white font-semibold">Response time:</span> We typically reply within a few hours on weekdays.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 bg-[#080d1a]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden p-[1px]"
              style={{ background: "linear-gradient(135deg,#3b82f6,#8b5cf6,#3b82f6)", backgroundSize: "200% 200%", animation: "shimmer 3s linear infinite" }}>
              <div className="bg-gradient-to-br from-blue-600/90 to-violet-700/90 rounded-3xl p-12 relative overflow-hidden backdrop-blur-sm">
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "30px 30px" }} />
                <Rocket size={36} className="mx-auto mb-4 text-white relative z-10" />
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 relative z-10">Ready to Start Your Journey?</h2>
                <p className="text-blue-100 mb-8 max-w-xl mx-auto relative z-10">Join hundreds of students who've transformed their careers with CodeCove. Your first step starts here.</p>
                <button onClick={() => scroll("contact")}
                  className="relative z-10 px-8 py-3 bg-white text-blue-700 font-black rounded-xl hover:bg-blue-50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-black/30">
                  Contact Us Today
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#080d1a] border-t border-white/[0.06] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            <div>
              <img src="/assets/Company_Logo.png" alt="CodeCove" className="h-8 mb-4" />
              <p className="text-gray-500 text-sm leading-relaxed">Live tech training by engineers. Build real skills, get real jobs.</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 text-sm">Courses</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                {courses.map(c => <li key={c.title}><button onClick={() => scroll("courses")} className="hover:text-blue-400 transition-colors">{c.title}</button></li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 text-sm">Company</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                {["features", "instructors", "faq", "contact"].map(s => (
                  <li key={s}><button onClick={() => scroll(s)} className="hover:text-blue-400 transition-colors capitalize">{s === "faq" ? "FAQ" : s.charAt(0).toUpperCase() + s.slice(1)}</button></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 text-sm">Connect</h4>
              <ul className="space-y-2 text-gray-500 text-sm">
                {[
                  ["Instagram", "https://www.instagram.com/codecove.ed"],
                  ["Twitter / X", "https://x.com/covecode_edu"],
                  ["LinkedIn", "https://www.linkedin.com/company/codecove-tech/"],
                  ["GitHub", "https://github.com/codecove-edu"],
                ].map(([name, url]) => (
                  <li key={name}><a href={url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">{name}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} CodeCove. All rights reserved.</p>
            <p className="text-gray-600 text-sm">Made with ❤️ in India</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp */}
      <a href="https://wa.me/917080549218" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-xl shadow-green-500/30 transition-all hover:scale-110 hover:shadow-green-500/50">
        <MessageCircle size={24} className="text-white" />
      </a>

      {/* Back to top */}
      {scrollY > 400 && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 z-50 w-10 h-10 bg-[#0d1526] border border-white/10 hover:border-blue-500/50 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg hover:shadow-blue-500/20">
          <ArrowUp size={16} className="text-gray-400" />
        </button>
      )}

      {/* Mobile bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a1220]/95 backdrop-blur-xl border-t border-white/[0.06] px-4 py-3 flex gap-3">
        <button onClick={() => scroll("courses")} className="flex-1 py-2.5 border border-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/5 transition-colors">
          Courses
        </button>
        <button onClick={() => scroll("contact")} className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/30">
          Contact Us
        </button>
      </div>

      {/* Global shimmer keyframe */}
      <style>{`
        @keyframes shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        @keyframes spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .animate-spin-slow { animation: spin-slow 4s linear infinite; }
      `}</style>
    </div>
  );
}
