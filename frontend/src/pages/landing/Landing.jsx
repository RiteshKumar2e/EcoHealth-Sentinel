import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Heart,
  Leaf,
  Shield,
  ArrowRight,
  Brain,
  Users,
  Zap,
  X,
  Target,
  Award,
  Globe,
  TrendingUp,
  Mail,
  Linkedin,
  Github,
  ArrowUp,
  CheckCircle,
  BarChart3,
  Activity,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './landing-page.css';

// EcoHealth Sentinel Logo Component - Updated for Light Theme
function EcoHealthLogo() {
  return (
    <div
      className="ecohealth-logo"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #3b82f6)', /* More vibrant green to blue */
          position: 'relative',
          boxShadow:
            '0 4px 6px rgba(37, 99, 235, 0.2), inset 0 0 10px rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width="32"
          height="32"
          style={{
            fill: 'none',
            stroke: 'white',
            strokeWidth: 2.5, /* Slightly thicker stroke */
            filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.7))',
          }}
        >
          <path
            d="M32 6C42 10 54 14 54 26C54 40 32 58 32 58S10 40 10 26C10 14 22 10 32 6Z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 30C28 24 36 22 40 28C42 32 38 38 32 40C28 41 26 38 26 34"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.2)',
          }}
        ></div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          lineHeight: '1.2',
          alignItems: 'flex-start',
        }}
      >
        <span
          style={{
            fontSize: '1.35rem',
            fontWeight: 800,
            /* Changed to Dark Slate for Light Theme Visibility */
            color: '#2563eb', /* Primary Blue for better visibility */
            letterSpacing: '-0.5px'
          }}
        >
          EcoHealth
        </span>
        <span
          style={{
            fontSize: '0.85rem',
            fontWeight: 600,
            /* Changed to Medium Slate */
            color: '#1e293b', /* Darker Slate for better visibility */
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}
        >
          Sentinel
        </span>
      </div>
    </div >
  );
}

