import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, TrendingUp, Users, Target, Award, Leaf, Sparkles, ArrowRight, CheckCircle, Clock, ChevronRight, RefreshCw } from 'lucide-react';
import './AwarenessHub.css';

export default function AwarenessHub() {
  const navigate = useNavigate();

  const [campaigns, setCampaigns] = useState([]);
  const [educationModules, setEducationModules] = useState([]);
  const [communityStats, setCommunityStats] = useState(null);
  const [selectedTab, setSelectedTab] = useState('campaigns');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE_URL = 'http://localhost:5000/api';

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [campaignsRes, modulesRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/environment/campaigns`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }),
        fetch(`${API_BASE_URL}/environment/education-modules`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        }),
        fetch(`${API_BASE_URL}/environment/community-stats`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        })
      ]);

      if (!campaignsRes.ok || !modulesRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch data from server');
      }

      const campaignsData = await campaignsRes.json();
      const modulesData = await modulesRes.json();
      const statsData = await statsRes.json();

      setCampaigns(campaignsData.data || campaignsData || []);
      setEducationModules(modulesData.data || modulesData || []);
      setCommunityStats(statsData.data || statsData || null);

    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message || 'Failed to load data from server');
      loadDummyData();
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadDummyData = () => {
    setCampaigns([]);
    setEducationModules([]);
    setCommunityStats(null);
  };

  const handleJoinCampaign = async (campaignId) => {
    try {
      const userId = localStorage.getItem('userId') || 'guest-user';

      const response = await fetch(`${API_BASE_URL}/environment/campaigns/${campaignId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ userId })
      });

      if (!response.ok) {
        throw new Error('Failed to join campaign');
      }

      const result = await response.json();

      setCampaigns(prev => prev.map(c =>
        c.id === campaignId ? { ...c, participants: c.participants + 1 } : c
      ));

      alert(result.message || 'Successfully joined the campaign!');
      fetchAllData();

    } catch (err) {
      console.error('Error joining campaign:', err);
      alert(err.message || 'Failed to join campaign. Please try again.');
    }
  };

  const handleStartLearning = async (moduleId) => {
    try {
      const userId = localStorage.getItem('userId') || 'guest-user';

      await fetch(`${API_BASE_URL}/environment/education-modules/${moduleId}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ userId })
      });

      navigate(`/environment/education/${moduleId}`);

    } catch (err) {
      console.error('Error enrolling in module:', err);
      navigate(`/environment/education/${moduleId}`);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  const handleViewRecommendations = () => {
    navigate('/environment/recommendations');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="flex-col flex-center">
          <div className="loading-spinner"></div>
          <p className="mt-16 text-gray-500 text-base text-center">Loading awareness hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="awareness-container">
      <div className="max-w-1400">
        {/* Header */}
        <div className="header-card">
          <div className="flex-between flex-wrap gap-16 mb-12">
            <div className="flex-center gap-16">
              <div className="header-icon-box-green">
                <Leaf size={32} />
              </div>
              <div>
                <h1 className="text-5xl font-extrabold text-gray-800 mb-8 m-0">
                  Environmental Awareness Hub
                </h1>
                <p className="text-gray-500 m-0 text-lg">
                  Empowering communities through education and collective action
                </p>
              </div>
            </div>
            <button
              className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw size={18} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Community Stats */}
        {communityStats && (
          <div className="grid grid-cols-stats gap-20 mb-32">
            <div className="stat-card">
              <div className="flex-between flex-start">
                <div>
                  <p className="text-sm text-gray-500 font-semibold uppercase ls-0-5 mb-8">Total Members</p>
                  <p className="text-4xl font-extrabold text-green-500 m-0">{communityStats.totalMembers.toLocaleString()}</p>
                </div>
                <Users className="stat-icon text-green-500 opacity-0-2" size={48} />
              </div>
            </div>

            <div className="stat-card">
              <div className="flex-between flex-start">
                <div>
                  <p className="text-sm text-gray-500 font-semibold uppercase ls-0-5 mb-8">Active Campaigns</p>
                  <p className="text-4xl font-extrabold text-blue-500 m-0">{communityStats.activeCampaigns}</p>
                </div>
                <Target className="stat-icon text-blue-500 opacity-0-2" size={48} />
              </div>
            </div>

            <div className="stat-card">
              <div className="flex-between flex-start">
                <div>
                  <p className="text-sm text-gray-500 font-semibold uppercase ls-0-5 mb-8">Total Impact</p>
                  <p className="text-2xl font-extrabold text-purple-500 m-0">{communityStats.totalImpact}</p>
                </div>
                <TrendingUp className="stat-icon text-purple-500 opacity-0-2" size={48} />
              </div>
            </div>

            <div className="stat-card">
              <div className="flex-between flex-start">
                <div>
                  <p className="text-sm text-gray-500 font-semibold uppercase ls-0-5 mb-8">Engagement Rate</p>
                  <p className="text-4xl font-extrabold text-orange-500 m-0">{communityStats.engagementRate}%</p>
                </div>
                <Award className="stat-icon text-orange-500 opacity-0-2" size={48} />
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="tab-container">
          <div className="flex border-b-gray-200">
            <button
              onClick={() => setSelectedTab('campaigns')}
              className={`tab-button ${selectedTab === 'campaigns' ? 'active' : ''}`}
            >
              Community Campaigns
            </button>
            <button
              onClick={() => setSelectedTab('education')}
              className={`tab-button ${selectedTab === 'education' ? 'active' : ''}`}
            >
              Education Modules
            </button>
          </div>

          <div className="p-32">
            {selectedTab === 'campaigns' && (
              <div className="flex-col gap-24">
                {campaigns.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <Target size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-8">No Active Campaigns</h3>
                    <p>Check back soon for new environmental campaigns!</p>
                  </div>
                ) : (
                  campaigns.map((campaign) => (
                    <div key={campaign.id} className="campaign-card">
                      <div className="flex-between flex-start mb-20">
                        <div className="flex-1">
                          <h3 className="text-3xl font-extrabold text-gray-800 mb-8 m-0">{campaign.title}</h3>
                          <div className="flex items-center gap-12 flex-wrap">
                            <span className="text-base text-gray-500 font-semibold">{campaign.category}</span>
                            {campaign.endDate && (
                              <div className="info-badge">
                                <Clock size={14} />
                                <span>Ends {new Date(campaign.endDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>
                          {campaign.description && (
                            <p className="text-base text-gray-500 mt-8 lh-1-5">{campaign.description}</p>
                          )}
                        </div>
                        <span className={`status-badge text-white ${campaign.status === 'active' ? 'status-active' : 'bg-gray-400'}`}>
                          {campaign.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-cards gap-20 mb-20">
                        <div className="bg-trans-green-1 br-12 p-16">
                          <p className="text-sm text-gray-500 font-semibold mb-4">Participants</p>
                          <p className="text-3xl font-extrabold text-green-500 m-0">{campaign.participants.toLocaleString()}</p>
                        </div>
                        <div className="bg-trans-blue-1 br-12 p-16">
                          <p className="text-sm text-gray-500 font-semibold mb-4">Impact Achieved</p>
                          <p className="text-2xl font-extrabold text-blue-500 m-0">{campaign.impact}</p>
                        </div>
                      </div>

                      <div className="mb-20">
                        <div className="flex-between mb-8">
                          <span className="text-base text-gray-500 font-semibold">Campaign Progress</span>
                          <span className="text-lg font-extrabold text-gray-800">{campaign.progress}%</span>
                        </div>
                        <div className="progress-container">
                          <div
                            className="progress-fill"
                            style={{ width: `${campaign.progress}%` }}
                          ></div>
                        </div>
                      </div>

                      <button
                        className="btn-primary"
                        onClick={() => handleJoinCampaign(campaign.id)}
                      >
                        <div className="flex-center gap-8 pos-relative z-1">
                          <span>Join Campaign</span>
                          <ArrowRight size={20} />
                        </div>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {selectedTab === 'education' && (
              <div className="flex-col gap-24">
                {educationModules.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      <Sparkles size={40} className="text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-8">No Modules Available</h3>
                    <p>New learning modules coming soon!</p>
                  </div>
                ) : (
                  educationModules.map((module) => (
                    <div key={module.id} className="module-card">
                      <div className="flex-between flex-start mb-20">
                        <div className="flex-1">
                          <h3 className="text-3xl font-extrabold text-gray-800 mb-12 m-0">{module.title}</h3>
                          {module.description && (
                            <p className="text-base text-gray-500 mb-12 lh-1-5">{module.description}</p>
                          )}
                          <div className="flex items-center gap-16 flex-wrap">
                            <div className="rating-stars">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`star ${i < Math.floor(module.rating) ? 'filled' : 'empty'}`}>
                                  ★
                                </span>
                              ))}
                              <span className="text-base text-gray-500 font-semibold ml-8">
                                {module.rating} / 5.0
                              </span>
                            </div>
                            {module.duration && (
                              <div className="info-badge text-gray-800 bg-badge-purple">
                                <Clock size={14} />
                                <span>{module.duration}</span>
                              </div>
                            )}
                            {module.level && (
                              <div className="info-badge text-gray-800 bg-badge-blue">
                                <Sparkles size={14} />
                                <span>{module.level}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="bg-trans-purple-1 br-12 p-20 mb-20">
                        <div className="flex-center gap-12">
                          <CheckCircle size={24} className="text-purple-500" />
                          <div>
                            <p className="text-sm text-gray-500 font-semibold mb-4">Completed by</p>
                            <p className="text-4xl font-extrabold text-purple-500 m-0">{module.completed.toLocaleString()} learners</p>
                          </div>
                        </div>
                      </div>

                      <button
                        className="btn-secondary"
                        onClick={() => handleStartLearning(module.id)}
                      >
                        <div className="flex-center gap-8 pos-relative z-1">
                          <span>Start Learning</span>
                          <ChevronRight size={20} />
                        </div>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* AI-Powered Insights */}
        <div className="insight-card">
          <div className="flex-start gap-20">
            <div className="w-64 h-64 br-16 bg-trans-white-2 flex-center flex-shrink-0 backdrop-blur-10">
              <AlertCircle size={32} />
            </div>
            <div className="flex-1 pos-relative z-1">
              <h3 className="text-4xl font-extrabold mb-16">AI-Powered Community Insights</h3>
              <p className="text-lg lh-1-7 mb-24 opacity-0-95">
                Our AI analyzes community engagement patterns to recommend personalized campaigns and educational content.
                Based on your location, we've identified water conservation and sustainable agriculture
                as priority areas with high community interest and potential for social impact.
              </p>
              <button
                onClick={handleViewRecommendations}
                className="insight-btn"
              >
                View Personalized Recommendations
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="alert-message">
            <strong>⚠️ Note:</strong> {error}. Displaying sample data for demonstration.
          </div>
        )}
      </div>
    </div>
  );
}
