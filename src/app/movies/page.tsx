"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface MovieSummary {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export default function Movies() {
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  // State for the controlled input field
  const [searchTerm, setSearchTerm] = useState("batman");
  // State for the submitted search query
  const [query, setQuery] = useState("batman");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const apiKey = "895e25b0";

  // The API call is now triggered only when 'query' or 'page' changes.
  // 'query' is only updated when the search button is clicked.
  useEffect(() => {
    fetchMovies();
  }, [query, page]);

  async function fetchMovies() {
    setLoading(true);
    try {
      // Use the 'query' state for the API fetch, not 'searchTerm'
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${apiKey}&s=${query}&page=${page}`
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

  const totalPages = Math.ceil(totalResults / 10); // OMDb returns 10 per page

  // On form submission, update the 'query' state with the input's current value.
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 for a new search
    setQuery(searchTerm); // This will trigger the useEffect to fetch movies
  };

  return (
    <div className="p-6">
      <Link href ="/" className="p-3 mx-6 rounded-md bg-blue-500 text-white">Home</Link>
      {/* Search Bar */}
      <form
        onSubmit={handleSearch}
        className="flex justify-center mb-6"
      >
        <input
          type="text"
          placeholder="Search for movies..."
          // The input is controlled by 'searchTerm' state
          value={searchTerm}
          // Typing only updates 'searchTerm', it does not trigger an API call
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
              <Image
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

