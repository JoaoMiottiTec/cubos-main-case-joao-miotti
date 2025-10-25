'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Movie = {
  id: string | number;
  title: string;
  posterUrl?: string | null;
  genres?: string[];
  voteAverage?: number | null;
  userId?: string;
};

const API_BASE = '/api';
const PAGE_SIZE = 12;

export default function MoviesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const debouncedSearch = useDebouncedValue(search, 400);

  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    setError(null);

    const url = new URL(`${API_BASE}/movies`, window.location.origin);
    if (debouncedSearch.trim()) url.searchParams.set('search', debouncedSearch.trim());
    url.searchParams.set('page', String(page));
    url.searchParams.set('pageSize', String(PAGE_SIZE));

    const headers: Record<string, string> = { Accept: 'application/json' };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) headers.Authorization = `Bearer ${token}`;
    }

    fetch(url.toString().replace(window.location.origin, ''), {
      method: 'GET',
      credentials: 'include',
      headers,
    })
      .then(async (res) => {
        if (!res.ok) {
          let msg = `Erro ${res.status}`;
          try {
            const data = await res.json();
            msg =
              data?.message ||
              data?.error ||
              data?.msg ||
              (Array.isArray(data?.errors) ? data.errors[0] : msg);
          } catch {}
          throw new Error(msg);
        }
        return res.json();
      })
      .then((raw: any) => {
        if (cancel) return;

        const payload = raw?.data ?? raw ?? {};
        const list: Movie[] = payload.items ?? payload.results ?? payload.data ?? [];
        const total: number =
          payload.total ?? payload.count ?? (Array.isArray(list) ? list.length : 0);
        const cp: number = payload.page ?? payload.currentPage ?? page;
        const ps: number = payload.pageSize ?? PAGE_SIZE;

        const tp: number =
          payload.totalPages ?? payload.pages ?? Math.max(1, Math.ceil(total / (ps || PAGE_SIZE)));

        setMovies(list);
        setTotalPages(tp || 1);
        if (cp !== page) setPage(cp);
      })
      .catch((err: any) => {
        if (cancel) return;
        setError(err?.message ?? 'Falha ao carregar filmes.');
      })
      .finally(() => {
        if (!cancel) setLoading(false);
      });

    return () => {
      cancel = true;
    };
  }, [debouncedSearch, page, reloadKey]);

  const pages = useMemo(() => {
    const max = Math.max(1, totalPages);
    const around = 2;
    const start = Math.max(1, page - around);
    const end = Math.min(max, page + around);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [page, totalPages]);

  return (
    <main
      className="relative min-h-screen text-white"
      style={
        {
          ['--header-h' as any]: '56px',
          ['--footer-h' as any]: '56px',
        } as React.CSSProperties
      }
    >
      <div className="hero-cinema" aria-hidden="true" />
      <div className="hero-fade" aria-hidden="true" />

      <header className="w-full bg-black text-white h-[var(--header-h)]">
        <div className="mx-auto flex h-full w-full max-w-screen-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img
              src="/cubos-logo.jpg"
              alt="Logo Cubos"
              className="h-5 w-auto brightness-0 invert"
              draggable="false"
            />
            <span className="text-sm font-medium text-white/90">Movies</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
              title="Filtros (em breve)"
            >
              Filtros
            </button>

            {/* ✅ abre modal */}
            <button
              type="button"
              onClick={() => setShowAdd(true)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow hover:brightness-110"
            >
              Adicionar Filme
            </button>

            <button
              type="button"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
              title="Tema"
            >
              ☼
            </button>
            <a
              href="/login"
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow hover:brightness-110"
              title="Sair"
            >
              Logout
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto w-full max-w-screen-2xl px-4 pt-4 pb-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="relative w-full max-w-md">
            <input
              ref={inputRef}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Pesquise por filmes"
              className="w-full rounded-md border border-white/10 bg-black/35 p-3 pl-9 text-sm outline-none placeholder:text-white/45 focus:border-[#8E4EC6]"
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs opacity-70">
              🔎
            </span>
          </div>
        </div>

        {error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : (
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(160px, 100%), 1fr))',
            }}
          >
            {loading && movies.length === 0 && <SkeletonGrid count={PAGE_SIZE} />}

            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}

            {!loading && movies.length === 0 && (
              <p className="col-span-full text-sm text-white/70">Nenhum filme encontrado.</p>
            )}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-1">
          <button
            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-50"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ◀
          </button>
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded-md px-3 py-1 text-xs border ${
                p === page
                  ? 'bg-primary border-transparent'
                  : 'bg-white/5 hover:bg-white/10 border-white/10'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs hover:bg-white/10 disabled:opacity-50"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            ▶
          </button>
        </div>
      </section>

      <footer className="mx-auto w-full max-w-screen-2xl px-4 pb-4 h-[var(--footer-h)]">
        <p className="text-center text-[11px] text-white/70">
          2025 © Todos os direitos reservados a <span className="font-medium">Cubos Movies</span>
        </p>
      </footer>

      {showAdd && (
        <AddMovieModal
          onClose={() => setShowAdd(false)}
          onCreated={() => {
            setShowAdd(false);
            setReloadKey((k) => k + 1);
            setPage(1);
          }}
        />
      )}
    </main>
  );
}


function AddMovieModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [releaseDate, setReleaseDate] = useState('');
  const [duration, setDuration] = useState<number | ''>('');
  const [status, setStatus] = useState<'PLANNED' | 'IN_PRODUCTION' | 'RELEASED' | 'CANCELLED'>(
    'RELEASED'
  );
  const [genres, setGenres] = useState('');
  const [description, setDescription] = useState('');
  const [poster, setPoster] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (poster) {
      const url = URL.createObjectURL(poster);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [poster]);

  function parseGenres(input: string) {
    return input
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  async function uploadPosterIfNeeded(file: File | null): Promise<string | null> {
    if (!file) return null;

    // pede URL pré-assinada
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) headers.Authorization = `Bearer ${token}`;

    const presignRes = await fetch('/api/storage/presign', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type || 'application/octet-stream',
        folder: 'posters',
      }),
    });

    if (!presignRes.ok) {
      let msg = 'Falha ao obter URL de upload.';
      try {
        const d = await presignRes.json();
        msg = d?.message || d?.error || msg;
      } catch {}
      throw new Error(msg);
    }

    const presignData = await presignRes.json();
    const p = presignData?.data ?? presignData ?? {};
    const uploadUrl: string = p.uploadUrl || p.url;
    const publicUrl: string | undefined = p.publicUrl || p.cdnUrl || p.viewUrl;

    if (!uploadUrl) throw new Error('Resposta de presign inválida.');

    // faz upload direto para o bucket
    const putRes = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type || 'application/octet-stream' },
      body: file,
    });
    if (!putRes.ok) {
      throw new Error('Falha no upload do poster.');
    }

    // retorna a URL pública (se existir)
    return publicUrl ?? null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !releaseDate || !duration) return;

    setSubmitting(true);
    setError(null);

    try {
      // 1) upload do poster (opcional)
      const posterUrl = await uploadPosterIfNeeded(poster);

      // 2) montar payload do filme
      const payload = {
        title: title.trim(),
        originalTitle: undefined,
        tagline: undefined,
        description: description.trim() || undefined,
        releaseDate,
        durationMinutes: Number(duration),
        status,
        originalLanguage: undefined,
        posterUrl: posterUrl ?? undefined,
        trailerUrl: undefined,
        popularity: undefined,
        voteCount: undefined,
        voteAverage: undefined,
        budgetUSD: undefined,
        revenueUSD: undefined,
        profitUSD: undefined,
        genres: parseGenres(genres),
      };

      // 3) criar filme
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch('/api/movies', {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = 'Falha ao cadastrar filme.';
        try {
          const d = await res.json();
          msg =
            d?.message ||
            d?.error ||
            (Array.isArray(d?.details) ? d.details[0]?.message : msg);
        } catch {}
        throw new Error(msg);
      }

      onCreated();
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao cadastrar filme.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end">
      <button
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Fechar"
        onClick={onClose}
      />

      <div className="relative h-full w-full max-w-lg overflow-y-auto border-l border-white/10 bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Adicionar Filme</h2>
          <button
            onClick={onClose}
            className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold opacity-85">Título</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-md border border-white/10 bg-black/35 p-3 text-sm outline-none placeholder:text-white/45 focus:border-[#8E4EC6]"
                placeholder="Ex.: Duna – Parte Dois"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold opacity-85">Lançamento</label>
              <input
                type="date"
                value={releaseDate}
                onChange={(e) => setReleaseDate(e.target.value)}
                required
                className="w-full rounded-md border border-white/10 bg-black/35 p-3 text-sm outline-none focus:border-[#8E4EC6]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold opacity-85">Duração (min)</label>
              <input
                type="number"
                min={1}
                value={duration}
                onChange={(e) => setDuration(e.target.value ? Number(e.target.value) : '')}
                required
                className="w-full rounded-md border border-white/10 bg-black/35 p-3 text-sm outline-none focus:border-[#8E4EC6]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold opacity-85">Status</label>
              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value as 'PLANNED' | 'IN_PRODUCTION' | 'RELEASED' | 'CANCELLED')
                }
                className="w-full rounded-md border border-white/10 bg-black/35 p-3 text-sm outline-none focus:border-[#8E4EC6]"
              >
                <option value="PLANNED">PLANNED</option>
                <option value="IN_PRODUCTION">IN_PRODUCTION</option>
                <option value="RELEASED">RELEASED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold opacity-85">Gêneros</label>
              <input
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                placeholder="AÇÃO, AVENTURA, FICÇÃO… (separar por vírgula)"
                className="w-full rounded-md border border-white/10 bg-black/35 p-3 text-sm outline-none placeholder:text-white/45 focus:border-[#8E4EC6]"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[11px] font-semibold opacity-85">Descrição</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-md border border-white/10 bg-black/35 p-3 text-sm outline-none focus:border-[#8E4EC6]"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[11px] font-semibold opacity-85">Poster (opcional)</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPoster(e.target.files?.[0] ?? null)}
                />
                {preview && (
                  <img
                    src={preview}
                    alt="preview"
                    className="h-20 w-14 rounded-md object-cover ring-1 ring-white/10"
                  />
                )}
              </div>
              <p className="mt-1 text-[11px] text-white/60">
                Se escolher uma imagem, ela será enviada ao storage antes de salvar o filme.
              </p>
            </div>
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm hover:bg-white/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? 'Adicionando…' : 'Adicionar Filme'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function MovieCard({ movie }: { movie: Movie }) {
  const pct = normalizeVote(movie.voteAverage);
  const genres = movie.genres?.join(', ');

  return (
    <a
      href={`/movies/${movie.id}`}
      className="group block rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors overflow-hidden"
      title={movie.title}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-black/40">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover object-center transition-transform group-hover:scale-[1.02]"
            draggable="false"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-white/50">
            Sem imagem
          </div>
        )}

        {pct !== null && (
          <div className="absolute left-2 top-2">
            <Ring value={pct} />
          </div>
        )}
      </div>

      <div className="p-2">
        <h3 className="line-clamp-2 text-[13px] font-semibold">{movie.title}</h3>
        {genres && <p className="mt-1 line-clamp-1 text-[11px] text-white/60">{genres}</p>}
      </div>
    </a>
  );
}

function Ring({ value }: { value: number }) {
  const size = 40;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;

  return (
    <svg width={size} height={size} className="drop-shadow">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.2)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="white"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={`${dash} ${circ - dash}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="11" fill="#fff">
        {Math.round(value)}%
      </text>
    </svg>
  );
}

function SkeletonGrid({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-lg border border-white/10 bg-white/[0.06] overflow-hidden">
          <div className="aspect-[2/3] bg-white/10" />
          <div className="p-2 space-y-2">
            <div className="h-3 w-3/4 bg-white/10 rounded" />
            <div className="h-2 w-1/2 bg-white/10 rounded" />
          </div>
        </div>
      ))}
    </>
  );
}

function useDebouncedValue<T>(value: T, delay = 300) {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return d;
}

function normalizeVote(v?: number | null): number | null {
  if (v == null) return null;
  if (v <= 10) return Math.max(0, Math.min(100, (v / 10) * 100));
  return Math.max(0, Math.min(100, v));
}
