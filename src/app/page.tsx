export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Welcome to My Static Site
        </h1>
        <p className="text-center text-lg mb-4">
          This site is built with Next.js and deployed to GitHub Pages
        </p>
        <div className="text-center">
          <a
            href="https://github.com/your-username/color-recall"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 underline"
          >
            View on GitHub
          </a>
        </div>
      </div>
    </main>
  );
}
