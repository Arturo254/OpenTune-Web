import { Opentune as Icon, MulOpentune as MulIcon } from '@icons';

const name = 'Opentune';
const mulName = `Mul${name}`;

export default function IconTestPage() {
  return (
    <div className="test-page">
      <div className="mx-auto max-w-5xl space-y-8">

        <header className="space-y-1.5">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-on-surface)' }}>
              Icon Test
            </h1>
            <span className="test-chip">~test/icon</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            {name} · {mulName} · Sizing · Colors · Tailwind classes
          </p>
        </header>

        <div className="flex flex-wrap gap-4">

          {/* 1 — size= Prop */}
          <div className="test-section min-w-[calc(50%-8px)] flex-1">
            <p className="test-section-title">size= Prop</p>
            <div className="flex flex-wrap items-end gap-4">
              {[16, 24, 32, 48, 64].map((s) => (
                <div key={s} className="flex flex-col items-center">
                  <Icon size={s} style={{ color: 'var(--color-on-surface)' }} />
                  <span className="test-label">{s}px</span>
                </div>
              ))}
            </div>
          </div>

          {/* 2 — Tailwind size-* Classes */}
          <div className="test-section min-w-[calc(50%-8px)] flex-1">
            <p className="test-section-title">Tailwind size-* Classes</p>
            <div className="flex flex-wrap items-end gap-4">
              {(
                ['size-4', 'size-5', 'size-6', 'size-8', 'size-10'] as string[]
              ).map((cls) => (
                <div key={cls} className="flex flex-col items-center">
                  <div
                    className={`${cls} flex items-center justify-center`}
                    style={{ color: 'var(--color-on-surface)' }}
                  >
                    <Icon className="w-full h-full" />
                  </div>
                  <span className="test-label">{cls}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3 — Tailwind Colors via CSS vars */}
          <div className="test-section min-w-[calc(50%-8px)] flex-1">
            <p className="test-section-title">Tailwind Colors</p>
            <div className="flex flex-wrap items-center gap-4">
              {(
                [
                  ['var(--color-red-400)',    'red-400'],
                  ['var(--color-green-400)',  'green-400'],
                  ['var(--color-blue-400)',   'blue-400'],
                  ['var(--color-purple-400)', 'purple'],
                  ['var(--color-amber-400)',  'amber-400'],
                  ['var(--color-cyan-400)',  'cyan-400'],
                ] as [string, string][]
              ).map(([token, label]) => (
                <div key={label} className="flex flex-col items-center">
                  <Icon size={36} style={{ color: token }} />
                  <span className="test-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4 — color= Prop */}
          <div className="test-section min-w-[calc(50%-8px)] flex-1">
            <p className="test-section-title">color= Prop</p>
            <div className="flex flex-wrap items-center gap-4">
              {(
                [
                  '#FF8C00',
                  '#6366F1',
                  '#F72585',
                  '#FF00FF',
                  '#00F5D4',
                  '#84CC16',
                ] as string[]
              ).map((hex) => (
                <div key={hex} className="flex flex-col items-center">
                  <Icon size={36} color={hex} />
                  <span className="test-label">{hex}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 5 — opacity via CSS */}
          <div className="test-section min-w-[calc(50%-8px)] flex-1">
            <p className="test-section-title">CSS opacity</p>
            <div className="flex flex-wrap items-center gap-6">
              {(
                [
                  [1,    '100%'],
                  [0.75, '75%'],
                  [0.50, '50%'],
                  [0.25, '25%'],
                ] as [number, string][]
              ).map(([opacity, label]) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <div className="flex items-center justify-center rounded-lg p-3">
                    <span style={{ opacity }}>
                      <MulIcon size={40} style={{ color: '#f97316' }} />
                    </span>
                  </div>
                  <span className="test-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 6 — Theme Tokens */}
          <div className="test-section min-w-[calc(50%-8px)] flex-1">
            <p className="test-section-title">Theme Tokens</p>
            <div className="flex flex-wrap items-center gap-4">
              {(
                [
                  ['var(--color-primary)',   'primary'],
                  ['var(--color-inverse-primary', 'inverse'],
                  ['var(--color-secondary)', 'secndry'],
                  ['var(--color-tertiary)',  'tertiary'],
                  ['var(--color-error)',     'error'],
                  ['var(--color-error-container', 'errorCont.'],
                ] as [string, string][]
              ).map(([token, label]) => (
                <div key={label} className="flex flex-col items-center">
                  <Icon size={36} style={{ color: token }} />
                  <span className="test-label">{label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Default vs Mul */}
        <section className="test-section">
          <p className="test-section-title">
            {name} vs {mulName}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">

            <div
              className="flex flex-col items-center gap-4 rounded-xl p-6"
              style={{ background: 'var(--color-surface-container-high)' }}
            >
              <Icon size={80} style={{ color: 'var(--color-primary)' }} />
              <div className="space-y-0.5 text-center">
                <p className="text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>
                  {name}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Theme-aware · follows currentColor
                </p>
              </div>
            </div>

            <div
              className="flex flex-col items-center gap-4 rounded-xl p-6"
              style={{ background: 'var(--color-surface-container-high)' }}
            >
              <MulIcon size={80} />
              <div className="space-y-0.5 text-center">
                <p className="text-sm font-medium" style={{ color: 'var(--color-on-surface)' }}>
                  {mulName}
                </p>
                <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Original artwork
                </p>
              </div>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
