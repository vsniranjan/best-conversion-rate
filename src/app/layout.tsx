import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

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
    <html
      lang='en'
      className={cn(inter.className, "font-sans", geist.variable)}
    >
      <body className='max-w-5xl mx-auto px-4 mt-10 bg-[#F7F9FF]'>
        {children}
      </body>
    </html>
  );
}
