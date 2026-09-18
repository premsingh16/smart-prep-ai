import React, { useState } from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import Loader from '../../../components/Loader'
import { Eye, EyeOff } from 'lucide-react' // Lucide import

function Login() {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()
    
    const [email, setEmail] = useState('') 
    const [password, setPassword] = useState('') 
    const [error, setError] = useState('') 
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('') 
        setIsSubmitting(true)

        try {
            await handleLogin({email, password})
            navigate('/') 
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please try again.")
            setIsSubmitting(false) 
        }
    }

    if (loading || isSubmitting) {
        return <Loader message={isSubmitting ? "Logging you in..." : "Loading..."} />
    }

  return (
    <main>
        <div className="from-containter">
            <h1>Login</h1>
            
            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input onChange={(e) => {setEmail(e.target.value)}}
                     type="email" id="email" name="email" placeholder='Enter email address' required />
                </div>
                
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-wrapper">
                        <input 
                            onChange={(e) => {setPassword(e.target.value)}}
                            type={showPassword ? "text" : "password"} 
                            id="password" 
                            name="password" 
                            placeholder='Enter password' 
                            required 
                        />
                        <span 
                            className="eye-icon" 
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {/* Lucide Icons conditionally render ho rahe hain */}
                            {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                        </span>
                    </div>
                </div>
               <button className='button primary-button'>Login</button>
            </form>
            <p>Don't have an Account? <Link to={'/register'}>register</Link></p>
        </div>
    </main>
  )
}

export default Login