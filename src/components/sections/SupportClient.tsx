'use client';

import { useTranslations } from 'next-intl';
import { type Locale } from '@config/locales';
import { useCallback, useRef, useState } from 'react';
import {
  CheckCircle,
  UserRound,
  MessageSquareText,
  PackagePlus,
  ShieldCheck,
  Mail,
  Loader2,
  Send,
  Bug,
  Clock,
  MessageCircle,
} from '@icons';
import type { IconProps } from '@icon/_types';
import MobileBottomNav from '@ui/MobileBottomNav';
import { EXTERNAL_LINKS } from '@config/links';

type MessageType = 'comment' | 'request' | 'report';

const TYPE_ICONS: Record<MessageType, React.ComponentType<IconProps>> = {
  comment: MessageSquareText,
  request: PackagePlus,
  report: Bug,
};

const TYPE_COLORS: Record<MessageType, string> = {
  comment: 'text-[#e9ddff] bg-[#e9ddff]/10',
  request: 'text-[#ffd9e3] bg-[#ffd9e3]/10',
  report: 'text-[#ffb4ab] bg-[#ffb4ab]/10',
};

const FORMSPREE_URL = EXTERNAL_LINKS.FORMSPREE;

export default function SupportClient({ locale }: { locale: Locale }) {
  const t = useTranslations();

  const [messageType, setMessageType] = useState<MessageType>('comment');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const name = nameRef.current?.value.trim() ?? '';
      const email = emailRef.current?.value.trim() ?? '';
      const desc = descRef.current?.value.trim() ?? '';

      if (!name || !email || !desc) {
        setError(t('support_page.validation_all'));
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError(t('support_page.validation_email'));
        return;
      }

      setError('');
      setLoading(true);
      try {
        const form = new FormData();
        form.append('nombre', name);
        form.append('email', email);
        form.append('tipo_mensaje', messageType);
        form.append('descripcion', desc);

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        try {
          const res = await fetch(FORMSPREE_URL, {
            method: 'POST',
            body: form,
            headers: { Accept: 'application/json' },
            signal: controller.signal,
          });

          if (res.ok) {
            setSuccess(true);
          } else {
            throw new Error(t('support_page.failed_submit'));
          }
        } finally {
          clearTimeout(timeoutId);
        }
      } catch {
        setError(t('support_page.error_sending'));
      } finally {
        setLoading(false);
      }
    },
    [messageType, t],
  );

  const typeKeys: MessageType[] = ['comment', 'request', 'report'];
  const typeTitleKeys: Record<MessageType, string> = {
    comment: 'support_page.comment',
    request: 'support_page.request',
    report: 'support_page.report',
  };
  const typeDescKeys: Record<MessageType, string> = {
    comment: 'support_page.comment_desc',
    request: 'support_page.request_desc',
    report: 'support_page.report_desc',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#141317] text-[#e5e1e7]">
      <main className="flex-grow pt-28 pb-24 px-6 max-w-4xl mx-auto w-full">
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-[32px] leading-10 font-semibold text-[#e9ddff] mb-4 font-epilogue">
            {t('support_page.title')}
          </h1>
          <p className="text-base text-[#cac4d0]">{t('support_page.subtitle')}</p>
        </div>

        <div className="bg-[#201f23] rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#e9ddff]/10 blur-[100px] rounded-full" />

          {success ? (
            <div className="text-center py-10 px-5 bg-[#d0bcff]/10 rounded-3xl border border-[#d0bcff]/30">
              <CheckCircle size={48} className="text-[#d0bcff] mb-4 mx-auto" />
              <h3 className="text-[#e9ddff] font-epilogue text-2xl mb-2">
                {t('support_page.success_title')}
              </h3>
              <p className="text-[#cac4d0] mb-6">{t('support_page.success_body')}</p>
              <button
                onClick={() => setSuccess(false)}
                className="bg-[#d0bcff] text-[#37265e] border-none px-6 py-3 rounded-full font-semibold cursor-pointer"
              >
                {t('support_page.success_reset')}
              </button>
            </div>
          ) : (
            <form
              className="space-y-10 relative z-10"
              onSubmit={(e) => {
                void handleSubmit(e);
              }}
            >
              <div>
                <label
                  htmlFor="support-name"
                  className="block text-sm font-medium text-[#cac4d0] mb-3 px-1"
                >
                  {t('support_page.name_label')}
                </label>
                <div className="flex items-center bg-[#353438] border border-[#49454f]/30 rounded-full px-6 py-4 focus-within:border-[#d0bcff] transition-all">
                  <UserRound size={20} className="text-[#d0bcff] mr-4" />
                  <input
                    id="support-name"
                    ref={nameRef}
                    className="bg-transparent border-none outline-none w-full text-[#e5e1e7] placeholder-[#948f9a] text-base font-medium"
                    placeholder={t('support_page.name_placeholder')}
                    type="text"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#cac4d0] mb-4 px-1">
                  {t('support_page.type_label')}
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {typeKeys.map((type) => {
                    const Icon = TYPE_ICONS[type];
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
                            {t(typeTitleKeys[type] as Parameters<typeof t>[0])}
                          </div>
                          <div className="text-[#cac4d0] text-[11px]">
                            {t(typeDescKeys[type] as Parameters<typeof t>[0])}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  id="support-desc"
                  className="block text-sm font-medium text-[#cac4d0] mb-3 px-1"
                >
                  {t('support_page.desc_label')}
                </label>
                <textarea
                  id="support-desc"
                  ref={descRef}
                  className="w-full bg-[#353438] border border-[#49454f]/30 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-[#d0bcff] focus:border-transparent transition-all text-[#e5e1e7] placeholder-[#948f9a] text-sm resize-none outline-none"
                  placeholder={t('support_page.desc_placeholder')}
                  rows={5}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="support-email"
                  className="block text-sm font-medium text-[#cac4d0] mb-3 px-1"
                >
                  {t('support_page.email_label')}
                </label>
                <div className="flex items-center bg-[#353438] border border-[#49454f]/30 rounded-full px-6 py-4 focus-within:ring-2 focus-within:ring-[#d0bcff] transition-all">
                  <Mail size={20} className="text-[#cac4d0] mr-4" />
                  <input
                    id="support-email"
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
        homeHref={`/${locale}`}
        homeLabel={t('support_page.nav_home')}
        activeIcon={MessageCircle}
        activeLabel={t('support_page.nav_support')}
      />
    </div>
  );
}
