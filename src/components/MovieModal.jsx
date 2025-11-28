import React from "react";

export default function MovieModal({
  movie,
  similarMovies,
  onClose,
  onFavorite,
  isFavorite,
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2>{movie.title}</h2>
          <button
            className={`favorite ${isFavorite ? "active" : ""}`}
            onClick={() => onFavorite(movie)}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
        </div>

        <div className="modal-body">
          <p>
            <strong>개봉일:</strong> {movie.release_date || "정보 없음"}
          </p>
          <p>
            <strong>평점:</strong> ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
          </p>
          <p>
            <strong>장르:</strong>{" "}
            {movie.genres?.map((g) => g.name).join(", ") || "정보 없음"}
          </p>

          {movie.directors && movie.directors.length > 0 && (
            <p>
              <strong>감독:</strong>{" "}
              {movie.directors.map((d) => d.name).join(", ")}
            </p>
          )}

          {movie.actors && movie.actors.length > 0 && (
            <p>
              <strong>출연:</strong>{" "}
              {movie.actors.map((a) => a.name).join(", ")}
            </p>
          )}

          <p>
            <strong>줄거리:</strong>
          </p>
          <p>{movie.overview || "줄거리 정보가 없습니다."}</p>

          {movie.trailer && (
            <div className="trailer">
              <h3>예고편</h3>
              <iframe
                src={`https://www.youtube.com/embed/${movie.trailer.key}`}
                title="Trailer"
                allowFullScreen
              />
            </div>
          )}

          {similarMovies.length > 0 && (
            <div className="similar-movies">
              <h3>비슷한 영화</h3>
              <div className="similar-list">
                {similarMovies.slice(0, 6).map((sim) => (
                  <div key={sim.id} className="similar-card">
                    {sim.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${sim.poster_path}`}
                        alt={sim.title}
                      />
                    ) : (
                      <div
                        style={{
                          width: "140px",
                          height: "200px",
                          background: "#f0f0f0",
                          borderRadius: "8px",
                        }}
                      />
                    )}
                    <p>{sim.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
