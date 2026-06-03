import { useState } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';

function App() {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const { username, email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await axios.post(endpoint, formData);
      if (isLogin) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        alert("Login Successful!");
      } else {
        alert("Registration Successful! Now please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Action Failed");
    }
  };

  if (user) {
    return <Dashboard user={user} setUser={setUser} />;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>DevPulse</h1>
        <p style={styles.subtitle}>{isLogin ? 'Welcome Back' : 'Create your account'}</p>

        <form onSubmit={onSubmit} style={styles.form}>
          {!isLogin && (
            <input 
              style={styles.input} 
              type="text" 
              placeholder="Username" 
              name="username" 
              value={username} 
              onChange={onChange} 
              required 
            />
          )}
          <input 
            style={styles.input} 
            type="email" 
            placeholder="Email" 
            name="email" 
            value={email} 
            onChange={onChange} 
            required 
          />
          <input 
            style={styles.input} 
            type="password" 
            placeholder="Password" 
            name="password" 
            value={password} 
            onChange={onChange} 
            required 
          />
          <button type="submit" style={styles.button}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p style={styles.toggleText}>
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <span 
            style={styles.link} 
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? ' Sign Up' : ' Login'}
          </span>
        </p>
      </div>
    </div>
  );
}

// --- ALL STYLES MUST BE HERE ---
const styles = {
  container: { 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh', 
    backgroundColor: '#f0f2f5', 
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' 
  },
  card: { 
    backgroundColor: '#fff', 
    padding: '40px', 
    borderRadius: '12px', 
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)', 
    width: '100%', 
    maxWidth: '380px', 
    textAlign: 'center' 
  },
  title: { 
    margin: '0 0 10px 0', 
    color: '#1c1e21', 
    fontSize: '32px', 
    fontWeight: 'bold' 
  },
  subtitle: { 
    color: '#606770', 
    marginBottom: '25px', 
    fontSize: '16px' 
  },
  form: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '15px' 
  },
  input: { 
    padding: '14px', 
    borderRadius: '8px', 
    border: '1px solid #dddfe2', 
    fontSize: '16px',
    outline: 'none'
  },
  button: { 
    padding: '12px', 
    backgroundColor: '#0866ff', 
    color: '#fff', 
    border: 'none', 
    borderRadius: '8px', 
    cursor: 'pointer', 
    fontSize: '18px', 
    fontWeight: 'bold',
    marginTop: '10px'
  },
  toggleText: { 
    marginTop: '25px', 
    fontSize: '15px', 
    color: '#606770' 
  },
  link: { 
    color: '#0866ff', 
    cursor: 'pointer', 
    fontWeight: '600',
    textDecoration: 'none'
  }
};

export default App;