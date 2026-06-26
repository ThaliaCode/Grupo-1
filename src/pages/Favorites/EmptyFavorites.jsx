function EmptyFavorites({ onNavigate }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 md:py-28 px-4">
            {/* Ilustración/Icono */}
            <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                    <span className="font-icons text-5xl text-gray-300 dark:text-gray-600">
                        restaurant
                    </span>
                </div>
                {/* Decoración sutil */}
                <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                    <span className="font-icons text-brand-primary text-sm">favorite_border</span>
                </div>
            </div>

            {/* Texto */}
            <h2 className="text-xl font-bold text-brand-neutral dark:text-white mb-2 text-center">
                You haven't saved any recipes yet
            </h2>
            <p className="text-sm text-text-secondary text-center max-w-md mb-8 leading-relaxed">
                Discover new culinary delights and build your perfect menu. Your saved recipes will appear here.
            </p>

            {/* CTA */}
            <button
                onClick={() => onNavigate('explore')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-red-700 text-white font-medium text-sm rounded-full transition-colors shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30"
            >
                <span className="font-icons">explore</span>
                Start Exploring
            </button>
        </div>
    );
}

export default EmptyFavorites;