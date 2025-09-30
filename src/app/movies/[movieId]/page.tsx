"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function MovieDetails() {
  const { movieId } = useParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);

  interface MovieDetails {
  Title: string;
  Year: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Actors: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  Response: string;
}

  const apiKey = "895e25b0";

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}&plot=full`
        );
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!movie || movie.Response === "False") {
    return <div className="text-center p-6">Movie not found 😢</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-6">
        <Image
          src={movie.Poster !== "N/A" ? movie.Poster : "/no-poster.png"}
          alt={movie.Title}
          className="w-64 h-auto rounded-lg shadow"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{movie.Title}</h1>
          <p className="text-gray-600 mb-2">{movie.Year} • {movie.Runtime}</p>
          <p className="mb-4"><span className="font-semibold">Genre:</span> {movie.Genre}</p>
          <p className="mb-4"><span className="font-semibold">Director:</span> {movie.Director}</p>
          <p className="mb-4"><span className="font-semibold">Actors:</span> {movie.Actors}</p>
          <p className="mb-4"><span className="font-semibold">Plot:</span> {movie.Plot}</p>
          <p className="mb-2"><span className="font-semibold">IMDB Rating:</span> ⭐ {movie.imdbRating}</p>
        </div>
      </div>
    </div>
  );
}
