'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const body = { email: email.trim(), password: pass };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        let msg = 'Falha no login. Verifique suas credenciais.';
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

      try {
        const data = await res.json().catch(() => null);
        const token =
          data?.token ||
          data?.accessToken ||
          data?.jwt ||
          data?.data?.token ||
          null;

        if (token) {
          localStorage.setItem('token', token);
        }
      } catch {}
      window.location.href = '/movies';
    } catch (err: any) {
      setError(err?.message ?? 'Erro inesperado ao tentar entrar.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      className="relative min-h-screen text-white"
      style={
        {
          ['--header-h' as any]: '48px',
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
              title="Tema"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
            >
              ☼
            </button>
            <a
              href="/register"
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow hover:brightness-110"
            >
              Registrar
            </a>
          </div>
        </div>
      </header>

      <section
        className="mx-auto flex w-full max-w-screen-2xl items-center justify-center px-4
                   min-h-[calc(100dvh-var(--header-h)-var(--footer-h))]"
      >
        <div className="mx-auto w-full max-w-md rounded-xl border border-white/10 bg-surface/85 p-5 shadow-[0_25px_40px_-15px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <form onSubmit={onSubmit} className="space-y-4" aria-describedby="login-error" noValidate>
            <div className="space-y-1">
              <label htmlFor="identity" className="block text-[11px] font-semibold opacity-85">
                Nome/E-mail
              </label>
              <input
                id="identity"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu nome/E-mail"
                autoComplete="username email"
                className="w-full rounded-md border border-white/10 bg-black/35 p-3 text-sm outline-none placeholder:text-white/45 focus:border-[#8E4EC6]"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-[11px] font-semibold opacity-85">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                className="w-full rounded-md border border-white/10 bg-black/35 p-3 text-sm outline-none placeholder:text-white/45 focus:border-[#8E4EC6]"
                required
              />
            </div>

            {error && (
              <p id="login-error" className="text-xs text-red-400">
                {error}
              </p>
            )}

            <div className="flex items-center justify-between">
              <a
                href="/forgot-password"
                className="text-xs text-white/70 underline-offset-2 hover:underline"
              >
                Esqueci minha senha
              </a>

              <button
                type="submit"
                disabled={submitting}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow
                           hover:opacity-90 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Entrando…' : 'Entrar'}
              </button>
            </div>
          </form>
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
