const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/v1";

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  return res;
}

export const adminApi = {
  // Health
  async getHealth() {
    try {
      const res = await fetch(`${API_BASE.replace("/v1", "")}/health`);
      return res.ok ? await res.json() : { status: "down" };
    } catch {
      return { status: "unreachable" };
    }
  },

  // Personas
  async getPersonas() {
    try {
      const res = await fetchWithAuth("/personas");
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async createPersona(data: {
    name: string;
    description: string;
    speaking_style: string;
    stance_default?: string;
    language?: string;
    is_template?: boolean;
  }) {
    const res = await fetchWithAuth("/personas", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return res.ok ? await res.json() : null;
  },

  async deletePersona(id: string) {
    const res = await fetchWithAuth(`/personas/${id}`, {
      method: "DELETE",
    });
    return res.ok;
  },

  // Knowledge & RAG
  async searchKnowledge(q: string, topK = 5) {
    try {
      const res = await fetchWithAuth(`/knowledge?q=${encodeURIComponent(q)}&top_k=${topK}`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  async ingestYouTube(url: string, title: string, language = "ID") {
    const res = await fetchWithAuth("/knowledge/ingest/youtube", {
      method: "POST",
      body: JSON.stringify({ url, title, language }),
    });
    return res.ok ? await res.json() : null;
  },

  // Motions
  async getMotions() {
    try {
      const res = await fetchWithAuth("/motions");
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },
};
