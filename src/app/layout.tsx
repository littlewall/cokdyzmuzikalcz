import type {Metadata} from "next";
import {ReactNode} from "react";
import {Fira_Sans} from "next/font/google";
import "./globals.css";

const firaSans = Fira_Sans({
    weight: ["300", "700"],
    subsets: ["latin-ext"]
});

export const metadata: Metadata = {
    title: "Co když..? - nový původní český muzikál",
    description: "Co když se život ze dne na den změní? Dokážeme nechat jít staré a přijmout nové? A co když to nové je vlastně tak dobře známé?",
    authors: {
        name: "Milan Zítka",
        url: "https://milanzitka.cz",
    },
    robots: "index, follow",
    alternates: {
        canonical: "https://cokdyzmuzikal.cz",
    },
    icons: "/logo-favicon.svg"
};

const RootLayout = ({children}: Readonly<{children: ReactNode}>) => (
    <html lang="cs">
        <body className={firaSans.className}>
          {children}
        </body>
    </html>
);

export default RootLayout;
