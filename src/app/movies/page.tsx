"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MovieSummary {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export default function Movies() {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState("batman");
  const [searchInput, setSearchInput] = useState("batman"); // Separate state for input field
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const apiKey = "895e25b0";

  // Only fetch movies when searchTerm or page changes
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

  const totalPages = Math.ceil(totalResults / 10);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(searchInput);
    setPage(1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  return (
    <div className="p-6">
      <Link href="/" className="p-3 mx-6 rounded-md bg-blue-500 text-white">
        Home
      </Link>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchInput}
          onChange={handleInputChange}
          className="border m-1 p-2 rounded-md w-64"
        />
        <button
          type="submit"
          className="m-1 p-2 rounded-md text-white bg-blue-500 hover:bg-blue-600"
        >
          Search
        </button>
      </form>

      {/* Show current search term */}
      {searchTerm && (
        <div className="text-center mb-4">
          <p className="text-gray-600">
            Showing results for: <span className="font-semibold">"{searchTerm}"</span>
          </p>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        </div>
      )}

      {/* No Results Message */}
      {!loading && searchTerm && movies.length === 0 && (
        <div className="text-center p-6">
          <p className="text-gray-500">No movies found for "{searchTerm}"</p>
        </div>
      )}

      {/* Movies Grid */}
      {!loading && movies.length > 0 && (
        <>
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

          {/* Pagination */}
          {totalResults > 0 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
              >
                Prev
              </button>
              <span className="mx-4">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400 transition"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}