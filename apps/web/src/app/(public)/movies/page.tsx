'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Movie = {
  id: string | number;
  title: string;
  posterUrl?: string | null;
  genres?: string[];            // opcional
  voteAverage?: number | null;  // 0..100 ou 0..10 -> normalizo abaixo
};

type MoviesResponsePreferred = {
  data: Movie[];
  page: number;
  total: number;
  totalPages: number;
};

// fallback comum (caso sua API devolva outra forma)
type MoviesResponseAlt = {
  items?: Movie[];
  results?: Movie[];
  count?: number;
  pages?: number;
  currentPage?: number;
};

const API =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3333';

const PAGE_SIZE = 12;

export default function MoviesPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // debounce de busca
  const debouncedSearch = useDebouncedValue(search, 400);

  // foco no input ao carregar
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    let cancel = false;
    setLoading(true);
    setError(null);

    const url = new URL(`${API}/movies`);
    if (debouncedSearch.trim()) url.searchParams.set('search', debouncedSearch.trim());
    url.searchParams.set('page', String(page));
    url.searchParams.set('limit', String(PAGE_SIZE));

    fetch(url.toString(), {
      method: 'GET',
      credentials: 'include', // <<— cookie httpOnly
      headers: {
        Accept: 'application/json',
        // Se usar token no localStorage (NÃO recomendado em prod), descomente:
        // ...(localStorage.getItem('token')
        //   ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
        //   : {}),
      },
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
      .then((data: MoviesResponsePreferred & MoviesResponseAlt) => {
        if (cancel) return;

        const list = data.data ?? data.items ?? data.results ?? [];
        const tp = data.totalPages ?? data.pages ?? 1;
        const cp = data.page ?? data.currentPage ?? page;

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
  }, [debouncedSearch, page]);

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
            <a
              href="/movies/new"
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow hover:brightness-110"
            >
              Adicionar Filme
            </a>
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
              gridTemplateColumns:
                'repeat(auto-fill, minmax(min(160px, 100%), 1fr))',
            }}
          >
            {loading && movies.length === 0 && (
              <SkeletonGrid count={PAGE_SIZE} />
            )}

            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}

            {!loading && movies.length === 0 && (
              <p className="col-span-full text-sm text-white/70">
                Nenhum filme encontrado.
              </p>
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
    </main>
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
        {genres && (
          <p className="mt-1 line-clamp-1 text-[11px] text-white/60">{genres}</p>
        )}
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
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={stroke}
        fill="none"
      />
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
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="11"
        fill="#fff"
      >
        {Math.round(value)}%
      </text>
    </svg>
  );
}

function SkeletonGrid({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-lg border border-white/10 bg-white/[0.06] overflow-hidden"
        >
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
