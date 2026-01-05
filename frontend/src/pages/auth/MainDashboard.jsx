import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Stethoscope, Leaf, ArrowRight, CheckCircle, TrendingUp, Users, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const domains = [
    {
      id: 'agriculture',
      title: 'Agriculture',
      icon: Sprout,
      description: 'Smart farming solutions with AI-powered crop monitoring, yield prediction, and resources',
      color: '#10b981',
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.1) 100%)',
      stats: { projects: 145, users: '2.3K', growth: '+23%' }
    },
    {
      id: 'healthcare',
      title: 'Healthcare',
      icon: Stethoscope,
      description: 'Advanced medical diagnostics, patient care management, and predictive health analytics',
      color: '#3b82f6',
      bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%)',
      stats: { projects: 198, users: '4.1K', growth: '+31%' }
    },
    {
      id: 'environment',
      title: 'Environment',
      icon: Leaf,
      description: 'Climate monitoring, pollution tracking, and sustainability solutions for a greener future',
      color: '#8b5cf6',
      bgGradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.1) 100%)',
      stats: { projects: 87, users: '1.8K', growth: '+18%' }
    }
  ];

  const handleDomainSelect = (domainId) => {
    setSelectedDomain(domainId);
    if (domainId === 'agriculture') {
      navigate('/agriculture/profile');
    } else if (domainId === 'healthcare') {
      navigate('/healthcare/profile');
    } else {
      navigate(`/${domainId}/dashboard`);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      padding: '2rem 1rem'
    }}>
      {/* Header */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        marginBottom: '3rem'
      }}>
        <div style={{
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: '0.75rem'
          }}>
            Choose Your Domain
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Select a domain to access specialized AI solutions tailored to your industry needs
          </p>
        </div>

        {/* Stats Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          maxWidth: '900px',
          margin: '2rem auto 0'
        }}>
          {[
            { icon: BarChart3, label: 'Active Projects', value: '430+' },
            { icon: Users, label: 'Total Users', value: '8.2K' },
            { icon: TrendingUp, label: 'Avg Growth', value: '+24%' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '1.25rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderRadius: '12px',
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <stat.icon style={{ width: '24px', height: '24px', color: '#2563eb' }} />
              </div>
              <div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{stat.label}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>{stat.value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Domain Cards */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem'
      }}>
        {domains.map((domain) => {
          const Icon = domain.icon;
          const isHovered = hoveredCard === domain.id;
          const isSelected = selectedDomain === domain.id;

          return (
            <div
              key={domain.id}
              onMouseEnter={() => setHoveredCard(domain.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleDomainSelect(domain.id)}
              style={{
                position: 'relative',
                backgroundColor: '#ffffff',
                borderRadius: '24px',
                padding: '2.5rem',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transform: isHovered ? 'translateY(-8px)' : 'translateY(0)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isHovered ? `0 20px 25px -5px ${domain.color}22` : '0 10px 15px -3px rgba(0, 0, 0, 0.05)',
                background: isHovered ? domain.bgGradient.replace('rgba', 'rgba').replace('0.2', '0.05') : '#ffffff'
              }}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  backgroundColor: domain.color,
                  borderRadius: '50%',
                  padding: '0.25rem'
                }}>
                  <CheckCircle style={{ width: '20px', height: '20px', color: '#fff' }} />
                </div>
              )}

              {/* Icon */}
              <div style={{
                display: 'inline-flex',
                padding: '1.25rem',
                backgroundColor: `${domain.color}22`,
                borderRadius: '16px',
                marginBottom: '1.5rem',
                border: `1px solid ${domain.color}44`
              }}>
                <Icon style={{ width: '40px', height: '40px', color: domain.color }} />
              </div>

              {/* Content */}
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: '#0f172a',
                marginBottom: '0.75rem'
              }}>
                {domain.title}
              </h2>

              <p style={{
                color: '#64748b',
                fontSize: '0.95rem',
                lineHeight: '1.6',
                marginBottom: '1.5rem'
              }}>
                {domain.description}
              </p>

              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #f1f5f9'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Projects</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a' }}>{domain.stats.projects}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Users</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a' }}>{domain.stats.users}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.25rem' }}>Growth</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: domain.color }}>{domain.stats.growth}</div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handleDomainSelect(domain.id)}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  backgroundColor: domain.color,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  opacity: isHovered ? 1 : 0.9,
                  transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{domain.id === 'agriculture' || domain.id === 'healthcare' ? 'My Profile' : `Explore ${domain.title}`}</span>
                <ArrowRight style={{
                  width: '20px',
                  height: '20px',
                  transform: isHovered ? 'translateX(4px)' : 'translateX(0)',
                  transition: 'transform 0.2s ease'
                }} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div style={{
        maxWidth: '1400px',
        margin: '3rem auto 0',
        textAlign: 'center',
        color: '#64748b',
        fontSize: '0.875rem'
      }}>
        <p>Select a domain to access advanced AI tools, analytics, and insights</p>
      </div>
    </div>
  );
}
