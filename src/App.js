import React, { useState} from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import axios from "axios";
import { BusinessContext } from "./BusinessContext";

function App() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const { width, height } = useWindowSize();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !location.trim()) {
      setError("Please fill in both fields.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setError("");
    setLoading(true);
    setSubmitted(false);

    try {
      const res = await axios.post("https://growthai-backend-nwcy.onrender.com/business-data", {
        name,
        location,
      });
      // Wait at least 1 second
      setTimeout(() => {
        setData(res.data);
        setSubmitted(true);
        setShowSuccess(true);
        setLoading(false);
        // Auto-hide success after 1 sec
        setTimeout(() => setShowSuccess(false), 5000);
      }, 3000);
    } catch (err) {
      setError("❌ Server error. Please try again later.");
      setTimeout(() => setError(""), 3000);
      setLoading(false);
    }
  };

  const regenerateHeadline = async () => {
    if (!name.trim() || !location.trim()) {
      setError("Please fill in both fields.");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setError("");
    setRegenerating(true);
    try {
      const res = await axios.get(`https://growthai-backend-nwcy.onrender.com/regenerate-headline`, {
        params: { name, location },
      });
      setTimeout(() => {
        setData((prev) => ({ ...prev, headline: res.data.headline }));
        setRegenerating(false);
      }, 1000);
    } catch (err) {
      setError("❌ Could not regenerate headline. Please try again.");
      setTimeout(() => setError(""), 3000);
      setRegenerating(false);
    }
  };

  return (
    <BusinessContext.Provider value={{ data, setData }}>
      <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-100 flex flex-col items-center p-4 transition-colors duration-500">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-6 text-center">
          🌟 Local Business Dashboard
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-gradient-to-r from-white via-gray-50 to-white shadow-lg rounded-xl px-6 sm:px-8 pt-6 pb-8 mb-4 w-full max-w-md transform transition-transform duration-300 hover:scale-105"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Business Name</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || submitted}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Location</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={loading || submitted}
            />
          </div>
          {error && (
            <p className="text-red-600 font-medium bg-red-100 p-2 rounded mb-3 animate-flyInOut">
              {error}
            </p>
          )}
          <button
            className={`${
              submitted
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            } text-white font-bold py-2 px-4 rounded w-full flex justify-center items-center transition`}
            type="submit"
            disabled={loading || submitted}
          >
            {loading ? (
              <span className="flex items-center">⏳ Loading...</span>
            ) : submitted ? (
              "Submitted"
            ) : (
              "Submit"
            )}
          </button>
        </form>

        {showSuccess && (
          <>
            <Confetti
              width={width}
              height={height}
              numberOfPieces={150}
              recycle={false}
            />
            <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 font-semibold animate-bounce">
              🎉 Success! Business data loaded.
            </div>
          </>
        )}

        {data && (
          <div className="bg-gradient-to-br from-white via-blue-50 to-white shadow-xl rounded-xl p-6 w-full max-w-md mt-4 transform transition-transform duration-300 hover:scale-105">
            <h2 className="text-2xl font-semibold mb-2 text-center">{name} in {location}</h2>
            <p className="mb-2 text-yellow-500 font-semibold text-center">
              ⭐ {data.rating} — {data.reviews} reviews
            </p>
            <p className="mb-4 italic text-gray-700 transition-opacity duration-500 text-center">
              {data.headline}
            </p>
            <button
              onClick={regenerateHeadline}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full flex justify-center items-center transition"
              disabled={regenerating}
            >
              {regenerating ? (
                <span className="flex items-center">⏳ Loading...</span>
              ) : (
                "Regenerate SEO Headline"
              )}
            </button>
          </div>
        )}
      </div>
    </BusinessContext.Provider>
  );
}

export default App;
