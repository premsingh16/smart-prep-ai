import React, { useState } from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import Loader from '../../../components/Loader'
import { Eye, EyeOff } from 'lucide-react'

function Register() {
  const navigate = useNavigate()

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')
  const [error, setError] = useState('') 
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
   
  const {loading, handleRegister} = useAuth()

  const handleSubmit = async (e) =>{
    e.preventDefault()
    setError('') 
    setIsSubmitting(true)
    
    try {
        await handleRegister({username, email, password})
        navigate('/')
    } catch(err) {
        setError(err.response?.data?.message || "Registration failed. Please try again.")
        setIsSubmitting(false) 
    }
  }

  if (loading || isSubmitting) {
      return <Loader message={isSubmitting ? "Creating your account..." : "Loading..."} />
  }

  return (
    <main>
        <div className="from-containter">
            <h1>Register</h1>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                 <div className="input-group">
                    <label htmlFor="username">Username</label>
                    <input onChange={(e) => {setUsername(e.target.value)}} required
                    type="text" id="username" name="username" placeholder='Enter username ' />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input onChange={(e) => {setEmail(e.target.value)}} required
                      type="email" id="email" name="email" placeholder='Enter email address' />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-wrapper">
                        <input 
                            onChange={(e) => {setPassword(e.target.value)}} required
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            name="password" 
                            placeholder='Enter password' 
                        />
                        <span 
                            className="eye-icon" 
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                        </span>
                    </div>
                </div>
               <button className='button primary-button'>Register</button>
            </form>
            <p>Already have an Account? <Link to={'/login'}>Login</Link></p>
        </div>
    </main>
  )
}

export default Register