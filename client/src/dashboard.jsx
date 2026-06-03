import AIAnalysisModule from './AIAnalysisModule';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ user, setUser }) => {
    const [projects, setProjects] = useState([]);
    const [news, setNews] = useState([]); // Move this inside
    const [formData, setFormData] = useState({
        name: '',
        techStack: '',
        status: 'Planned'
    });

    const { name, techStack, status } = formData;

    // 1. Fetch Projects
    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('http://localhost:5000/api/projects', {
                headers: { 'x-auth-token': token }
            });
            setProjects(res.data);
        } catch (err) {
            console.error("Error fetching projects");
        }
    };

    // 2. Fetch News
    const fetchNews = async () => {
        try {
            const token = localStorage.getItem('token'); // Get the token
            const res = await axios.get('http://localhost:5000/api/news', {
                headers: { 'x-auth-token': token } // Send the token
            });
            setNews(res.data);
        } catch (err) {
            console.error("Error fetching news");
        }
    };

    // 3. Effect Hook (Runs on mount)
    useEffect(() => {
        fetchProjects();
        fetchNews();
    }, []);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('http://localhost:5000/api/projects', formData, {
                headers: { 'x-auth-token': token }
            });
            setProjects([res.data, ...projects]);
            setFormData({ name: '', techStack: '', status: 'Planned' });
        } catch (err) {
            alert("Failed to add project");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <div style={styles.container}>
            <div style={styles.sidebar}>
                <h2 style={styles.logo}>DevPulse</h2>
                <p style={styles.userInfo}>👤 {user.username}</p>
                <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>

            <div style={styles.mainContent}>
                {/* Add Project Section */}
                <div style={styles.formCard}>
                    <h3 style={{marginTop: 0, color: '#1c1e21'}}>Create New Project</h3>
                    <form onSubmit={onSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <input style={styles.input} type="text" placeholder="Project Name" name="name" value={name} onChange={onChange} required />
                            <input style={styles.input} type="text" placeholder="Tech Stack (e.g. MERN, Java)" name="techStack" value={techStack} onChange={onChange} required />
                            <select style={styles.input} name="status" value={status} onChange={onChange}>
                                <option value="Planned">Planned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>
                        <button type="submit" style={styles.addBtn}>+ Add to Pulse</button>
                    </form>
                </div>

                {/* Two-Column Grid */}
                <div style={styles.dashboardGrid}>
                    
                    {/* Column A: Projects */}
                    <div style={styles.projectSection}>
                        <h3 style={styles.sectionHeader}>Your Project Pulse</h3>
                        <div style={styles.projectList}>
                            {projects.length === 0 ? <p style={{color: '#65676b'}}>Start by adding a project above!</p> : (
                                projects.map(proj => (
                                    <div key={proj._id} style={styles.projectCard}>
                                        <h4 style={styles.projectTitle}>{proj.name}</h4>
                                        <p style={styles.projectStack}><strong>Stack:</strong> {proj.techStack}</p>
                                        <span style={{...styles.badge, backgroundColor: proj.status === 'Completed' ? '#d4edda' : '#fff3cd'}}>
                                            {proj.status}
                                        </span>

                                        {/* 🚀 AI ENGINE HOOK INJECTED HERE */}
                                        <AIAnalysisModule 
                                            project={proj} 
                                            onUpdate={(updatedProj) => {
                                                setProjects(projects.map(p => p._id === updatedProj._id ? updatedProj : p));
                                            }} 
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Column B: Live News */}
                    <div style={styles.newsSection}>
                        <h3 style={styles.sectionHeader}>🔥 Trending Tech</h3>
                        {news.length === 0 ? (
                            <p style={{color: '#65676b', fontSize: '14px'}}>Fetching latest updates...</p>
                        ) : (
                            news.map((article, index) => (
                                <div key={index} style={styles.newsCard}>
                                    <h4 style={styles.newsTitle}>{article.title}</h4>
                                    <p style={styles.newsSnippet}>
                                        {article.description ? article.description.slice(0, 100) : "No description available"}...
                                    </p>
                                    <a href={article.url} target="_blank" rel="noreferrer" style={{textDecoration: 'none'}}>
                                        <button style={styles.discussBtn}>Read More</button>
                                    </a>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

const styles = {
    container: { display: 'flex', width: '100vw', minHeight: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Segoe UI, sans-serif', margin: 0, padding: 0, overflowX: 'hidden' },
    sidebar: { width: '260px', minWidth: '260px', backgroundColor: '#18191a', color: '#fff', padding: '30px 20px', display: 'flex', flexDirection: 'column', height: '100vh', position: 'fixed', left: 0, top: 0, boxShadow: '2px 0 5px rgba(0,0,0,0.1)' },
    mainContent: { flex: 1, marginLeft: '260px', padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh' },
    logo: { color: '#0866ff', fontSize: '28px', fontWeight: 'bold', marginBottom: '40px', letterSpacing: '1px' },
    userInfo: { fontSize: '16px', marginBottom: '20px', color: '#b0b3b8', borderBottom: '1px solid #3a3b3c', paddingBottom: '20px' },
    logoutBtn: { marginTop: 'auto', padding: '12px', backgroundColor: '#e41e3f', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.3s' },
    formCard: { backgroundColor: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: '40px' },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { display: 'flex', gap: '10px' },
    input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', flex: 1, backgroundColor: '#f9f9f9' },
    addBtn: { padding: '12px', backgroundColor: '#0866ff', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
    dashboardGrid: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', alignItems: 'start' },
    sectionHeader: { fontSize: '20px', marginBottom: '20px', color: '#1c1e21', borderBottom: '2px solid #0866ff', paddingBottom: '5px', display: 'inline-block' },
    projectList: { display: 'grid', gridTemplateColumns: '1fr', gap: '15px' },
    projectCard: { backgroundColor: '#fff', padding: '18px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderLeft: '5px solid #0866ff' },
    projectTitle: { margin: 0, fontSize: '18px', color: '#1c1e21', textTransform: 'capitalize' },
    projectStack: { fontSize: '14px', color: '#65676b', margin: '8px 0' },
    badge: { display: 'inline-block', padding: '5px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' },
    newsSection: { display: 'flex', flexDirection: 'column', gap: '15px' },
    newsCard: { backgroundColor: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', borderLeft: '4px solid #ff4500' },
    newsTitle: { margin: '0 0 8px 0', fontSize: '16px', color: '#1c1e21' },
    newsSnippet: { fontSize: '13px', color: '#444', lineHeight: '1.4' },
    discussBtn: { marginTop: '10px', padding: '6px 12px', backgroundColor: '#f0f2f5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', color: '#0866ff' }
};

export default Dashboard;