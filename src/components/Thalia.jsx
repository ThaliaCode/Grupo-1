
export function Thalia() {


  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="px-8 py-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold">Grupo 1</h1>
        <p className="text-slate-400 mt-2">
          Proyecto grupal en React con Tailwind
        </p>
      </header>

      <main className="px-8 py-10">
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">
            Bienvenidos al proyecto
          </h2>

          <p className="text-slate-300 mb-8">
            Esta es una primera interfaz para revisar en Vercel antes de pasar los cambios a main.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="text-xl font-bold mb-2">Thalia</h3>
              <p className="text-slate-400">Frontend</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="text-xl font-bold mb-2">Moroni</h3>
              <p className="text-slate-400">Frontend</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
              <h3 className="text-xl font-bold mb-2">Samuel Luis</h3>
              <p className="text-slate-400">Frontend</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

