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

  /* 🟦 공유하기 기능 추가 */
  const handleShare = async (movie) => {
    const youtubeUrl = movie.trailer
      ? `https://www.youtube.com/watch?v=${movie.trailer.key}`
      : `https://www.youtube.com/results?search_query=${movie.title}`;

    try {
      await navigator.clipboard.writeText(youtubeUrl);
      alert("유튜브 링크가 클립보드에 복사되었습니다!");
    } catch (err) {
      console.log("복사 에러:", err);
    }
  };

  if (activeTab === "community") {
    // 기존 커뮤니티 코드 그대로
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

    const deletePost = (postIdx) => {
      if (window.confirm("이 게시글을 정말 삭제하시겠습니까?")) {
        const updated = [...(reviews.community || [])];
        updated.splice(postIdx, 1);
        setReviews({ community: updated });
      }
    };

    const deleteReply = (postIdx, replyIdx) => {
      if (window.confirm("이 댓글을 정말 삭제하시겠습니까?")) {
        const updated = [...(reviews.community || [])];
        updated[postIdx].replies.splice(replyIdx, 1);
        setReviews({ community: updated });
      }
    };

    return (
      <div className="community-container">
        {/* 커뮤니티 기존 코드 그대로 */}
        ...
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
          /* 🟦 공유 기능 전달 */
          onShare={() => handleShare(movie)}
        />
      ))}
    </div>
  );
}
