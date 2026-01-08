"use client";

import Link from "next/link";
import { articlesApi } from "@/lib/api";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/app/components/Modal";
import { useAuth } from "@/lib/context/auth";
import { useTheme } from "@/lib/context/theme";
import { SunIcon, MoonIcon } from "@heroicons/react/24/solid";

export default function Home() {
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [articles, setArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      articlesApi.getAll().then((data) => setArticles(data));
    }
  }, [isAuthenticated]);

  const handleDeleteClick = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    await articlesApi.delete(selectedArticle.id);
    setArticles(
      articles.filter((article) => article.id !== selectedArticle.id),
    );
    setShowModal(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div
      className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} p-2`}
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">BlogApp</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome, {user?.name}</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/articles/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
          >
            New Article
          </Link>
          <button onClick={toggleTheme} className="cursor-pointer">
            {theme === "light" ? (
              <MoonIcon className="size-6" />
            ) : (
              <SunIcon className="size-6" />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No articles yet. Create your first article!
            </p>
          </div>
        ) : (
          articles.map((article) => (
            <div
              key={article.id}
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
            >
              <div className="flex justify-between">
                <Link href={`/articles/${article.id}/edit`}>
                  <h2 className="text-2xl font-bold mb-2 text-blue-600 hover:text-blue-800 cursor-pointer">
                    {article.title}
                  </h2>
                </Link>
                <button
                  className="bg-red-500 cursor-pointer hover:bg-red-700 text-white font-medium py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                  onClick={() => handleDeleteClick(article)}
                >
                  Delete Article
                </button>
              </div>
              <p className="text-gray-700 mb-4 leading-relaxed">
                {article.body.substring(0, 200)}
                {article.body.length > 200 && "..."}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span
                  className={`px-3 py-1 rounded-full font-medium ${
                    article.published
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {article.published ? "Published" : "Draft"}
                </span>
                <span className="text-gray-500">
                  {new Date(article.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
        title="Delete Article"
        message={`Are you sure you want to delete "${selectedArticle?.title}"?`}
      />
    </div>
  );
}
