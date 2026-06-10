'use client';

import { useTranslations } from 'next-intl';
import { Mail, Send, Loader2, MessageSquareText, ShieldCheck, Clock, MessageCircle } from '@icons';
import { useState, useRef, useCallback } from 'react';
import MobileBottomNav from '@ui/MobileBottomNav';
import type { Locale } from '@config/locales';
import { EXTERNAL_LINKS, PATHS } from '@config/links';

type SupportType = 'bug' | 'feature' | 'question' | 'other';

const TYPE_COLORS: Record<SupportType, string> = {
  bug: 'bg-[#ffb4ab]/20 text-[#ffb4ab]',
  feature: 'bg-[#d0bcff]/20 text-[#d0bcff]',
  question: 'bg-[#fef7ff]/10 text-[#e6e0e9]',
  other: 'bg-[#ccc2dc]/20 text-[#ccc2dc]',
};

export default function SupportClient({ locale }: { locale: Locale }) {
  const t = useTranslations();
  const [messageType, setMessageType] = useState<SupportType>('bug');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError(null);

      const email = emailRef.current?.value;
      const desc = descRef.current?.value;

      try {
        const response = await fetch(EXTERNAL_LINKS.FORMSPREE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, message: `Type: ${messageType}\n\n${desc}` }),
        });

        if (response.ok) {
          setSubmitted(true);
        } else {
          setError(t('support_page.error_sending'));
        }
      } catch {
        setError(t('support_page.error_sending'));
      } finally {
        setLoading(false);
      }
    },
    [messageType, t],
  );

  const typeTitleKeys: Record<SupportType, string> = {
    bug: 'support_page.report',
    feature: 'support_page.request',
    question: 'support_page.comment',
    other: 'support_page.report',
  };

  const typeDescKeys: Record<SupportType, string> = {
    bug: 'support_page.report_desc',
    feature: 'support_page.request_desc',
    question: 'support_page.comment_desc',
    other: 'support_page.report_desc',
  };

  return (
    <div className="min-h-screen bg-[#141317] pb-32">
      <main className="max-w-4xl mx-auto px-6 pt-32">
        <div className="mb-12">
          <h1 className="text-[45px] leading-[52px] font-bold text-[#e5e1e7] mb-4 font-epilogue">
            {t('support_page.title')}
          </h1>
          <p className="text-[#cac4d0] text-lg max-w-2xl">{t('support_page.subtitle')}</p>
        </div>

        <div className="glass-card rounded-[3rem] p-8 md:p-12 border border-white/5">
          {submitted ? (
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 bg-[#d0bcff]/20 text-[#d0bcff] rounded-full flex items-center justify-center mx-auto">
                <Send size={40} />
              </div>
              <h2 className="text-2xl font-bold text-[#e5e1e7]">{t('support_page.success_title')}</h2>
              <p className="text-[#cac4d0] max-w-md mx-auto">{t('support_page.success_body')}</p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-[#d0bcff] text-[#37265e] px-8 py-3 rounded-full font-medium transition-all hover:scale-105"
              >
                {t('support_page.success_reset')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-[#cac4d0] px-1">
                  {t('support_page.type_label')}
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['bug', 'feature', 'question', 'other'] as SupportType[]).map((type) => {
                    const Icon = MessageSquareText;
                    const titleKey = typeTitleKeys[type] as Parameters<typeof t>[0];
                    const descKey = typeDescKeys[type] as Parameters<typeof t>[0];
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setMessageType(type)}
                        className={`h-full bg-[#1c1b1f] border p-6 rounded-2xl transition-all text-left ${messageType === type ? 'bg-[#4a4359] border-[#d0bcff]' : 'border-[#49454f]/30 hover:border-[#948f9a]'}`}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className={`p-3 rounded-full mb-4 ${TYPE_COLORS[type]}`}>
                            <Icon size={24} />
                          </div>
                          <div className="text-[#e5e1e7] font-medium text-base mb-1">
                            {t(titleKey)}
                          </div>
                          <div className="text-[#cac4d0] text-[11px]">
                            {t(descKey)}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#cac4d0] mb-3 px-1">
                  {t('support_page.desc_label')}
                </label>
                <textarea
                  ref={descRef}
                  className="w-full bg-[#353438] border border-[#49454f]/30 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#d0bcff] focus:border-transparent transition-all text-[#e5e1e7] placeholder-[#948f9a] text-sm resize-none outline-none"
                  placeholder={t('support_page.desc_placeholder')}
                  rows={5}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#cac4d0] mb-3 px-1">
                  {t('support_page.email_label')}
                </label>
                <div className="flex items-center bg-[#353438] border border-[#49454f]/30 rounded-full px-6 py-4 focus-within:ring-2 focus-within:ring-[#d0bcff] transition-all">
                  <Mail size={20} className="text-[#cac4d0] mr-4" />
                  <input
                    ref={emailRef}
                    className="bg-transparent border-none outline-none w-full text-[#e5e1e7] placeholder-[#948f9a] text-base font-medium"
                    placeholder={t('support_page.email_placeholder')}
                    type="email"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-[#ffb4ab] text-sm px-1">{error}</p>}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#d0bcff] text-[#594983] font-semibold px-10 py-5 rounded-full hover:shadow-[0_0_30px_rgba(208,188,255,0.4)] transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed group font-epilogue text-lg"
                >
                  {loading ? (
                    <>
                      <span>{t('support_page.sending')}</span>
                      <Loader2 size={20} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      <span>{t('support_page.submit')}</span>
                      <Send size={20} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4 p-6 bg-[#1c1b1f] border border-[#49454f]/20 rounded-2xl">
            <ShieldCheck size={24} className="text-[#d0bcff] flex-shrink-0" />
            <div>
              <h3 className="text-[#e5e1e7] font-medium text-base mb-1">
                {t('support_page.privacy_title')}
              </h3>
              <p className="text-[#cac4d0] text-sm">{t('support_page.privacy_desc')}</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 bg-[#1c1b1f] border border-[#49454f]/20 rounded-2xl">
            <Clock size={24} className="text-[#d0bcff] flex-shrink-0" />
            <div>
              <h3 className="text-[#e5e1e7] font-medium text-base mb-1">
                {t('support_page.response_title')}
              </h3>
              <p className="text-[#cac4d0] text-sm">{t('support_page.response_desc')}</p>
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav
        homeHref={`/${locale}${PATHS.HOME}`}
        homeLabel={t('support_page.nav_home')}
        activeIcon={MessageCircle}
        activeLabel={t('support_page.nav_support')}
      />
    </div>
  );
}