// Legal Modal Component
function LegalModal({ isOpen, onClose, title, content }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="popup-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <div
        className="popup-card-large legal-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        <button
          className="popup-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="popup-content">
          <h3 id="legal-modal-title" className="popup-title">{title}</h3>
          <div className="legal-content">{content}</div>
          <button className="btn-primary" onClick={onClose} style={{ marginTop: '20px' }}>
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const [particles, setParticles] = useState([]);
  const [showSignInPopup, setShowSignInPopup] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSolution, setActiveSolution] = useState(null);

  // Legal Modals State
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTermsOfService, setShowTermsOfService] = useState(false);
  const [showCookiePolicy, setShowCookiePolicy] = useState(false);

  const navigate = useNavigate();

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const solutionsRef = useRef(null);
  const goalsRef = useRef(null);
  const teamRef = useRef(null);
  const footerRef = useRef(null);


  // Scroll animation
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Particle generation
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }));
    setParticles(newParticles);
  }, []);

  // Close solution modal
  const closeModal = () => {
    setActiveSolution(null);
  };

  useEffect(() => {
    if (activeSolution) {
      document.body.style.overflow = 'hidden';
      const handleEscape = (e) => {
        if (e.key === 'Escape') closeModal();
      };
      window.addEventListener('keydown', handleEscape);
      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleEscape);
      };
    }
  }, [activeSolution]);

  // Smooth scroll functions
  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Legal Content Data
  const legalContent = {
    privacyPolicy: (
      <div className="legal-text">
        <h4>Privacy Policy</h4>
        <p><strong>Last Updated:</strong> October 12, 2025</p>

        <h5>1. Information We Collect</h5>
        <p>We collect information you provide directly to us, including name, email address, phone number, and any other information you choose to provide through our contact forms or services.</p>

        <h5>2. How We Use Your Information</h5>
        <ul>
          <li>To provide, maintain, and improve our services</li>
          <li>To communicate with you about our products and services</li>
          <li>To monitor and analyze trends, usage, and activities</li>
          <li>To detect, prevent, and address technical issues</li>
        </ul>

        <h5>3. Data Security</h5>
        <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>

        <h5>4. Your Rights</h5>
        <p>You have the right to access, update, or delete your personal information. Contact us at riteshkumar90359@gmail.com for any privacy-related requests.</p>

        <h5>5. Contact Us</h5>
        <p>For questions about this Privacy Policy, contact us at riteshkumar90359@gmail.com or +91 6206269895.</p>
      </div>
    ),

    termsOfService: (
      <div className="legal-text">
        <h4>Terms of Service</h4>
        <p><strong>Last Updated:</strong> October 12, 2025</p>

        <h5>1. Acceptance of Terms</h5>
        <p>By accessing and using EcoHealth Sentinel's services, you accept and agree to be bound by these Terms of Service.</p>

        <h5>2. Use of Services</h5>
        <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You must not:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe upon the rights of others</li>
          <li>Transmit any harmful or malicious code</li>
          <li>Attempt to gain unauthorized access to our systems</li>
        </ul>

        <h5>3. Intellectual Property</h5>
        <p>All content, features, and functionality of our services are owned by EcoHealth Sentinel and protected by international copyright, trademark, and other intellectual property laws.</p>

        <h5>4. Limitation of Liability</h5>
        <p>EcoHealth Sentinel shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.</p>

        <h5>5. Changes to Terms</h5>
        <p>We reserve the right to modify these terms at any time. Continued use of our services constitutes acceptance of modified terms.</p>
      </div>
    ),

    cookiePolicy: (
      <div className="legal-text">
        <h4>Cookie Policy</h4>
        <p><strong>Last Updated:</strong> October 12, 2025</p>

        <h5>1. What Are Cookies</h5>
        <p>Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience and understand how you use our services.</p>

        <h5>2. Types of Cookies We Use</h5>
        <ul>
          <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
          <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
          <li><strong>Marketing Cookies:</strong> Track your browsing habits to deliver relevant advertisements</li>
        </ul>

        <h5>3. Managing Cookies</h5>
        <p>You can control and/or delete cookies through your browser settings. However, disabling cookies may affect the functionality of our website.</p>

        <h5>4. Third-Party Cookies</h5>
        <p>We may use third-party services like Google Analytics that place cookies on your device. These third parties have their own privacy policies.</p>

        <h5>5. Contact</h5>
        <p>For questions about our use of cookies, contact us at riteshkumar90359@gmail.com.</p>
      </div>
    )
  };

  // Solutions Array
  const solutions = [
    {
      icon: <Heart className="w-8 h-8" style={{ width: '32px', height: '32px' }} />,
      title: 'Healthcare AI',
      description: 'Transforming patient care with predictive diagnostics and personalized treatment recommendations',
      color: 'from-rose-500 to-pink-600',
      domain: 'Healthcare & Medical Technology',
      fullDescription: 'Our Healthcare AI solution leverages advanced machine learning algorithms to provide early disease detection, personalized treatment plans, and real-time health monitoring. We use predictive analytics to identify health risks before they become critical, enabling healthcare providers to deliver proactive care.',
      features: [
        'AI-powered disease prediction and early detection',
        'Personalized treatment recommendations based on patient history',
        'Real-time health monitoring and alerts',
        'Integration with existing healthcare systems',
        'HIPAA-compliant data security'
      ],
    },
    {
      icon: <Leaf className="w-8 h-8" style={{ width: '32px', height: '32px' }} />,
      title: 'Agriculture Tech',
      description: 'Optimizing crop yields and resource management through intelligent farming solutions',
      color: 'from-green-500 to-emerald-600',
      domain: 'Smart Agriculture & Precision Farming',
      fullDescription: 'Our Agriculture Tech platform uses AI and IoT sensors to provide farmers with actionable insights for crop management, soil health monitoring, and weather prediction. By analyzing soil conditions, weather patterns, and crop health in real-time, we help farmers maximize yields while minimizing resource waste.',
      features: [
        'Soil health analysis and nutrient recommendations',
        'Weather prediction and crop cycle planning',
        'Pest and disease detection using computer vision',
        'Water usage optimization and irrigation scheduling',
        'Market price prediction for better crop planning'
      ],
    },
    {
      icon: <Sparkles className="w-8 h-8" style={{ width: '32px', height: '32px' }} />,
      title: 'Environmental AI',
      description: 'Monitoring and protecting ecosystems with advanced environmental analytics solutions',
      color: 'from-blue-500 to-cyan-600',
      domain: 'Environmental Monitoring & Conservation',
      fullDescription: 'Our Environmental AI platform monitors air quality, water pollution, deforestation, and biodiversity changes in real-time. Using satellite imagery, IoT sensors, and predictive models, we help governments and organizations make data-driven decisions for environmental protection and sustainability.',
      features: [
        'Real-time air and water quality monitoring',
        'Deforestation tracking using satellite imagery',
        'Wildlife population monitoring and habitat analysis',
        'Carbon footprint tracking and reduction strategies',
        'Early warning system for environmental hazards'
      ],
    }
  ];

  const features = [
    { icon: <Brain style={{ width: '20px', height: '20px' }} />, text: 'Advanced Machine Learning' },
    { icon: <Shield style={{ width: '20px', height: '20px' }} />, text: 'Security-First Architecture' },
    { icon: <Users style={{ width: '20px', height: '20px' }} />, text: 'Real Social Impact' },
    { icon: <Zap style={{ width: '20px', height: '20px' }} />, text: 'Efficient & Scalable' }
  ];

  const goals = [
    {
      icon: <Target />,
      title: 'Sustainable Agriculture',
      description: 'Empower 1 million farmers with AI-driven insights by 2030',
      progress: 65
    },
    {
      icon: <Heart />,
      title: 'Healthcare Access',
      description: 'Provide AI diagnostics to underserved communities',
      progress: 78
    },
    {
      icon: <Globe />,
      title: 'Environmental Protection',
      description: 'Monitor and preserve 500+ ecosystems globally',
      progress: 82
    }
  ];

  const team = [
    {
      name: 'Ritesh Kumar',
      role: 'SOFTWARE ENGINEER | AI & ML ENTHUSIAST',
      image: '👨‍💻',
      linkedin: 'https://www.linkedin.com/in/ritesh-kumar-b3a654253',
      github: 'https://github.com/RiteshKumar2e',
      bio: 'B.Tech CSE (AI & ML) student | Experienced in React, SQL | Passionate about AI, ML, and full-stack development.'
    }
  ];


  return (
    <div className="landing-container">
      {/* Particle background */}
      <div className="particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="landing-header">
        <EcoHealthLogo />

        <nav className="nav-links">
          <button onClick={() => scrollToSection(heroRef)}>Home</button>
          <button onClick={() => scrollToSection(aboutRef)}>About</button>
          <button onClick={() => scrollToSection(solutionsRef)}>Solutions</button>
          <button onClick={() => scrollToSection(goalsRef)}>Goals</button>
          <button onClick={() => scrollToSection(teamRef)}>Team</button>
          <button onClick={() => scrollToSection(footerRef)}>Contact</button>
        </nav>

        <div className="auth-buttons">
          <button className="btn-user" onClick={() => navigate('/auth/login')}>
            Sign In
          </button>
          <button className="btn-admin" onClick={() => navigate('/admin/login')}>
            Admin Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="hero-section">
        <div className="hero-background">
          <div
            className="gradient-orb orb-1"
            style={{ transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.15}px)` }}
          ></div>
          <div
            className="gradient-orb orb-2"
            style={{ transform: `translate(${-scrollY * 0.08}px, ${scrollY * 0.12}px)` }}
          ></div>
          <div
            className="gradient-orb orb-3"
            style={{ transform: `translate(${scrollY * 0.05}px, ${-scrollY * 0.1}px)` }}
          ></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Innovation</span>
          </div>

          <h1 className="hero-title">
            EcoHealth Sentinel – AI for Sustainable Agriculture & Community Health
          </h1>

          <p className="hero-subtitle">
            Bridging technology and sustainability to create a healthier planet and thriving communities
          </p>

          <div className="hero-cta">
            <button
              className="btn-primary"
              onClick={() => scrollToSection(solutionsRef)}
            >
              Explore Solutions
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              className="btn-secondary"
              onClick={() => scrollToSection(aboutRef)}
            >
              Learn More
            </button>
          </div>

          <div className="features-grid-mini">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-mini">
                {feature.icon}
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

      </section>


      {/* About Us Section */}
      <section ref={aboutRef} className="about-section">
        <div className="section-header">
          <h2 className="section-title">About EcoHealth Sentinel</h2>
          <p className="section-subtitle">
            Pioneering AI solutions for sustainable development and community wellness
          </p>
        </div>

        <div className="about-content">
          <div className="about-text">
            <h3>Our Mission</h3>
            <p>
              EcoHealth Sentinel was founded with a singular vision: to harness the power of artificial
              intelligence for the betterment of agriculture, healthcare, and environmental conservation.
              We believe technology should serve humanity and our planet.
            </p>
            <p>
              By combining cutting-edge AI with deep domain expertise, we create solutions that are not
              just innovative, but truly impactful. From helping farmers optimize their yields to enabling
              early disease detection in remote areas, our work touches lives every day.
            </p>

            <div className="about-values">
              <div className="value-item">
                <CheckCircle className="w-6 h-6" style={{ color: '#22c55e' }} />
                <div>
                  <h4>Innovation</h4>
                  <p>Pushing boundaries with advanced AI research</p>
                </div>
              </div>
              <div className="value-item">
                <CheckCircle className="w-6 h-6" style={{ color: '#22c55e' }} />
                <div>
                  <h4>Sustainability</h4>
                  <p>Environmental responsibility in every solution</p>
                </div>
              </div>
              <div className="value-item">
                <CheckCircle className="w-6 h-6" style={{ color: '#22c55e' }} />
                <div>
                  <h4>Impact</h4>
                  <p>Measurable positive change in communities</p>
                </div>
              </div>
            </div>
          </div>

          <div className="about-image">
            <div className="about-card">
              <BarChart3 className="w-16 h-16" style={{ color: '#3b82f6', width: '64px', height: '64px' }} />
              <h4>Data-Driven Decisions</h4>
              <p>Processing millions of data points daily to provide actionable insights</p>
            </div>
            <div className="about-card">
              <Activity className="w-16 h-16" style={{ color: '#22c55e', width: '64px', height: '64px' }} />
              <h4>Real-Time Monitoring</h4>
              <p>24/7 surveillance of crops, health metrics, and environmental factors</p>
            </div>
            <div className="about-card">
              <Lock className="w-16 h-16" style={{ color: '#8b5cf6', width: '64px', height: '64px' }} />
              <h4>Privacy First</h4>
              <p>End-to-end encryption and ethical AI practices</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section ref={solutionsRef} className="solutions-section">
        <div className="section-header solutions-header">
          <h2 className="section-title solutions-main-title">Our <span>Solutions</span></h2>
          <p className="section-subtitle solutions-main-subtitle">
            Comprehensive AI applications designed to solve real-world challenges
          </p>
        </div>

        <div className="solutions-grid">
          {solutions.map((solution, idx) => (
            <div
              key={idx}
              className="solution-card"
              onMouseEnter={() => setActiveSection(idx)}
            >
              <div className={`solution-icon bg-gradient-to-br ${solution.color}`}>
                {solution.icon}
              </div>
              <h3 className="solution-title">{solution.title}</h3>
              <p className="solution-description">{solution.description}</p>
              <button
                className="solution-btn"
                onClick={() => setActiveSolution(solution)}
              >
                Learn More <ArrowRight className="w-4 h-4" style={{ width: '16px', height: '16px' }} />
              </button>
              <div className="card-glow"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Goals Section */}
      <section ref={goalsRef} className="goals-section">
        <div className="section-header goals-header">
          <h2 className="section-title goals-main-title">Our <span>Goals</span></h2>
          <p className="section-subtitle goals-main-subtitle">
            Ambitious targets driving our mission forward
          </p>
        </div>

        <div className="goals-grid">
          {goals.map((goal, idx) => (
            <div key={idx} className="goal-card">
              <div className="goal-icon">{goal.icon}</div>
              <h3 className="goal-title">{goal.title}</h3>
              <p className="goal-description">{goal.description}</p>
              <div className="goal-progress">
                <div className="progress-bar-container">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <span className="progress-label">{goal.progress}% Complete</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className="team-section">
        <div className="section-header team-header">
          <h2 className="section-title team-main-title">The <span>Architect</span></h2>
          <p className="section-subtitle team-main-subtitle">
            Pioneering the intersection of Full-Stack and AI intelligence.
          </p>
        </div>

        <div className="team-grid">
          {team.map((member, idx) => (
            <div key={idx} className="team-card">
              <div className="team-avatar">
                {member.image}
              </div>
              <h3 className="team-name">{member.name}</h3>
              <p className="team-role">{member.role}</p>
              <p className="team-bio">{member.bio}</p>
              <div className="team-social">
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s LinkedIn profile`} className="linkedin-icon">
                  <Linkedin className="w-6 h-6" style={{ width: '24px', height: '24px' }} />
                </a>
                <a href={member.github} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s GitHub profile`} className="github-icon">
                  <Github className="w-6 h-6" style={{ width: '24px', height: '24px' }} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer ref={footerRef} className="footer">
        <div className="footer-content">
          <div className="footer-section brand-section">
            <EcoHealthLogo />
            <p className="footer-tagline">AI-powered solutions for a sustainable future</p>
            <p className="footer-copyright">
              © 2025 EcoHealth Sentinel. All rights reserved.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection(aboutRef); }}>About Us</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection(solutionsRef); }}>Solutions</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection(goalsRef); }}>Goals</a>
            <a href="#" onClick={(e) => { e.preventDefault(); scrollToSection(teamRef); }}>Team</a>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowPrivacyPolicy(true); }}>
              Privacy Policy
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowTermsOfService(true); }}>
              Terms of Service
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); setShowCookiePolicy(true); }}>
              Cookie Policy
            </a>
          </div>

          <div className="footer-section">
            <h4>Connect With Us</h4>
            <div className="social-links">
              <a
                href="https://github.com/RiteshKumar2e"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our GitHub profile"
                className="social-icon"
              >
                <Github className="w-6 h-6" style={{ width: '24px', height: '24px' }} />
              </a>
              <a
                href="https://www.linkedin.com/in/ritesh-kumar-b3a654253"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our LinkedIn profile"
                className="social-icon"
              >
                <Linkedin className="w-6 h-6" style={{ width: '24px', height: '24px' }} />
              </a>
              <a
                href="mailto:riteshkumar90359@gmail.com"
                aria-label="Send us an email"
                className="social-icon"
              >
                <Mail className="w-6 h-6" style={{ width: '24px', height: '24px' }} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {
        showScrollTop && (
          <button className="scroll-to-top" onClick={scrollToTop}>
            <ArrowUp className="w-6 h-6" />
          </button>
        )
      }

      {/* Sign In Popup */}
      {
        showSignInPopup && (
          <div className="popup-overlay">
            <div className="popup-card">
              <button className="popup-close" onClick={() => setShowSignInPopup(false)}>
                <X className="w-5 h-5" />
              </button>
              <h3>Sign In Required</h3>
              <p>To explore our advanced AI solutions, please sign in first.</p>
              <div className="popup-actions">
                <button
                  className="btn-primary"
                  onClick={() => navigate('/auth/login')}
                >
                  Sign In
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setShowSignInPopup(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Solution Details Modal */}
      {
        activeSolution && (
          <div
            className="popup-overlay"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div
              className="popup-card-large"
              onClick={(e) => e.stopPropagation()}
              role="document"
            >
              <button
                className="popup-close"
                onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
                }}
                aria-label="Close modal"
                type="button"
              >
                <X className="w-6 h-6" />
              </button>

              <div className={`popup-header bg-gradient-to-br ${activeSolution.color}`}>
                <div className="popup-icon-large">{activeSolution.icon}</div>
              </div>

              <div className="popup-content">
                <h3 id="modal-title" className="popup-title">
                  {activeSolution.title}
                </h3>
                <p className="popup-domain">{activeSolution.domain}</p>

                <p className="popup-full-description">
                  {activeSolution.fullDescription}
                </p>

                <div className="popup-features">
                  <h4>Key Features</h4>
                  <ul>
                    {activeSolution.features.map((feature, idx) => (
                      <li key={idx}>
                        <CheckCircle className="w-5 h-5" style={{ color: '#22c55e' }} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>


              </div>
            </div>
          </div>
        )
      }

      {/* Legal Modals */}
      <LegalModal
        isOpen={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        title="Privacy Policy"
        content={legalContent.privacyPolicy}
      />

      <LegalModal
        isOpen={showTermsOfService}
        onClose={() => setShowTermsOfService(false)}
        title="Terms of Service"
        content={legalContent.termsOfService}
      />

      <LegalModal
        isOpen={showCookiePolicy}
        onClose={() => setShowCookiePolicy(false)}
        title="Cookie Policy"
        content={legalContent.cookiePolicy}
      />
    </div>
  );
}