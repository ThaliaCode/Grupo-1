import { useState } from 'react';

function HeroSection({ onNavigate }) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Guardar en sessionStorage para que Explore lo use
            sessionStorage.setItem('home-search', searchQuery.trim());
            onNavigate('explore');
        }
    };

    return (
        <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
            {/* Imagen de fondo con overlay */}
            <div className="absolute inset-0">
                <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&auto=format&fit=crop"
                    alt="Culinary background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
            </div>

            {/* Contenido */}
            <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                    Discover Culinary{' '}
                    <span className="text-brand-primary">Masterpieces</span>
                </h1>

                <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                    Elevate your home cooking with professionally curated recipes,
                    stunning photography, and a community of passionate food lovers.
                </p>

                {/* Barra de búsqueda */}
                <form onSubmit={handleSearch} className="max-w-xl mx-auto">
                    <div className="flex items-center bg-white/95 dark:bg-white/10 backdrop-blur-md rounded-full p-2 shadow-2xl border border-white/20">
                        <span className="font-icons text-gray-400 dark:text-gray-300 text-xl ml-3">search</span>
                        <input
                            type="text"
                            placeholder="Search for recipes, ingredients, or cuisines..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 bg-transparent px-4 py-2 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none text-sm md:text-base"
                        />
                        <button
                            type="submit"
                            className="bg-brand-primary hover:bg-red-700 text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors duration-200 flex items-center gap-2"
                        >
                            Search
                            <span className="font-icons text-sm">arrow_forward</span>
                        </button>
                    </div>
                </form>

                {/* Tags rápidos */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                    {['Italian', 'Mexican', 'Japanese', 'Desserts'].map((tag) => (
                        <button
                            key={tag}
                            onClick={() => {
                                sessionStorage.setItem('home-search', tag);
                                onNavigate('explore');
                            }}
                            className="px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm hover:bg-white/20 transition-colors"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HeroSection;