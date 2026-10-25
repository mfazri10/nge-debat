"use client";

import React, { useState, useEffect } from "react";
import { Bot, Sparkles, Sliders, Trash2, X, Check } from "lucide-react";
import { Persona } from "@/types/admin";
import { Toast } from "@/components/common/toast";
import { adminApi } from "@/lib/api";

const initialPersonas: Persona[] = [
  {
    id: "p-1",
    name: "Presiden RI",
    lang: "ID",
    style: "Tenang, terstruktur, diplomatis, mengutamakan kepentingan nasional dan keharmonisan sosial.",
    stance: "NEUTRAL",
    usage: "4,120x",
    category: "GOVERNMENT",
  },
  {
    id: "p-2",
    name: "Menteri Keuangan",
    lang: "ID",
    style: "Rasional, tajam berbasis data fiskal, ketat pada efisiensi anggaran dan keberlanjutan APBN.",
    stance: "NEUTRAL",
    usage: "3,890x",
    category: "GOVERNMENT",
  },
  {
    id: "p-3",
    name: "Hakim Mahkamah Konstitusi",
    lang: "ID",
    style: "Analitis, merujuk hierarki perundang-undangan, hak konstitusional warga, dan doktrin hukum.",
    stance: "NEUTRAL",
    usage: "2,450x",
    category: "LEGAL",
  },
  {
    id: "p-4",
    name: "Aktivis Lingkungan",
    lang: "ID",
    style: "Persuasif, retorika krisis iklim, determinasi moral tinggi, menuntut keadilan ekologis.",
    stance: "PRO",
    usage: "1,980x",
    category: "ACTIVIST",
  },
  {
    id: "p-5",
    name: "Silicon Valley Tech CEO",
    lang: "EN",
    style: "Visioner, akseleratif, memprioritaskan disrupsi teknologi, kebebasan inovasi, dan efisiensi pasar.",
    stance: "PRO",
    usage: "3,110x",
    category: "INDUSTRY",
  },
  {
    id: "p-6",
    name: "Harvard Professor",
    lang: "EN",
    style: "Metodis, menguji premis logis, mengutip literatur empiris, membongkar bias kognitif.",
    stance: "NEUTRAL",
    usage: "2,840x",
    category: "ACADEMIC",
  },
];

export function PersonaGrid() {
  const [personas, setPersonas] = useState<Persona[]>(initialPersonas);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [style, setStyle] = useState("");
  const [description, setDescription] = useState("");
  const [lang, setLang] = useState("ID");
  const [stance, setStance] = useState<"PRO" | "CONTRA" | "NEUTRAL">("NEUTRAL");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  useEffect(() => {
    const loadPersonas = async () => {
      const data = await adminApi.getPersonas();
      if (data && Array.isArray(data) && data.length > 0) {
        const mapped: Persona[] = data.map((item: any) => ({
          id: item.id || `p-${Math.random()}`,
          name: item.name || "Persona AI",
          lang: item.language || "ID",
          style: item.speaking_style || item.description || "Gaya bicara belum ditentukan.",
          stance: (item.stance_default || "NEUTRAL") as "PRO" | "CONTRA" | "NEUTRAL",
          usage: "100x",
          category: "GOVERNMENT",
        }));
        setPersonas(mapped);
      }
    };
    loadPersonas();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const result = await adminApi.createPersona({
      name,
      description: description || style,
      speaking_style: style,
      stance_default: stance,
      language: lang,
      is_template: true,
    });

    const newPersona: Persona = {
      id: result?.id || `p-${Date.now()}`,
      name,
      lang,
      style,
      stance,
      usage: "0x",
      category: "GOVERNMENT",
    };

    setPersonas((prev) => [newPersona, ...prev]);
    setIsSubmitting(false);
    setIsModalOpen(false);
    setName("");
    setStyle("");
    setDescription("");
    showToast(`Persona [${name}] berhasil ditambahkan.`);
  };

  const handleDelete = async (id: string, personaName: string) => {
    await adminApi.deletePersona(id);
    setPersonas((prev) => prev.filter((p) => p.id !== id));
    showToast(`Persona [${personaName}] berhasil dihapus.`);
  };

  return (
    <div className="space-y-6">
      <Toast message={toastMsg} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Katalog Persona & Agen AI</h2>
          <p className="text-xs text-slate-400">
            Kelola karakter lawan debat, instruksi sistem gaya bicara, dan stance default.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white font-medium px-4 py-2 rounded-xl text-xs hover:bg-blue-500 flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>+ Tambah Persona Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {personas.map((p) => (
          <div
            key={p.id}
            className="bg-[#0F1422] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-white text-base">{p.name}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {p.lang}
                  </span>
                  <button
                    onClick={() => handleDelete(p.id, p.name)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                    title="Hapus Persona"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-400 line-clamp-3 mt-2">{p.style}</p>
            </div>
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span>
                Dipakai: <b className="text-slate-300 font-mono">{p.usage}</b>
              </span>
              <button
                onClick={() => showToast(`Konfigurasi prompt [${p.name}] dibuka untuk editing.`)}
                className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                <span>Edit Prompt</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah Persona */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0F1422] border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                Tambah Karakter Persona AI
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Persona
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Dosen Filsafat Etika"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Gaya Bicara & Karakter Debat
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Deskripsikan cara berargumentasi, nada suara, dan pola sanggahan..."
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Bahasa Utama
                  </label>
                  <select
                    value={lang}
                    onChange={(e) => setLang(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="ID">Bahasa Indonesia (ID)</option>
                    <option value="EN">English (EN)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Stance Bawaan
                  </label>
                  <select
                    value={stance}
                    onChange={(e) => setStance(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="NEUTRAL">Netral / Menguji</option>
                    <option value="PRO">Afirmatif (PRO)</option>
                    <option value="CONTRA">Oposisi (CONTRA)</option>
                  </select>
                </div>
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
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Menyimpan..." : "Simpan Persona"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
