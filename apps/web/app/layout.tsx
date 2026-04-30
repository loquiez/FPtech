import type { Metadata } from 'next';
import { Montserrat, Montserrat_Alternates } from 'next/font/google';
import VpnWatcher from '@/components/VpnWatcher';
import './globals.css';

const fontSans = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const fontDisplay = Montserrat_Alternates({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FPtech — система выявления рисков на международном уровне',
  description:
    'Проверка контрагентов и физических лиц не только в России, но и за её пределами. Санкционные риски, трансграничные связи и скрытые зависимости — в одном отчёте.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" data-theme="dark" className={`${fontSans.variable} ${fontDisplay.variable}`}>
      <body>
        {children}
        <VpnWatcher />
      </body>
    </html>
  );
}
