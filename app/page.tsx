export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Bienvenue sur votre application Next.js!
        </h1>
        <div className="border-l-[15px] border-r-[15px] border-b-[26px] border-l-transparent border-r-transparent border-b-black">
                    <p className="mt-3 text-2xl">
          Commencez par modifier ce fichier <code>app/page.tsx</code>
        </p>
        </div>

      </main>
    </div>
  );
} 