import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Brand Carousel Showcase',
  description: 'Interactive brand showcase carousel for e-commerce landing pages.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
