import React, { useState, useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router'; 
import '../style/interview.scss';
import { useInterview } from '../hooks/useInterview';
import Loader from '../../../components/Loader'; 

function Interview() {
  const { interviewId } = useParams(); 
  const navigate = useNavigate(); 
  
  const [activeTab, setActiveTab] = useState('technical');
  const [openIndex, setOpenIndex] = useState(0);
  
  const { report, loading, getReportById } = useInterview();

  useEffect(() => {
    if (!report && interviewId) {
      getReportById(interviewId);
    }
  }, [report, interviewId]); 

  if (loading || !report) {
    return <Loader message="Loading your interview report..." />
  }

  const handleAccordionClick = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const getMatchText = (score) => {
    if (score >= 80) return "Strong match for this role";
    if (score >= 60) return "Good match for this role";
    if (score >= 40) return "Moderate match for this role";
    return "Low match - Needs strong preparation";
  };

  const renderQuestions = (questions) => {
    return questions.map((item, index) => (
      <div className={`accordion-card ${openIndex === index ? 'open' : ''}`} key={index}>
        <div className="accordion-header" onClick={() => handleAccordionClick(index)}>
          <div className="header-left">
            <span className="q-badge">Q{index + 1}</span>
            <h3 className="question-text">{item.question}</h3>
          </div>
          <span className="arrow-icon">
            {openIndex === index ? '⌃' : '⌄'}
          </span>
        </div>
        <div className="accordion-body">
          <div className="label-badge intention-badge">INTENTION</div>
          <p className="body-text">{item.intention}</p>
          
          <div className="label-badge model-answer-badge">ANSWER</div>
          <p className="body-text">{item.answer}</p>
        </div>
      </div>
    ));
  };

  const renderRoadmap = () => {
    return report.preparationPlan.map((plan, index) => (
      <div className="accordion-card open" key={index} style={{ cursor: 'default' }}>
        <div className="accordion-header" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div className="header-left">
            <span className="q-badge">Day {plan.day}</span>
            <h3 className="question-text">{plan.focus}</h3>
          </div>
        </div>
        <div className="accordion-body" style={{ display: 'block' }}>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#b0bec5' }}>
            {plan.tasks.map((task, i) => (
              <li key={i} style={{ marginBottom: '0.5rem', lineHeight: '1.5' }}>{task}</li>
            ))}
          </ul>
        </div>
      </div>
    ));
  };

  return (
    <main className="interview-page">
      <div className="interview-dashboard">
        <aside className="left-sidebar">
            <button 
              className="back-home-btn"
              onClick={() => navigate('/')} >
              <span className="icon">←</span> Back to Home
            </button>

          <div className="sidebar-label">SECTIONS</div>
          <nav className="nav-menu">
            <button 
              className={`nav-item ${activeTab === 'technical' ? 'active' : ''}`}
              onClick={() => { setActiveTab('technical'); setOpenIndex(0); }}
            >
              <span className="icon">{'<>'}</span> Technical Questions
            </button>
            <button 
              className={`nav-item ${activeTab === 'behavioral' ? 'active' : ''}`}
              onClick={() => { setActiveTab('behavioral'); setOpenIndex(0); }}
            >
              <span className="icon">⚑</span> Behavioral Questions
            </button>
            <button 
              className={`nav-item ${activeTab === 'roadmap' ? 'active' : ''}`}
              onClick={() => setActiveTab('roadmap')}
            >
              <span className="icon">⬡</span> Road Map
            </button>
          </nav>
        </aside>

        <section className="main-content">
          <div className="content-header">
            <h2>
              {activeTab === 'technical' && 'Technical Questions'}
              {activeTab === 'behavioral' && 'Behavioral Questions'}
              {activeTab === 'roadmap' && 'Preparation Road Map'}
            </h2>
            <span className="count-badge">
              {activeTab === 'technical' && `${report.technicalQuestions.length} questions`}
              {activeTab === 'behavioral' && `${report.behavioralQuestions.length} questions`}
              {activeTab === 'roadmap' && `${report.preparationPlan.length} days`}
            </span>
          </div>
          
          <div className="questions-list">
            {activeTab === 'technical' && renderQuestions(report.technicalQuestions)}
            {activeTab === 'behavioral' && renderQuestions(report.behavioralQuestions)}
            {activeTab === 'roadmap' && renderRoadmap()}
          </div>
        </section>

        <aside className="right-sidebar">
          <div className="score-section">
            <div className="sidebar-label">MATCH SCORE</div>
            <div className="circular-progress">
              <svg viewBox="0 0 36 36" className="circular-chart">
                <path className="circle-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path className="circle"
                  strokeDasharray={`${report.matchScore}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="percentage">
                {report.matchScore}<span className="percent-sign">%</span>
              </div>
            </div>
            
            <p className="match-status">{getMatchText(report.matchScore)}</p>
            
          </div>

          <div className="skills-section">
            <div className="sidebar-label">SKILL GAPS</div>
            <div className="skills-container">
              {report.skillGaps.map((gap, index) => (
                <div className={`skill-pill ${gap.severity}`} key={index}>
                  {gap.skill}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Interview;