import RecipeCard from '../../components/RecipeCard';

function RecipeGrid({
    recipes,
    favorites,
    toggleFavorite,
    onRecipeClick,
    loading,
    currentPage,
    onPageChange,
    itemsPerPage = 12
}) {
    const totalPages = Math.ceil(recipes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRecipes = recipes.slice(startIndex, startIndex + itemsPerPage);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill().map((_, i) => (
                    <div key={i} className="bg-surface dark:bg-surface-dark rounded-2xl overflow-hidden border border-border dark:border-border-dark animate-pulse">
                        <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700" />
                        <div className="p-4 space-y-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (recipes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <span className="font-icons text-6xl text-gray-300 dark:text-gray-600 mb-4">search_off</span>
                <h3 className="text-xl font-semibold text-brand-neutral dark:text-white mb-2">
                    No recipes found
                </h3>
                <p className="text-text-secondary max-w-md">
                    Try adjusting your filters or search for something different.
                </p>
            </div>
        );
    }

    return (
        <div>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedRecipes.map((recipe) => (
                    <RecipeCard
                        key={recipe.idMeal}
                        recipe={recipe}
                        variant="default"
                        favorites={favorites}
                        toggleFavorite={toggleFavorite}
                        onRecipeClick={onRecipeClick}
                    />
                ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-border dark:border-border-dark text-text-secondary disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <span className="font-icons">chevron_left</span>
                    </button>

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        const page = i + 1;
                        const isActive = page === currentPage;
                        return (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? 'bg-brand-primary text-white'
                                        : 'text-text-secondary hover:bg-gray-100 dark:hover:bg-white/5'
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}

                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-border dark:border-border-dark text-text-secondary disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <span className="font-icons">chevron_right</span>
                    </button>
                </div>
            )}
        </div>
    );
}

export default RecipeGrid;