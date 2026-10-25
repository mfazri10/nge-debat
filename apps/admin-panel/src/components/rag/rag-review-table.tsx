"use client";

import React, { useState } from "react";
import { Database, Plus, X, Check, Video } from "lucide-react";
import { RAGSubmission } from "@/types/admin";
import { Toast } from "@/components/common/toast";
import { adminApi } from "@/lib/api";

const initialSubmissions: RAGSubmission[] = [
  {
    id: "sub-101",
    title: "Risalah Sidang MK RI: Sengketa UU Cipta Kerja 2024",
    user: "budi_santoso@gmail.com",
    sourceUrl: "https://mkri.id/risalah/perkara-91",
    status: "PENDING",
    date: "2026-09-18 19:40",
  },
  {
    id: "sub-102",
    title: "Transkrip ILC: Polemik Pajak Karbon & Efisiensi Energi",
    user: "sarah.advokat@yahoo.co.id",
    sourceUrl: "https://youtube.com/watch?v=ilc_transkrip_88",
    status: "PENDING",
    date: "2026-09-18 20:15",
  },
  {
    id: "sub-103",
    title: "WUDC 2025 Motion Dossier: Frontier AI Regulation",
    user: "kevin_debater@ugm.ac.id",
    sourceUrl: "https://wudc.org/dossiers/ai_motions_2025.pdf",
    status: "APPROVED",
    date: "2026-09-18 16:30",
  },
];

export function RAGReviewTable() {
  const [submissions, setSubmissions] = useState<RAGSubmission[]>(initialSubmissions);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);

  // Form state
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleApprove = async (id: string, sub: RAGSubmission) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "APPROVED" } : s))
    );
    showToast(`Dokumen [${sub.title}] disetujui. Memulai pipeline RAG...`);

    if (sub.sourceUrl.includes("youtube") || sub.sourceUrl.includes("youtu.be")) {
      await adminApi.ingestYouTube(sub.sourceUrl, sub.title);
      showToast(`Ingestion YouTube [${sub.title}] berhasil selesai.`);
    }
  };

  const handleReject = (id: string) => {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "REJECTED" } : s))
    );
    showToast(`Dokumen ${id} ditolak.`);
  };

  const handleIngestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;

    setIsIngesting(true);
    showToast(`Mengekstrak transkrip YouTube & menghasilkan embeddings 768d...`);

    const result = await adminApi.ingestYouTube(youtubeUrl, title || "Knowledge YouTube");
    setIsIngesting(false);
    setIsModalOpen(false);

    if (result) {
      showToast(`Ingestion selesai: ${result.total_chunks || "Beberapa"} chunks tersimpan ke pgvector.`);
      setSubmissions((prev) => [
        {
          id: `sub-${Date.now()}`,
          title: title || "Transkrip Video Debat",
          user: "admin@debateai.id",
          sourceUrl: youtubeUrl,
          status: "APPROVED",
          date: new Date().toISOString().slice(0, 16).replace("T", " "),
        },
        ...prev,
      ]);
    } else {
      showToast(`Pipeline ingestion diproses di background worker.`);
    }

    setYoutubeUrl("");
    setTitle("");
  };

  return (
    <div className="space-y-6">
      <Toast message={toastMsg} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Kurasi Knowledge Base & RAG Pipeline</h2>
          <p className="text-xs text-slate-400">
            Review kiriman dokumen komunitas (`kb_submissions`), trigger ingestion, dan verifikasi embedding 768d.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-purple-600 text-white font-medium px-4 py-2 rounded-xl text-xs hover:bg-purple-500 flex items-center gap-2 shadow-lg shadow-purple-600/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Ingest Dokumen Baru</span>
        </button>
      </div>

      <div className="bg-[#0F1422] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 font-semibold text-sm text-slate-200 flex items-center gap-2">
          <Database className="w-4 h-4 text-purple-400" />
          <span>Antrean Kiriman Komunitas (Pending Review)</span>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-5 py-3">Judul Dokumen</th>
              <th className="px-5 py-3">Pengirim</th>
              <th className="px-5 py-3">Waktu</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3 text-right">Keputusan Kurasi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {submissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-900/40">
                <td className="px-5 py-4">
                  <p className="font-semibold text-white">{sub.title}</p>
                  <a
                    href={sub.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-400 hover:underline"
                  >
                    {sub.sourceUrl}
                  </a>
                </td>
                <td className="px-5 py-4 text-xs font-mono text-slate-400">{sub.user}</td>
                <td className="px-5 py-4 text-xs text-slate-500 font-mono">{sub.date}</td>
                <td className="px-5 py-4">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                      sub.status === "APPROVED"
                        ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                        : sub.status === "REJECTED"
                        ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                        : "bg-amber-500/20 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {sub.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right space-x-2">
                  {sub.status === "PENDING" ? (
                    <>
                      <button
                        onClick={() => handleApprove(sub.id, sub)}
                        className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-lg text-xs hover:bg-emerald-600/30 font-medium"
                      >
                        Setujui & Ingest
                      </button>
                      <button
                        onClick={() => handleReject(sub.id)}
                        className="bg-rose-600/20 text-rose-400 border border-rose-500/30 px-3 py-1 rounded-lg text-xs hover:bg-rose-600/30 font-medium"
                      >
                        Tolak
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Selesai Ditinjau</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Ingest Manual */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0F1422] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-red-400" />
                Ingest Pengetahuan Baru (YouTube / Web)
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIngestSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Judul Dokumen / Topik
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Debat Capres 2024 - Kebijakan Transisi Energi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  URL Video YouTube
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isIngesting}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-medium px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-purple-600/20"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isIngesting ? "Sedang Mengekstrak..." : "Mulai Ingestion"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
