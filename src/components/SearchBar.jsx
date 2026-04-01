import { useState } from 'react';

// eslint-disable-next-line react/prop-types
export default function SearchBar({ initialQuery = '', initialCount = 10, initialCategory = 'all', onSearch }) {
  const [query, setQuery] = useState(initialQuery);
  const [count, setCount] = useState(initialCount);
  const [category, setCategory] = useState(initialCategory);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSearch(query, count, category);
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.select}>
          <option value="all">모두</option>
          <option value="kin">지식iN</option>
          <option value="blog">블로그</option>
          <option value="news">뉴스</option>
          <option value="webkr">웹문서</option>
          <option value="image">이미지</option>
          <option value="shop">쇼핑</option>
        </select>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="검색어를 입력하세요..."
          style={styles.input}
        />
        <select value={count} onChange={(e) => setCount(Number(e.target.value))} style={styles.select}>
          <option value={10}>10개</option>
          <option value={50}>50개</option>
          <option value={100}>100개</option>
          <option value={200}>200개</option>
          <option value={500}>500개</option>
          <option value={1000}>1000개</option>
        </select>
        <button type="submit" style={styles.button}>검색</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  form: {
    display: 'flex',
    gap: '10px',
    width: '100%',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    borderRadius: '24px',
    border: 'none',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    fontSize: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  select: {
    padding: '10px 14px',
    borderRadius: '24px',
    border: 'none',
    backgroundColor: '#FFFFFF',
    fontSize: '15px',
    cursor: 'pointer',
    outline: 'none',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
  },
  button: {
    padding: '10px 24px',
    borderRadius: '24px',
    border: 'none',
    backgroundColor: '#FFFFFF',
    color: '#03C75A',
    fontWeight: 'bold',
    fontSize: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  }
};
