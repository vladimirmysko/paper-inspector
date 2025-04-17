import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { Theme } from '@radix-ui/themes';

import '@radix-ui/themes/styles.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
  weight: 'variable',
  axes: ['opsz'],
});

export const metadata: Metadata = {
  title: 'Paper Inspector',
  description:
    'Paper Inspector - инструмент для анализа и проверки работ студентов',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={inter.variable}
      style={{ scrollBehavior: 'smooth' }}
    >
      <body style={{ textRendering: 'optimizeLegibility' }}>
        <Theme
          accentColor="gray"
          grayColor="gray"
          panelBackground="solid"
          radius="medium"
        >
          {children}
        </Theme>
      </body>
    </html>
  );
}
