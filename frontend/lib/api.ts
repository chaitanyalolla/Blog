const API_URL = "http://localhost:3001/api/v1";

export interface Article {
  id: number;
  title: string;
  body: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

// Helper function to get auth headers
function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Get token from localStorage if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
}

export const articlesApi = {
  async getAll(): Promise<Article[]> {
    const res = await fetch(`${API_URL}/articles`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch articles");
    return res.json();
  },

  async getOne(id: number): Promise<Article> {
    const res = await fetch(`${API_URL}/articles/${id}`, {
      headers: getAuthHeaders(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch article");
    return res.json();
  },

  async create(article: Partial<Article>): Promise<Article> {
    const res = await fetch(`${API_URL}/articles`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ article }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.errors?.join(", ") || "Failed to create");
    }
    return res.json();
  },

  async update(id: number, article: Partial<Article>): Promise<Article> {
    const res = await fetch(`${API_URL}/articles/${id}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({ article }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.errors?.join(", ") || "Failed to update");
    }
    return res.json();
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/articles/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to delete article");
  },
};
