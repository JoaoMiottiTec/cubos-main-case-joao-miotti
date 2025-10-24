'use client';

import { useMemo, useState } from 'react';

type FormState = {
  name: string;
  email: string;
  password: string;
  confirm: string;
};

const API = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  const emailValid = useMemo(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email), [form.email]);
  const passStrongEnough = form.password.length >= 8;
  const passMatch = form.password === form.confirm;

  const canSubmit =
    form.name.trim().length >= 2 && emailValid && passStrongEnough && passMatch && !submitting;

  function update<K extends keyof FormState>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((s) => ({ ...s, [key]: e.target.value }));
  }

  function pickErrMsg(data: any, fallback = 'Erro ao realizar cadastro.') {
    if (!data) return fallback;
    if (typeof data === 'string') return data;
    if (data.message) return Array.isArray(data.message) ? data.message[0] : data.message;
    if (data.error) return data.error;
    if (data.msg) return data.msg;
    if (Array.isArray(data.issues) && data.issues.length) return data.issues[0];
    if (Array.isArray(data.errors) && data.errors.length) return data.errors[0];
    return fallback;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };

      const res = await fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        // se sua API usa cookie httpOnly, habilite:
        // credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let msg = 'Falha ao cadastrar.';
        try {
          const data = await res.json();
          if (res.status === 409) msg = 'E-mail já cadastrado.';
          else msg = pickErrMsg(data, msg);
        } catch {}
        throw new Error(msg);
      }

      const data = await res.json();

      setSuccess('Cadastro realizado com sucesso! Redirecionando…');
      setTimeout(() => {
        window.location.href = '/login';
      }, 900);
    } catch (err: any) {
      setError(err?.message ?? 'Erro inesperado ao cadastrar.');
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
            <a
              href="/login"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs hover:bg-white/10"
              title="Ir para Login"
            >
              Entrar
            </a>
            <button
              type="button"
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow hover:brightness-110"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <section
        className="mx-auto flex w-full max-w-screen-2xl items-center justify-center px-4
                   min-h-[calc(100dvh-var(--header-h)-var(--footer-h))]"
      >
        <div className="mx-auto w-full max-w-md rounded-xl border border-white/10 bg-surface/85 p-5 shadow-[0_25px_40px_-15px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-1">
              <label htmlFor="name" className="block text-[11px] font-semibold opacity-85">
                Nome
              </label>
              <input
                id="name"
                value={form.name}
                onChange={update('name')}
                placeholder="Digite seu nome"
                autoComplete="name"
                className="w-full rounded-md border border-white/10 bg-black/35 p-3 text-sm outline-none placeholder:text-white/45 focus:border-[#8E4EC6]"
                required
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="email" className="block text-[11px] font-semibold opacity-85">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={update('email')}
                placeholder="Digite seu email"
                autoComplete="email"
                className={`w-full rounded-md border bg-black/35 p-3 text-sm outline-none placeholder:text-white/45 focus:border-[#8E4EC6] ${
                  form.email
                    ? emailValid
                      ? 'border-white/10'
                      : 'border-red-500/60'
                    : 'border-white/10'
                }`}
                required
              />
              {form.email && !emailValid && (
                <p className="text-xs text-red-400">E-mail inválido.</p>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-[11px] font-semibold opacity-85">
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={update('password')}
                  placeholder="Digite sua senha"
                  autoComplete="new-password"
                  className={`w-full rounded-md border bg-black/35 p-3 pr-12 text-sm outline-none placeholder:text-white/45 focus:border-[#8E4EC6] ${
                    form.password && !passStrongEnough ? 'border-amber-500/60' : 'border-white/10'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/70 hover:text-white/90"
                  aria-label={showPass ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPass ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              <p className="text-[11px] text-white/60">
                Mínimo de <span className="font-semibold text-white/80">8</span> caracteres.
              </p>
            </div>

            <div className="space-y-1">
              <label htmlFor="confirm" className="block text-[11px] font-semibold opacity-85">
                Confirmação de senha
              </label>
              <input
                id="confirm"
                type={showPass ? 'text' : 'password'}
                value={form.confirm}
                onChange={update('confirm')}
                placeholder="Digite sua senha novamente"
                autoComplete="new-password"
                className={`w-full rounded-md border bg-black/35 p-3 text-sm outline-none placeholder:text-white/45 focus:border-[#8E4EC6] ${
                  form.confirm && !passMatch ? 'border-red-500/60' : 'border-white/10'
                }`}
                required
              />
              {form.confirm && !passMatch && (
                <p className="text-xs text-red-400">As senhas não conferem.</p>
              )}
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
            {success && <p className="text-xs text-emerald-400">{success}</p>}

            <div className="flex items-center justify-between">
              <a href="/login" className="text-xs text-white/70 underline-offset-2 hover:underline">
                Já tenho conta
              </a>

              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow
                           hover:opacity-90 active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Cadastrando…' : 'Cadastrar'}
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
