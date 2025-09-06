import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Code2, 
  PenTool, 
  Shield, 
  CodeSquare,
  ArrowRight,
  Users,
  Award,
  Star,
  BookOpen,
  Clock,
  Headphones,
  Briefcase,
  CheckCircle,
  ChevronDown,
  Menu,
  X
} from "lucide-react";

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('http://localhost:3001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const benefits = [
    { title: "Expert Instructors", description: "Industry professionals", icon: Users },
    { title: "Live Sessions", description: "Interactive learning", icon: BookOpen },
    { title: "Hands-on Projects", description: "Real-world experience", icon: Code2 },
    { title: "Modern Curriculum", description: "Industry-relevant", icon: Award }
  ];

  const features = [
    { 
      title: "Live Interactive Training", 
      description: "Real-time classes with expert instructors and hands-on practice",
      icon: BookOpen
    },
    { 
      title: "Industry Expert Instructors", 
      description: "Learn from professionals with years of industry experience",
      icon: Users
    },
    { 
      title: "Industry-Recognized Certification", 
      description: "Get recognized certificates to boost your career prospects",
      icon: Award
    },
    { 
      title: "Career Support & Placement", 
      description: "Dedicated placement assistance and career guidance",
      icon: Briefcase
    },
    { 
      title: "Hands-on Project Experience", 
      description: "Build real-world projects to strengthen your portfolio",
      icon: Code2
    },
    { 
      title: "Dedicated Learning Support", 
      description: "Round-the-clock assistance and doubt resolution",
      icon: Headphones
    }
  ];

  const instructors = [
    {
      name: "Vishal Singh",
      role: "Senior Software Engineer III",
      image: "/assets/vishal.png",
      expertise: "5+ years at GreekyAnts",
      specialization: "React, Node.js, Amazon Web Services"
    },
    {
      name: "Satyam Raj",
      role: "DSA specialist",
      image: "/assets/satyam.png",
      expertise: "Data Engineer at Nielsen",
      specialization: "Java, DSA, Amazon Web Services, SQL"
    },
    {
      name: "Shani Kumar",
      role: "Software Development Engineer",
      image: "/assets/shani.png",
      expertise: "2+ years at Infra.Market",
      specialization: "React Native, Mobile Application Development"
    }
  ];

  const faqs = [
  {
    question: "Who can join CodeCove courses?",
    answer: "Anyone with the curiosity to learn! Our programs are beginner-friendly and also valuable for those looking to upskill."
  },
  {
    question: "Do I need prior coding experience?",
    answer: "No prior coding experience is required. We start from the basics and gradually move to advanced concepts."
  },
  {
    question: "Will I get a certificate?",
    answer: "Yes! After successfully completing the course and projects, you’ll receive a certificate that adds value to your resume and LinkedIn profile."
  },
  {
    question: "Do you provide placement support?",
    answer: "Yes! We offer placement guidance, resume building, interview prep, and connect learners with hiring partners."
  },
  {
    question: "What makes CodeCove different?",
    answer: "We focus on hands-on training, real-world projects, and mentorship from industry experts—not just theory."
  }
];


  return (
    <div className="min-h-screen bg-gray-950 text-gray-200">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 
    bg-gradient-to-r from-gray-900 via-gray-950 to-gray-900
    backdrop-blur-md border-b border-gray-800/70 shadow-md">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/assets/Company_Logo.png" 
                alt="CodeCove Logo" 
                className="h-10 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform"
              />
              
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-blue-400 transition-colors">
                About
              </button>
              <button onClick={() => scrollToSection('courses')} className="text-gray-300 hover:text-blue-400 transition-colors">
                Courses
              </button>
              <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-blue-400 transition-colors">
                Contact
              </button>
              <Button 
                onClick={() => scrollToSection('contact')} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 "
              >
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <div className="flex flex-col space-y-4">
                <button onClick={() => scrollToSection('about')} className="text-gray-300 hover:text-blue-400 transition-colors text-left">
                  About
                </button>
                <button onClick={() => scrollToSection('courses')} className="text-gray-300 hover:text-blue-400 transition-colors text-left">
                  Courses
                </button>
                <button onClick={() => scrollToSection('contact')} className="text-gray-300 hover:text-blue-400 transition-colors text-left">
                  Contact
                </button>
                <Button 
                  onClick={() => scrollToSection('contact')}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 to-black text-white pt-32 pb-20 md:py-40 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(56,189,248,0.15),transparent_40%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(124,58,237,0.15),transparent_40%)]"></div>
        </div>
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-8 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-blue-400 via-blue-300 to-violet-400 bg-clip-text text-transparent">
                Learn. Build.<br />Get Certified.
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-lg">
                Empowering students with live, interactive learning for tomorrow’s careers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button 
                  size="lg" 
                  onClick={() => scrollToSection('contact')}
                  className="bg-blue-600 text-white hover:bg-blue-700 font-medium px-8 transform hover:scale-105 transition-all duration-200"
                >
                  Get Started
                </Button>
              </div>

              {/* Key Benefits */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="text-center group">
                    <div className="flex flex-col items-center space-y-2">
                      <div className="h-10 w-10 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center group-hover:bg-blue-800/40 transition-colors">
                        <benefit.icon size={20} />
                      </div>
                      <div className="text-sm font-semibold text-white">{benefit.title}</div>
                      <div className="text-xs text-gray-400">{benefit.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Clean Static Image Section */}
<div className="md:w-1/2 flex justify-center items-center">
  <div className="relative" style={{ width: '100%', maxWidth: '700px' }}>
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="w-[480px] h-[480px] rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-3xl opacity-40"></div>
    </div>
    <img 
      src="/assets/bgimage.png" 
      alt="CodeCove Learning" 
      style={{
        width: '1',
        height: 'auto',
        minWidth: '500px',
        maxWidth: '700px',
        objectFit: 'contain',
        filter: 'drop-shadow(0 10px 30px rgba(59, 130, 246, 0.15))'
      }}
    />
    <div className="absolute bottom-0 w-60 h-20 bg-gradient-to-t from-black/40 to-transparent blur-2xl rounded-full"></div>
  </div>
</div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120">
            <path className="fill-gray-950"
              fillOpacity="1" 
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-black" id="about">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-800 text-blue-400 text-sm font-medium mb-4">
              Why Choose CodeCove
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Features That Set Us Apart
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience world-class education with industry-focused curriculum and expert mentorship
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800 hover:border-blue-500/30 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-blue-900/30 text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-800/40 transition-colors">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Tracks Section */}
      <section className="py-20 bg-gray-950" id="courses">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-800 text-blue-400 text-sm font-medium mb-4">
              Training Tracks
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Our Key Training Tracks</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Comprehensive hands-on training programs designed by students who understand your learning journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-900 border-gray-800 hover:border-blue-500/30 transition-all duration-300 group hover:transform hover:scale-105">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-blue-900/30 text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-800/40 transition-colors">
                  <Code2 size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Full Stack Development</h3>
                <p className="text-gray-400 mb-4">Master front-end and back-end technologies to build complete web applications from scratch.</p>
                <div className="flex items-center justify-between">
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-blue-500/30 transition-all duration-300 group hover:transform hover:scale-105">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-blue-900/30 text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-800/40 transition-colors">
                  <CodeSquare size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Python Programming</h3>
                <p className="text-gray-400 mb-4">Learn Python from basics to advanced concepts including data science and automation.</p>
                <div className="flex items-center justify-between">
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-blue-500/30 transition-all duration-300 group hover:transform hover:scale-105">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-blue-900/30 text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-800/40 transition-colors">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Ethical Hacking</h3>
                <p className="text-gray-400 mb-4">Discover cybersecurity fundamentals and ethical hacking techniques to protect digital assets.</p>
                <div className="flex items-center justify-between">
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800 hover:border-blue-500/30 transition-all duration-300 group hover:transform hover:scale-105">
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-lg bg-blue-900/30 text-blue-400 flex items-center justify-center mb-4 group-hover:bg-blue-800/40 transition-colors">
                  <PenTool size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">DSA</h3>
                <p className="text-gray-400 mb-4">Master problem-solving skills and build a strong foundation with Data Structures & Algorithms.</p>
                <div className="flex items-center justify-between">
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Meet Our Instructors Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-800 text-blue-400 text-sm font-medium mb-4">
              Expert Team
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Meet Our Instructors
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Learn from industry professionals with real-world experience at top tech companies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {instructors.map((instructor, index) => (
              <Card key={index} className="bg-gray-900 border-gray-800 hover:border-blue-500/30 transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-blue-500 mx-auto mb-4">
  <img
    src={instructor.image}
    alt={instructor.name}
    className="h-full w-full object-cover"
  />
</div>

                  <h3 className="font-semibold text-white text-lg mb-1">{instructor.name}</h3>
                  <p className="text-blue-400 text-sm mb-2">{instructor.role}</p>
                  <p className="text-gray-400 text-sm mb-3">{instructor.expertise}</p>
                  <div className="pt-3 border-t border-gray-800">
                    <p className="text-xs text-gray-500 font-medium">Specializes in:</p>
                    <p className="text-gray-300 text-sm">{instructor.specialization}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
  <div className="bg-gray-900/40 border border-gray-700 rounded-xl p-8 max-w-2xl mx-auto shadow-md">
    
    {/* Title */}
    <h3 className="text-2xl font-semibold mb-4 text-white">
      Our Mission
    </h3>
    
    {/* Mission Text */}
    <p className="text-gray-300 leading-relaxed">
      At CodeCove, our mission is to empower learners with practical, industry-ready skills. 
      We provide hands-on training, real-world projects, and expert mentorship to bridge the 
      gap between education and industry, helping students build confident and successful careers.
    </p>
  </div>
</div>
        </div> 
      </section>
      

      {/* FAQ Section */}
      <section className="py-20 bg-gray-950">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-800 text-blue-400 text-sm font-medium mb-4">
              Have Questions?
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Find answers to common questions about our training programs
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-800 rounded-lg overflow-hidden hover:border-blue-500/30 transition-colors">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full p-6 text-left bg-gray-900 hover:bg-gray-800 transition-colors flex justify-between items-center"
                >
                  <span className="font-semibold text-white">{faq.question}</span>
                  <ChevronDown 
                    size={20} 
                    className={`text-blue-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                {openFaq === index && (
                  <div className="p-6 bg-gray-950 border-t border-gray-800 animate-in slide-in-from-top-2 duration-200">
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-950" id="contact">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 rounded-full bg-gray-800 text-blue-400 text-sm font-medium mb-4">
              Contact Us
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Get in Touch</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Have questions about our programs? Reach out to us!
            </p>
          </div>
          
          <div className="max-w-lg mx-auto">
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-800 shadow-2xl">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Name
                    </label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Your name" 
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                      Email
                    </label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                      Message
                    </label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="Your message"
                      rows={4}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="bg-gray-800 border-gray-700 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                  
                  {submitStatus === 'success' && (
                    <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                      <p className="text-green-400 text-sm text-center">Message sent successfully! We'll get back to you soon.</p>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-400 text-sm text-center">Failed to send message. Please try again or contact us directly.</p>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-5 border-t border-gray-800">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3">
              <img
          src="/assets/footer.png"
          alt="CodeCove Logo"
          className="h-12 w-auto mb-2"
        />
              <p className="text-gray-400 text-sm">© 2025 CodeCove | Learn. Build. Succeed.</p>
            </div>
            
            <div className="flex space-x-6">
              <a href="https://www.instagram.com/codecove.ed?igsh=MWNsYzhvanoyZmIweA==" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
              </a>
              <a href="https://x.com/covecode_edu" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="https://www.linkedin.com/company/codecove-tech/" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href="https://github.com/codecove-edu" className="text-gray-400 hover:text-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}