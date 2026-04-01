import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getResultsForCategory } from '../api/naverSearch';
import LoadingSpinner from '../components/LoadingSpinner';
import ResultCard from '../components/ResultCard';
import SearchBar from '../components/SearchBar';

export default function ResultList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('query') || '';
  const display = Number(searchParams.get('display')) || 10;
  const category = searchParams.get('category') || 'all';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      navigate('/');
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const items = await getResultsForCategory(query, category, display);
        setResults(items);
      } catch (err) {
        console.error(err);
        setError('검색 중 오류가 발생했습니다. API 키나 클라이언트 설정을 확인해주세요.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, display, category, navigate]);

  const handleSearch = (newQuery, newCount, newCategory) => {
    navigate(`/search?query=${encodeURIComponent(newQuery)}&display=${newCount}&category=${newCategory}`);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <button onClick={() => navigate('/')} style={styles.backButton}>
            ← 홈으로
          </button>
          <h2 style={styles.headerTitle}>NSerch</h2>
        </div>
        <div style={styles.searchBarWrapper}>
          <SearchBar initialQuery={query} initialCount={display} initialCategory={category} onSearch={handleSearch} />
        </div>
      </header>

      <main style={styles.main}>
        {loading && <LoadingSpinner />}
        
        {!loading && error && (
          <div style={styles.error}>{error}</div>
        )}

        {!loading && !error && results.length === 0 && (
          <div style={styles.empty}>검색 결과가 없습니다.</div>
        )}

        {!loading && !error && (
          <div style={styles.resultMeta}>
            총 <b>{results.length}</b>개의 결과를 가져왔습니다.
          </div>
        )}

        {!loading && !error && results.map((item, index) => (
          <ResultCard key={index} item={item} />
        ))}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    padding: '20px 40px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.2)'
  },
  headerTop: {
    display: 'flex',
    width: '100%',
    maxWidth: '800px',
    alignItems: 'center',
    marginBottom: '20px',
    justifyContent: 'space-between',
  },
  backButton: {
    backgroundColor: '#FFFFFF',
    color: '#03C75A',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: '28px',
    fontWeight: '900',
    letterSpacing: '1px',
    margin: 0,
  },
  searchBarWrapper: {
    width: '100%',
    maxWidth: '800px',
  },
  main: {
    flex: 1,
    padding: '20px 40px',
    maxWidth: '900px',
    width: '100%',
    margin: '0 auto',
  },
  resultMeta: {
    marginBottom: '20px',
    color: '#FFFFFF',
    fontSize: '15px',
    textAlign: 'right'
  },
  error: {
    backgroundColor: '#ffdddd',
    color: '#d8000c',
    padding: '20px',
    borderRadius: '8px',
    textAlign: 'center',
    fontSize: '16px',
    marginTop: '40px',
  },
  empty: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: '18px',
    marginTop: '60px',
  }
};
