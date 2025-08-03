import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* This script loads Tailwind CSS for the entire application */}
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <body className="bg-gray-800">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
