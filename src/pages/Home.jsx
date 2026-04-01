import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const navigate = useNavigate();
  const hasApiKey = Boolean(import.meta.env.VITE_NAVER_CLIENT_ID && import.meta.env.VITE_NAVER_CLIENT_SECRET);

  const [showForm, setShowForm] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // If no keys, and form is not shown, we should show the "No API Key" state.
  // If keys exist, we show the search bar by default, but allow showing the form to re-enter.

  const handleSearch = (query, count, category) => {
    navigate(`/search?query=${encodeURIComponent(query)}&display=${count}&category=${category}`);
  };

  const handleSaveKeys = async (e) => {
    e.preventDefault();
    if (!clientId || !clientSecret) return alert('두 키를 모두 입력해주세요.');
    setIsSaving(true);
    try {
      const res = await fetch('/api/save-env', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId, clientSecret })
      });
      if (res.ok) {
        // We need the server to restart or dev server to pick up new env
        // Usually Vite dev server restarts on .env change.
        // Reloading might work if the server has already restarted.
        alert('API 키가 저장되었습니다. 시스템을 재시작하거나 페이지를 새로고침 해주세요.');
        window.location.reload();
      } else {
        alert('저장에 실패했습니다.');
        setIsSaving(false);
      }
    } catch (err) {
      alert('오류가 발생했습니다.');
      setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (showForm) {
      return (
        <form onSubmit={handleSaveKeys} style={styles.keyForm}>
          <h2 style={styles.formTitle}>API 키 설정</h2>
          <input
            type="text"
            placeholder="Client ID"
            value={clientId}
            onChange={e => setClientId(e.target.value)}
            style={styles.keyInput}
            required
          />
          <input
            type="password"
            placeholder="Client Secret"
            value={clientSecret}
            onChange={e => setClientSecret(e.target.value)}
            style={styles.keyInput}
            required
          />
          <div style={styles.btnGroup}>
            <button type="submit" disabled={isSaving} style={styles.saveBtn}>
              {isSaving ? '저장 중...' : '저장하기'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={styles.cancelBtn}>
              취소
            </button>
          </div>
        </form>
      );
    }

    if (!hasApiKey) {
      return (
        <div style={styles.emptyState}>
          <p style={styles.warning}>API 키가 설정되어 있지 않습니다.</p>
          <button onClick={() => setShowForm(true)} style={styles.actionBtn}>
            API 키 입력하기
          </button>
        </div>
      );
    }

    return (
      <>
        <SearchBar onSearch={handleSearch} />
        <button
          onClick={() => setShowForm(true)}
          style={styles.resetBtn}
        >
          API 키 재설정
        </button>
      </>
    );
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>NSearch</h1>
      {renderContent()}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '40px',
    backgroundColor: '#03C75A',
  },
  title: {
    color: '#FFFFFF', // Naver Green
    fontSize: '72px',
    fontWeight: '900',
    marginBottom: '50px',
    letterSpacing: '4px',
    textShadow: '0 0 20px rgba(3, 199, 90, 0.3)',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  warning: {
    color: '#FFFFFF',
    fontSize: '20px',
    fontWeight: '500',
    opacity: 0.8,
  },
  actionBtn: {
    padding: '12px 30px',
    border: '2px solid #03C75A',
    borderRadius: '30px',
    backgroundColor: 'transparent',
    color: '#03C75A',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  keyForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: '40px',
    borderRadius: '24px',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    width: '400px',
  },
  formTitle: {
    color: '#FFFFFF',
    fontSize: '24px',
    marginBottom: '10px',
  },
  keyInput: {
    padding: '16px 24px',
    width: '100%',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    outline: 'none',
    fontSize: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    transition: 'border-color 0.2s',
  },
  btnGroup: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    marginTop: '10px',
  },
  saveBtn: {
    flex: 2,
    padding: '16px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: '#03C75A',
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.1s',
  },
  cancelBtn: {
    flex: 1,
    padding: '16px',
    border: 'none',
    borderRadius: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#FFFFFF',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  resetBtn: {
    marginTop: '30px',
    padding: '8px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#666',
    fontSize: '14px',
    cursor: 'pointer',
    textDecoration: 'underline',
  }
};
