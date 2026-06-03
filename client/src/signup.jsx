import { useState } from 'react';
import axios from 'axios';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });

    const { username, email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/register', formData);
            alert(res.data.message);
        } catch (err) {
            alert(err.response?.data?.message || "Signup Failed");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '400px' }}>
            <h2>Create Account</h2>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} required /><br/><br/>
                <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required /><br/><br/>
                <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required /><br/><br/>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Signup;