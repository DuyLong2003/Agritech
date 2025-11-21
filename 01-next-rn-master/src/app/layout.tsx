import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import '@/app/globals.css';

import NextAuthWrapper from "@/library/next.auth.wrapper";
import ReactQueryProvider from "@/library/react-query-provider";
import AntdProvider from "@/app/providers/AntdProvider"; // Import từ vị trí mới

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agritech - Nông nghiệp thông minh",
  description: "Giải pháp quản lý nông trại ứng dụng công nghệ cao",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AntdRegistry>
          <AntdProvider>
            <NextAuthWrapper>
              <ReactQueryProvider>
                {children}
              </ReactQueryProvider>
            </NextAuthWrapper>
          </AntdProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}