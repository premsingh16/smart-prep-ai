import React, { useState, useRef, useEffect } from 'react' 
import '../style/home.scss'
import { useInterview } from '../hooks/useInterview'
import { useNavigate } from 'react-router'
import Loader from '../../../components/Loader'; 
import { useAuth } from '../../auth/hooks/useAuth'

function Home() {
  const { loading, generateReport, reports, getReports } = useInterview()
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState(null); 
  
  const [isGenerating, setIsGenerating] = useState(false);
  
  const resumeInputRef = useRef()
  const navigate = useNavigate()

  useEffect(() => {
    getReports();
  }, []);

  const { handleLogout } = useAuth();
  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current?.files[0];
    
    // STRICT VALIDATION: All three components are required
    if (!jobDescription || !selfDescription || !resumeFile) {
      alert("Please provide the Job Description, a Self Description, AND upload your Resume to continue.");
      return;
    }
   
    setIsGenerating(true);
    
    try {
      const data = await generateReport({ jobDescription, selfDescription, resumeFile });
      if (data && data._id) {
        navigate(`/interview/${data._id}`);
      }
    } catch (error) {
      console.error("Report generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  if (loading || isGenerating) {
    return <Loader message={isGenerating ? "Generating your interview plan..." : "Loading..."} />
  }

  return (
    <main className="home">
      
     
      <div className="logout-container">
        <button 
          className="logout-btn"
          onClick={async () => { 
            await handleLogout(); 
            navigate('/login'); 
          }} 
        >
          Logout
        </button>
      </div>
      <div className="header">
        <h1>Create Your Custom <span>Interview Plan</span></h1>
        <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
      </div>

      <div className="interview-card">
        <div className="card-content">
  
          <div className="left-col">
            <div className="col-header">
              <div className="title-group">
                <span className="icon">💼</span>
                <h2>Target Job Description</h2>
              </div>
            </div>
            <textarea
              onChange={(e)=> {setJobDescription(e.target.value)}}
              id='jobDescription'
              name='jobDescription'
              value={jobDescription}
              placeholder="Paste the full job description here...&#10;e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
            ></textarea>
            {/* DYNAMIC CHARACTER COUNT */}
            <div className="char-count">
              {jobDescription.length} / 5000 chars
            </div>
          </div>

          <div className="right-col">
            <div className="col-header">
              <div className="title-group">
                <span className="icon">👤</span>
                <h2>Your Profile</h2>
              </div>
            </div>

            <div className="upload-section">
              <div className="upload-header">
                <h3>Upload Resume</h3>
              </div>
              
              <label 
                className="upload-box" 
                htmlFor="resume-upload"
                style={{ borderColor: selectedFile ? '#4facfe' : 'rgba(255,255,255,0.1)' }}
              >
                {selectedFile ? (
                  <div className="uploaded-file-view">
                    <span className="upload-icon">📄</span>
                    <p className="upload-title" style={{ color: '#4facfe', fontWeight: 'bold' }}>
                      {selectedFile.name}
                    </p>
                    <p className="upload-subtitle">Click to change file</p>
                  </div>
                ) : (
                  <>
                    <span className="upload-icon">☁️</span>
                    <p className="upload-title">Click to upload or drag & drop</p>
                    <p className="upload-subtitle">PDF or DOCX (Max 3MB)</p>
                  </>
                )}
                
                <input 
                  ref={resumeInputRef}  
                  type="file" 
                  id="resume-upload" 
                  hidden 
                  accept=".pdf,.docx" 
                  onChange={handleFileChange} 
                />
              </label>
            </div>

            <div className="divider">
              <span>AND</span>
            </div>
            
            <div className="self-desc-section">
              <div className="upload-header">
                <h3>Quick Self-Description</h3>
              </div>
              <textarea
                onChange={(e)=> {setSelfDescription(e.target.value)}}
                id='selfDescription'
                name='selfDescription'
                value={selfDescription}
                placeholder="Briefly describe your experience, key skills, and years of experience..."
              ></textarea>
            </div>

            <div className="info-banner">
              <span className="info-icon">ℹ️</span>
              <p><strong>Resume</strong>, <strong>Job Description</strong>, and <strong>Self Description</strong> are strictly required to generate a personalized plan.</p>
            </div>
          </div>
        </div>

        <div className="card-footer">
          <span className="footer-note">AI-Powered Strategy Generation • Approx 30s</span>
          <button 
          onClick={handleGenerateReport}
          className="generate-btn">
            ★ Generate My Interview Strategy
          </button>
        </div>
      </div>

      <div className="recent-reports-container">
        <h2>Your Recent Reports</h2>
        
        {reports && reports.length > 0 ? (
          <div className="reports-grid">
            {reports.map((report) => (
              <div 
                key={report._id} 
                className="report-card"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                <h3>
                  {report.title || 'Untitled Role'}
                </h3>
                
                <div className="report-card-footer">
                  <span className="match-badge">
                    Match: {report.matchScore}%
                  </span>
                  <span className="date-text">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-reports-msg">
            No recent reports found. Generate one above to get started!
          </p>
        )}
      </div>

      <div className="page-footer">
        <a href="https://github.com/premsingh16" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
        <a href="https://www.linkedin.com/in/prem-singh-chauhan" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href="mailto:premsinghchauhan06531@gmail.com">
          Contact Me
        </a>
      </div>
    </main>
  )
}

export default Home