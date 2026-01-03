import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Droplet,
  Sun,
  DollarSign,
  X,
  Calendar,
  Layers,
  Search,
  Plus,
  Trash2
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './Reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [generatingType, setGeneratingType] = useState(null);
  const [notification, setNotification] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setIsDataLoading(true);
      const response = await fetch('/api/agriculture/reports');
      if (response.ok) {
        setReports(await response.json());
      } else {
        showNotification('Failed to fetch reports from server', 'error');
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      showNotification('Server connection error', 'error');
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleGenerateReport = async (reportType) => {
    if (generatingType) return;
    setGeneratingType(reportType);
    showNotification(`Generating AI Report: ${reportType}...`, 'success');

    try {
      const response = await fetch('/api/agriculture/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reportType })
      });

      if (response.ok) {
        const newReport = await response.json();
        setReports(prev => [newReport, ...prev]);
        showNotification(`${reportType} has been generated successfully!`, 'success');
      } else {
        showNotification('Failed to generate report on server', 'error');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      showNotification('Server error during report generation', 'error');
    } finally {
      setGeneratingType(null);
    }
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;

    try {
      const response = await fetch(`/api/agriculture/reports/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setReports(prev => prev.filter(r => r._id !== id));
        showNotification('Report deleted successfully', 'success');
      } else {
        showNotification('Failed to delete report on server', 'error');
      }
    } catch (error) {
      console.error('Error deleting report:', error);
      showNotification('Server error during deletion', 'error');
    }
  };

  const handleDownload = (report) => {
    showNotification(`Preparing ${report.name} for download...`, 'success');

    try {
      const doc = new jsPDF();

      // Header Branding
      doc.setFillColor(16, 185, 129); // Agri Green
      doc.rect(0, 0, 210, 40, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('EcoHealth Sentinel', 15, 20);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Smart Agriculture Analytics Report', 15, 30);

      // Report Meta Data
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(report.name, 15, 55);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${report.date}`, 15, 62);
      doc.text(`Report Category: ${report.type}`, 15, 67);
      doc.text(`Security Level: Confidencial`, 15, 72);

      // Horizontal Line
      doc.setDrawColor(226, 232, 240);
      doc.line(15, 78, 195, 78);

      // Section Content based on type
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Analysis Overview', 15, 90);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const overviewText = `This report provides a comprehensive analysis of ${report.type.toLowerCase()} for the specified period. Our AI models have processed various data points including soil moisture, satellite imagery, and weather patterns to provide these actionable insights.`;
      const splitText = doc.splitTextToSize(overviewText, 180);
      doc.text(splitText, 15, 98);

      // Table Data
      const tableData = [
        ['Metric Name', 'Value', 'Unit', 'Trend'],
        ['Production Target', '52.4', 'Tons', 'Up 12%'],
        ['Resource Efficiency', '94.2', '%', 'Stable'],
        ['Environmental Impact', 'Low', 'N/A', 'Improved'],
        ['AI Confidence Score', '98.5', '%', 'High']
      ];

      autoTable(doc, {
        startY: 115,
        head: [['Metric Name', 'Value', 'Unit', 'Trend']],
        body: tableData.slice(1),
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 10, cellPadding: 5 }
      });

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184);
        doc.text('© 2026 EcoHealth Sentinel - AgriAI Systems', 105, 285, { align: 'center' });
        doc.text(`Page ${i} of ${pageCount}`, 195, 285, { align: 'right' });
      }

      // Download
      doc.save(`${report.name.replace(/\s+/g, '_')}.pdf`);
      showNotification('PDF downloaded successfully!', 'success');

    } catch (error) {
      console.error('PDF Generation Error:', error);
      showNotification('Failed to generate PDF. Check console.', 'error');
    }
  };

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const reportOptions = [
    { title: 'Crop Yield Analysis', icon: TrendingUp, color: '#10B981', bg: '#D1FAE5', desc: 'Detailed analysis of yield patterns and productivity forecasts.' },
    { title: 'Soil Health Report', icon: Layers, color: '#F59E0B', bg: '#FEF3C7', desc: 'Nutrient levels, pH balance, and recommended soil treatments.' },
    { title: 'Water Usage Tracking', icon: Droplet, color: '#3B82F6', bg: '#DBEAFE', desc: 'Consumption metrics, efficiency scores, and cost saving analysis.' },
    { title: 'Market Trend Report', icon: DollarSign, color: '#EF4444', bg: '#FEE2E2', desc: 'Real-time crop prices, demand trends, and selling window suggestions.' }
  ];

  return (
    <div className="reports-container">
      {/* Notification Toast */}
      {notification && (
        <div className={`notification-toast fade-in ${notification.type === 'success' ? 'notif-success' : 'notif-error'}`}>
          {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)}><X size={16} /></button>
        </div>
      )}

      <div className="reports-content-wrapper">
        {/* Header Section */}
        <header className="reports-header">
          <div className="header-info">
            <div className="header-icon-box">
              <FileText size={32} color="white" />
            </div>
            <div>
              <h1>Agricultural Reports</h1>
              <p>Generate and manage your smart farming intelligence</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-label">Total Reports</span>
              <span className="stat-value">{reports.length}</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-label">Storage Used</span>
              <span className="stat-value">5.7 MB</span>
            </div>
          </div>
        </header>

        {/* Report Generation Quick Actions */}
        <section className="generation-section">
          <div className="section-title">
            <h2>Generate New Report</h2>
            <p>Select a data source to generate instant AI-powered insights</p>
          </div>
          <div className="generator-grid">
            {reportOptions.map((option, idx) => (
              <div key={idx} className="generator-card">
                <div className="card-icon" style={{ backgroundColor: option.bg, color: option.color }}>
                  <option.icon size={28} />
                </div>
                <h3>{option.title}</h3>
                <p>{option.desc}</p>
                <button
                  className="generate-btn"
                  disabled={generatingType !== null}
                  onClick={() => handleGenerateReport(option.title)}
                >
                  {generatingType === option.title ? 'Processing...' : (generatingType ? 'Please wait' : <><Plus size={18} /> Generate</>)}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Reports Archive */}
        <section className="archive-section">
          <div className="archive-header">
            <div className="section-title">
              <h2>Recent Reports</h2>
              <p>Your library of previously generated agricultural analysis</p>
            </div>
            <div className="search-box">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="reports-list-card">
            <table className="reports-table">
              <thead>
                <tr>
                  <th>Report Name</th>
                  <th>Category</th>
                  <th>Date Generated</th>
                  <th>Size</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {isDataLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="report-row skeleton-row">
                      <td colSpan="6" style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                        Loading reports...
                      </td>
                    </tr>
                  ))
                ) : filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr key={report._id} className="report-row">
                      <td className="report-name-cell">
                        <FileText size={18} className="name-icon" />
                        <span>{report.name}</span>
                      </td>
                      <td><span className="category-badge">{report.type}</span></td>
                      <td>
                        <div className="date-cell">
                          <Calendar size={14} />
                          {report.date}
                        </div>
                      </td>
                      <td>{report.size}</td>
                      <td><span className="status-badge">{report.status}</span></td>
                      <td className="actions-cell">
                        <button className="download-icon-btn" onClick={() => handleDownload(report)} title="Download PDF">
                          <Download size={18} />
                        </button>
                        <button className="delete-icon-btn" onClick={() => handleDeleteReport(report._id)} title="Delete Report">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <div className="empty-state-content fade-in">
                        <FileText size={48} strokeWidth={1} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                        <span className="empty-state-text">No reports found matching your search.</span>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Try adjusting your keywords or generate a new report above.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Reports;