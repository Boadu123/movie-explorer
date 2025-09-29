"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Movies() {
  const [movies, setMovies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("batman");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const apiKey = "895e25b0";

  useEffect(() => {
    fetchMovies();
  }, [searchTerm, page]);

  async function fetchMovies() {
    setLoading(true);
    try {
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}&page=${page}`
      );
      const data = await res.json();
      if (data.Response === "True") {
        setMovies(data.Search);
        setTotalResults(Number(data.totalResults));
      } else {
        setMovies([]);
        setTotalResults(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.ceil(totalResults / 8); // OMDb returns 10 per page

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // reset to page 1 on new search
    fetchMovies();
  };

  return (
    <div className="p-6">
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex justify-center mb-6"
      >
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border m-1 p-2 rounded-md w-64"
        />
        <button
          type="submit"
          className="m-1 p-2 rounded-md text-white bg-blue-500 hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}

      {/* Movies Grid */}
      {!loading && movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <Link
              key={movie.imdbID}
              href={`/movies/${movie.imdbID}`}
              className="border rounded-lg shadow hover:shadow-lg transition p-2 text-center"
            >
              <img
                src={movie.Poster !== "N/A" ? movie.Poster : "/no-poster.png"}
                alt={movie.Title}
                className="w-full h-64 object-cover rounded-md"
              />
              <h3 className="mt-2 font-semibold">{movie.Title}</h3>
              <p className="text-sm text-gray-600">{movie.Year}</p>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && totalResults > 0 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
