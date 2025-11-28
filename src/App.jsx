import React, { useEffect, useState } from "react";
import "./MovieFlix.css";

const API_KEY = "2164d1ce718f51afd478a3007a3a4e01";

// MovieCard 컴포넌트
function MovieCard({ movie, onClick, onFavorite, isFavorite, onShare }) {
  return (
    <div className="movie-card">
      <div className="poster-wrapper" onClick={onClick}>
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
          />
        ) : (
          <div className="no-poster"></div>
        )}
      </div>
      <div className="movie-info">
        <h3>{movie.title || "제목 없음"}</h3>
        <div className="info-container">
          <p className="genre">개봉일: {movie.release_date || "-"}</p>
          <p className="rating">
            평점: ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
          </p>
        </div>

        <button className="card-btn detail-btn full-width" onClick={onClick}>
          📝 상세보기
        </button>
      </div>
    </div>
  );
}

// MovieModal 컴포넌트
function MovieModal({
  movie,
  similarMovies,
  onClose,
  onFavorite,
  isFavorite,
  onShare,
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>

        <div className="modal-header">
          <h2>{movie.title}</h2>
          <div className="modal-header-buttons">
            <button
              className={`favorite ${isFavorite ? "active" : ""}`}
              onClick={() => onFavorite(movie)}
            >
              {isFavorite ? "❤️" : "🤍"}
            </button>
            <button className="share-btn" onClick={() => onShare(movie)}>
              🔗 공유하기
            </button>
          </div>
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

// ShareModal 컴포넌트 (간단한 버전)
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

// Community 컴포넌트
function Community() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [commentInputs, setCommentInputs] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("communityPosts") || "[]");
    setPosts(saved);
  }, []);

  const handlePostSubmit = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: "사용자",
      date: new Date().toLocaleString("ko-KR"),
      comments: [],
      likes: 0,
    };

    const updated = [post, ...posts];
    setPosts(updated);
    localStorage.setItem("communityPosts", JSON.stringify(updated));
    setNewPost({ title: "", content: "" });
  };

  const handlePostDelete = (postId) => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    const updated = posts.filter((post) => post.id !== postId);
    setPosts(updated);
    localStorage.setItem("communityPosts", JSON.stringify(updated));
  };

  const handleCommentSubmit = (postId) => {
    const comment = commentInputs[postId]?.trim();
    if (!comment) return;

    const updated = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [
            ...post.comments,
            {
              id: Date.now(),
              content: comment,
              author: "사용자",
              date: new Date().toLocaleString("ko-KR"),
            },
          ],
        };
      }
      return post;
    });

    setPosts(updated);
    localStorage.setItem("communityPosts", JSON.stringify(updated));
    setCommentInputs({ ...commentInputs, [postId]: "" });
  };

  const handleCommentDelete = (postId, commentId) => {
    const updated = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.filter((c) => c.id !== commentId),
        };
      }
      return post;
    });

    setPosts(updated);
    localStorage.setItem("communityPosts", JSON.stringify(updated));
  };

  const handleLike = (postId) => {
    const updated = posts.map((post) => {
      if (post.id === postId) {
        return { ...post, likes: post.likes + 1 };
      }
      return post;
    });
    setPosts(updated);
    localStorage.setItem("communityPosts", JSON.stringify(updated));
  };

  return (
    <div className="community-container">
      <div className="community-wrapper">
        <div className="write-section">
          <h2 className="section-title">✍️ 새 게시글 작성</h2>
          <input
            type="text"
            className="title-input"
            placeholder="제목을 입력하세요"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            className="content-textarea"
            placeholder="내용을 입력하세요 (영화 추천, 리뷰, 자유게시판)"
            rows="5"
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
          />
          <button className="submit-btn" onClick={handlePostSubmit}>
            📮 게시글 등록
          </button>
        </div>

        <div className="posts-list">
          {posts.length === 0 ? (
            <div className="empty-state">
              <p>아직 게시글이 없습니다. 첫 게시글을 작성해보세요! 🎬</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header-top">
                  <h3 className="post-title">{post.title}</h3>
                  <div>
                    <button
                      className="like-btn"
                      onClick={() => handleLike(post.id)}
                    >
                      ❤️ {post.likes}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handlePostDelete(post.id)}
                    >
                      🗑️ 삭제
                    </button>
                  </div>
                </div>
                <p className="post-meta">
                  👤 {post.author} • 🕒 {post.date}
                </p>
                <p className="post-content">{post.content}</p>

                <div className="comments-section">
                  <h4 className="comments-title">
                    💬 댓글 ({post.comments.length})
                  </h4>

                  {post.comments.length > 0 && (
                    <div className="comments-list">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="comment-item">
                          <div className="comment-header">
                            <span className="comment-author">
                              {comment.author}
                            </span>
                            <span className="comment-date">{comment.date}</span>
                            <button
                              className="comment-delete-btn"
                              onClick={() =>
                                handleCommentDelete(post.id, comment.id)
                              }
                            >
                              🗑️
                            </button>
                          </div>
                          <p className="comment-content">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="comment-input-wrapper">
                    <input
                      type="text"
                      className="comment-input"
                      placeholder="댓글을 입력하세요"
                      value={commentInputs[post.id] || ""}
                      onChange={(e) =>
                        setCommentInputs({
                          ...commentInputs,
                          [post.id]: e.target.value,
                        })
                      }
                      onKeyPress={(e) => {
                        if (e.key === "Enter") handleCommentSubmit(post.id);
                      }}
                    />
                    <button
                      className="comment-btn"
                      onClick={() => handleCommentSubmit(post.id)}
                    >
                      등록
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [heroMovie, setHeroMovie] = useState(null);
  const [currentView, setCurrentView] = useState("home");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMovie, setShareMovie] = useState(null);

  const popularSearches = [
    "아바타",
    "타이타닉",
    "어벤져스",
    "인터스텔라",
    "기생충",
    "라라랜드",
    "노트북",
    "인셉션",
  ];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(saved);
  }, []);

  useEffect(() => {
    if (currentView !== "home") return;

    fetch(
      `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}&language=ko-KR`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.results && data.results.length > 0) {
          setHeroMovie(data.results[0]);
        }
      })
      .catch((err) => console.error("히어로 영화 로드 에러:", err));
  }, [currentView]);

  useEffect(() => {
    if (showFavorites || currentView !== "home") return;

    let url = "";
    switch (activeTab) {
      case "popular":
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`;
        break;
      case "latest":
        url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=ko-KR&page=1`;
        break;
      case "action":
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=28`;
        break;
      case "drama":
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=18`;
        break;
      case "comedy":
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=ko-KR&with_genres=35`;
        break;
      default:
        url = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=ko-KR&page=1`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => setMovies(data.results || []))
      .catch((err) => console.error("에러:", err));
  }, [activeTab, showFavorites, currentView]);

  const toggleFavorite = (movie) => {
    const exists = favorites.find((m) => m.id === movie.id);
    let updated;

    if (exists) {
      updated = favorites.filter((m) => m.id !== movie.id);
    } else {
      updated = [...favorites, movie];
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const getYouTubeLink = (title) => {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(
      title + " trailer"
    )}`;
  };

  const copyShareLink = async () => {
    if (!shareMovie) return;
    const youtubeLink = getYouTubeLink(shareMovie.title);
    try {
      await navigator.clipboard.writeText(youtubeLink);
      alert("YouTube 링크가 복사되었습니다!");
      setShowShareModal(false);
    } catch (err) {
      console.log("복사 에러:", err);
    }
  };

  const handleShare = (movie) => {
    setShareMovie(movie);
    setShowShareModal(true);
  };

  const openMovieDetails = async (movieId) => {
    try {
      const detailRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&language=ko-KR`
      );
      const movieDetail = await detailRes.json();

      const creditsRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${API_KEY}&language=ko-KR`
      );
      const creditsData = await creditsRes.json();
      const directors = creditsData.crew.filter((c) => c.job === "Director");
      const actors = creditsData.cast.slice(0, 5);

      const videosRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${API_KEY}&language=ko-KR`
      );
      const videosData = await videosRes.json();
      const trailer = videosData.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );

      const similarRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/similar?api_key=${API_KEY}&language=ko-KR&page=1`
      );
      const similarData = await similarRes.json();

      setSelectedMovie({
        ...movieDetail,
        directors,
        actors,
        trailer,
      });
      setSimilarMovies(similarData.results || []);
    } catch (error) {
      console.error("상세정보 오류:", error);
    }
  };

  const handleSearch = (query) => {
    if (!query.trim()) return;

    setCurrentView("home");
    setSearchQuery(query);
    setShowSearchDropdown(false);

    fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=ko-KR&query=${query}`
    )
      .then((res) => res.json())
      .then((data) => setMovies(data.results || []))
      .catch((err) => console.log(err));
  };

  return (
    <div className="movieflix-container">
      <header className="movieflix-header">
        <div className="logo">
          <div className="logo-icon"></div>
          <h1>MovieFlix</h1>
        </div>

        <div className="search-bar" style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="영화 검색"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(e.target.value === "");
            }}
            onFocus={() => setShowSearchDropdown(searchQuery === "")}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleSearch(searchQuery);
            }}
          />
          {showSearchDropdown && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid #ddd",
                borderRadius: "6px",
                marginTop: "5px",
                zIndex: 1000,
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {popularSearches.map((search, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSearch(search)}
                  style={{
                    padding: "10px 15px",
                    cursor: "pointer",
                    borderBottom:
                      idx < popularSearches.length - 1
                        ? "1px solid #eee"
                        : "none",
                    fontSize: "0.9rem",
                    color: "#333",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#f5f5f5")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  🔍 {search}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="header-buttons">
          <button
            className="header-btn"
            onClick={() =>
              setCurrentView(currentView === "home" ? "community" : "home")
            }
          >
            {currentView === "home" ? "💬 커뮤니티" : "🏠 홈"}
          </button>
          <button
            className="header-btn"
            onClick={() => {
              setCurrentView("home");
              setShowFavorites(!showFavorites);
              if (!showFavorites) setMovies(favorites);
            }}
          >
            ❤️ 즐겨찾기 ({favorites.length})
          </button>
        </div>
      </header>

      {currentView === "community" && <Community />}

      {currentView === "home" && (
        <>
          {heroMovie && (
            <div className="hero-section">
              <img
                src={`https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`}
                alt={heroMovie.title}
                className="hero-background"
              />
              <div className="hero-content">
                <h2 className="hero-title">{heroMovie.title}</h2>

                <div className="hero-info">
                  <div className="hero-date">
                    <strong>개봉일:</strong> {heroMovie.release_date || "-"}
                  </div>
                  <div className="hero-rating">
                    <strong>평점:</strong> ⭐{" "}
                    {heroMovie.vote_average?.toFixed(1) || "N/A"}
                  </div>
                </div>

                <p className="hero-overview">{heroMovie.overview}</p>

                <div className="hero-buttons">
                  <button
                    className="hero-btn hero-btn-play"
                    onClick={() => openMovieDetails(heroMovie.id)}
                  >
                    ▶ 재생
                  </button>
                  <button
                    className="hero-btn hero-btn-info"
                    onClick={() => openMovieDetails(heroMovie.id)}
                  >
                    ℹ 상세보기
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 탭 */}
          <div className="tab-menu">
            {["popular", "latest", "action", "drama", "comedy"].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                onClick={() => {
                  setActiveTab(tab);
                  setShowFavorites(false);
                }}
              >
                {tab === "popular"
                  ? "popular"
                  : tab === "latest"
                  ? "latest"
                  : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* 영화 리스트 */}
          <div className="movie-list">
            {(showFavorites ? favorites : movies).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => openMovieDetails(movie.id)}
                onFavorite={toggleFavorite}
                isFavorite={favorites.some((m) => m.id === movie.id)}
                onShare={handleShare}
              />
            ))}
          </div>
        </>
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          similarMovies={similarMovies}
          onClose={() => setSelectedMovie(null)}
          onFavorite={toggleFavorite}
          isFavorite={favorites.some((m) => m.id === selectedMovie.id)}
          onShare={handleShare}
        />
      )}

      {showShareModal && (
        <ShareModal
          movie={shareMovie}
          onClose={() => setShowShareModal(false)}
          onCopyLink={copyShareLink}
          getYouTubeLink={getYouTubeLink}
        />
      )}
    </div>
  );
}
