// ShareModal 컴포넌트 (수정된 버전)
function ShareModal({ movie, onClose, onCopyLink, getYouTubeLink }) {
  if (!movie) return null;

  const youtubeLink = getYouTubeLink(movie.title);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2>공유하기</h2>
        </div>

        <div className="modal-body" style={{ textAlign: "center" }}>
          <p style={{ marginBottom: "20px", fontSize: "1.1rem" }}>
            <strong>{movie.title}</strong>
          </p>

          <div
            style={{
              background: "#f5f5f5",
              padding: "15px",
              borderRadius: "8px",
              marginBottom: "20px",
              wordBreak: "break-all",
              fontSize: "0.9rem",
              maxHeight: "100px",
              overflowY: "auto",
            }}
          >
            {youtubeLink}
          </div>

          <button
            className="submit-btn"
            onClick={onCopyLink}
            style={{
              width: "100%",
              padding: "12px",
              marginBottom: "10px",
            }}
          >
            🔗 링크 복사
          </button>

          <button
            className="detail-btn"
            onClick={onClose}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "10px",
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
