import React from "react";

export default function MovieCard({ movie, onClick, onFavorite, isFavorite }) {
  return (
    <div className="movie-card">
      {/* 포스터 */}
      <div className="poster-wrapper">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        ) : (
          <div className="no-poster">이미지 없음</div>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="movie-info">
        <div>
          <h3 className="title">{movie.title}</h3>
          <div className="info-tags">
            <span className="tag">{movie.release_date || "-"}</span>
            <span className="tag">
              ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
            </span>
          </div>
        </div>

        {/* 상세보기 버튼 */}
        <button onClick={onClick} className="detail-btn">
          상세보기
        </button>

        {/* 즐겨찾기 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onFavorite(movie);
          }}
          className={`favorite-btn ${isFavorite ? "active" : ""}`}
        >
          {isFavorite ? "❤️ 즐겨찾기" : "🤍 즐겨찾기"}
        </button>
      </div>
    </div>
  );
}
