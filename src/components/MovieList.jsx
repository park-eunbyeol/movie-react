import React, { useState } from "react";
import MovieCard from "./MovieCard";
import "./MovieList.css";

export default function MovieList({
  movies,
  favorites,
  onMovieClick,
  onFavorite,
  activeTab,
  reviews,
  setReviews,
}) {
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [replyInputs, setReplyInputs] = useState({});

  if (activeTab === "community") {
    // 게시글 추가
    const addPost = () => {
      if (!newPost.title.trim() || !newPost.content.trim()) {
        alert("제목과 내용을 모두 입력해주세요!");
        return;
      }

      const post = {
        id: Date.now(),
        title: newPost.title,
        content: newPost.content,
        author: "영화팬",
        date: new Date()
          .toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(/\. /g, "-")
          .replace(".", ""),
        replies: [],
      };

      setReviews({ community: [post, ...(reviews.community || [])] });
      setNewPost({ title: "", content: "" });
    };

    // 답글 추가
    const addReply = (postIdx) => {
      const text = (replyInputs[postIdx] || "").trim();
      if (!text) {
        alert("댓글 내용을 입력해주세요!");
        return;
      }

      const updated = [...(reviews.community || [])];
      if (!updated[postIdx].replies) {
        updated[postIdx].replies = [];
      }

      updated[postIdx].replies.push({
        id: Date.now(),
        author: "관객",
        content: text,
        date: new Date()
          .toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(/\. /g, "-")
          .replace(".", ""),
      });

      setReviews({ community: updated });
      setReplyInputs({ ...replyInputs, [postIdx]: "" });
    };

    // 게시글 삭제 (확인)
    const deletePost = (postIdx) => {
      if (window.confirm("이 게시글을 정말 삭제하시겠습니까?")) {
        const updated = [...(reviews.community || [])];
        updated.splice(postIdx, 1);
        setReviews({ community: updated });
      }
    };

    // 댓글 삭제 (확인)
    const deleteReply = (postIdx, replyIdx) => {
      if (window.confirm("이 댓글을 정말 삭제하시겠습니까?")) {
        const updated = [...(reviews.community || [])];
        updated[postIdx].replies.splice(replyIdx, 1);
        setReviews({ community: updated });
      }
    };

    return (
      <div className="community-container">
        <div className="community-wrapper">
          {/* 글 작성하기 */}
          <div className="write-section">
            <h2 className="section-title">
              <span>✍️</span>
              <span>글 작성하기</span>
            </h2>

            <input
              type="text"
              placeholder="제목을 입력하세요"
              value={newPost.title}
              onChange={(e) =>
                setNewPost({ ...newPost, title: e.target.value })
              }
              className="title-input"
            />

            <textarea
              placeholder="내용을 입력하세요"
              value={newPost.content}
              onChange={(e) =>
                setNewPost({ ...newPost, content: e.target.value })
              }
              rows="6"
              className="content-textarea"
            />

            <button onClick={addPost} className="submit-btn">
              등록하기
            </button>
          </div>

          {/* 최신 글 */}
          <div>
            <h2 className="section-title">
              <span>📋</span>
              <span>최신 글</span>
            </h2>

            <div className="posts-list">
              {(reviews.community || [])
                .filter((post) => post.title && post.content)
                .map((post, idx) => (
                  <div key={post.id || idx} className="post-card">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-meta">
                      작성자: {post.author} | {post.date}
                      <button
                        onClick={() => deletePost(idx)}
                        className="delete-post-btn"
                        style={{ marginLeft: "10px", color: "red" }}
                      >
                        삭제
                      </button>
                    </p>
                    <p className="post-content">{post.content}</p>

                    {/* 댓글 섹션 */}
                    <div className="comments-section">
                      <h4 className="comments-title">
                        <span>💬</span>
                        <span>댓글 {(post.replies || []).length}개</span>
                      </h4>

                      {/* 댓글 목록 */}
                      {(post.replies || []).length > 0 && (
                        <div className="comments-list">
                          {post.replies.map((reply, ridx) => (
                            <div
                              key={reply.id || ridx}
                              className="comment-item"
                            >
                              <div className="comment-header">
                                <span className="comment-author">
                                  {reply.author}
                                </span>
                                <span className="comment-date">
                                  {reply.date}
                                </span>
                                <button
                                  onClick={() => deleteReply(idx, ridx)}
                                  className="delete-reply-btn"
                                  style={{ marginLeft: "10px", color: "red" }}
                                >
                                  삭제
                                </button>
                              </div>
                              <p className="comment-content">{reply.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 댓글 입력 */}
                      <div className="comment-input-wrapper">
                        <input
                          type="text"
                          placeholder="댓글을 입력하세요..."
                          value={replyInputs[idx] || ""}
                          onChange={(e) =>
                            setReplyInputs({
                              ...replyInputs,
                              [idx]: e.target.value,
                            })
                          }
                          onKeyPress={(e) => e.key === "Enter" && addReply(idx)}
                          className="comment-input"
                        />
                        <button
                          onClick={() => addReply(idx)}
                          className="comment-btn"
                        >
                          댓글 달기
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 영화 리스트 렌더링
  return (
    <div className="movie-list">
      {movies?.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onClick={() => onMovieClick(movie.id)}
          onFavorite={onFavorite}
          isFavorite={favorites.some((f) => f.id === movie.id)}
        />
      ))}
    </div>
  );
}
