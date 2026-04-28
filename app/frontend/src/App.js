import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

const styles = {
  body: {
    fontFamily: "'Segoe UI', sans-serif",
    backgroundColor: '#f0fdf4',
    minHeight: '100vh',
    padding: '40px 20px',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '6px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#14532d',
    margin: 0,
  },
  subtitle: {
    color: '#888',
    fontSize: '14px',
    marginBottom: '30px',
  },
  cards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '24px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  cardValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#16a34a',
  },
  cardLabel: {
    fontSize: '13px',
    color: '#888',
    marginTop: '4px',
  },
  dot: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    margin: '0 auto 8px',
  },
  panel: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    marginBottom: '20px',
  },
  panelTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  form: {
    display: 'flex',
    gap: '12px',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    fontSize: '14px',
    outline: 'none',
  },
  btn: {
    padding: '10px 20px',
    backgroundColor: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '14px',
  },
  btnDanger: {
    padding: '6px 12px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#888',
    padding: '8px 12px',
    borderBottom: '1px solid #f0f0f0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  td: {
    padding: '12px',
    fontSize: '14px',
    color: '#333',
    borderBottom: '1px solid #f9f9f9',
  },
  error: {
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    padding: '10px 14px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
  },
};

export default function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [sqlStatus, setSqlStatus] = useState('...');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    testDB();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch {
      setError('Impossible de contacter le backend');
    }
  };

  const testDB = async () => {
    try {
      const res = await fetch(`${API_URL}/api/test-db`);
      const data = await res.json();
      setSqlStatus(data.status || 'Connecte');
    } catch {
      setSqlStatus('Erreur');
    }
  };

  const addUser = async () => {
    if (!name || !email) return setError('Nom et email requis');
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      setName('');
      setEmail('');
      fetchUsers();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch {
      setError('Erreur suppression');
    }
  };

  const isConnected = sqlStatus.includes('connecte') || sqlStatus.includes('OK');

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.header}>
          <span style={{ fontSize: '28px' }}>👥</span>
          <h1 style={styles.title}>Gestion users lgnmm1 </h1>
        </div>
        <p style={styles.subtitle}>React + Node.js + Azure SQL - Deploye sur AKS</p>

        <div style={styles.cards}>
          <div style={styles.card}>
            <div style={styles.cardValue}>{users.length}</div>
            <div style={styles.cardLabel}>Utilisateurs</div>
          </div>
          <div style={styles.card}>
            <div style={{ ...styles.dot, backgroundColor: isConnected ? '#22c55e' : '#ef4444' }} />
            <div style={styles.cardLabel}>Azure SQL</div>
          </div>
          <div style={styles.card}>
            <div style={{ ...styles.dot, backgroundColor: '#16a34a' }} />
            <div style={styles.cardLabel}>AKS Running</div>
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelTitle}>
            <span style={{ color: '#16a34a', fontWeight: '700' }}>+</span>
            Ajouter un utilisateur
          </div>
          {error && <div style={styles.error}>{error}</div>}
          <div style={styles.form}>
            <input
              style={styles.input}
              placeholder="Nom"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              style={styles.input}
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <button style={styles.btn} onClick={addUser} disabled={loading}>
              {loading ? '...' : '+ Ajouter'}
            </button>
          </div>
        </div>

        <div style={styles.panel}>
          <div style={styles.panelTitle}>
            Utilisateurs ({users.length})
          </div>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Nom</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ ...styles.td, textAlign: 'center', color: '#aaa' }}>
                    Aucun utilisateur
                  </td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.id}>
                    <td style={styles.td}>{u.id}</td>
                    <td style={styles.td}>{u.name}</td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>
                      {new Date(u.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={styles.td}>
                      <button style={styles.btnDanger} onClick={() => deleteUser(u.id)}>
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}