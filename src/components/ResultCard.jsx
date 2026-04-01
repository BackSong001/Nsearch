// eslint-disable-next-line react/prop-types
export default function ResultCard({ item }) {
  // <b> 태그 등 제거 유틸
  const cleanHtml = (str) => {
    if (!str) return '';
    return str.replace(/<\/?b>/gi, '').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  };

  const handleClick = () => {
    window.open(item.link || item.originalUrl, '_blank', 'noopener,noreferrer');
  };

  const mapType = {
    'kin': '지식iN',
    'blog': '블로그',
    'news': '뉴스',
    'webkr': '웹문서',
    'image': '이미지',
    'shop': '쇼핑'
  };

  const typeLabel = item._type ? (mapType[item._type] || item._type) : '';

  return (
    <div onClick={handleClick} style={styles.card}>
      <div style={styles.header}>
        {typeLabel && <span style={styles.typeBadge}>{typeLabel}</span>}
        <h3 style={styles.title}>{cleanHtml(item.title)}</h3>
      </div>
      
      {item.thumbnail && (
         <img src={item.thumbnail} alt="thumbnail" style={styles.thumbnail} />
      )}

      {item.description && (
        <p style={styles.description}>{cleanHtml(item.description)}</p>
      )}

      {item.bloggername && (
        <span style={styles.meta}>{item.bloggername}</span>
      )}
      {item.mallName && (
        <span style={styles.meta}>쇼핑몰: {item.mallName} | 최저가: {Number(item.lprice).toLocaleString()}원</span>
      )}
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  typeBadge: {
    backgroundColor: '#03C75A',
    color: '#FFFFFF',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 'bold',
    flexShrink: 0
  },
  title: {
    color: '#111111',
    fontSize: '18px',
    fontWeight: 'bold',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    wordBreak: 'break-all',
    margin: 0
  },
  thumbnail: {
    maxWidth: '100px',
    maxHeight: '100px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '10px'
  },
  description: {
    color: '#555555',
    fontSize: '15px',
    lineHeight: '1.5',
    marginBottom: '12px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    wordBreak: 'break-all',
  },
  meta: {
    display: 'inline-block',
    fontSize: '13px',
    color: '#888888',
    backgroundColor: '#F0F0F0',
    padding: '4px 10px',
    borderRadius: '6px',
  }
};
