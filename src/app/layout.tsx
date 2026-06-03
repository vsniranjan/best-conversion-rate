import { Inter, Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='max-w-7xl mx-auto px-4 mt-10 bg-[#F7F9FF]'>
        {children}
      </body>
    </html>
  );
}
