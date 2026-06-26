import RecipeCard from '../../components/RecipeCard';
import EmptyFavorites from './EmptyFavorites';

function Favorites({ favorites, toggleFavorite, onRecipeClick, onNavigate }) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-brand-neutral dark:text-white mb-2">
                    My Favorite Recipes
                </h1>
                <p className="text-text-secondary text-sm md:text-base max-w-xl">
                    Your curated collection of culinary inspirations. Ready to be cooked and enjoyed.
                </p>
            </div>

            {/* Contenido condicional */}
            {favorites.length === 0 ? (
                <EmptyFavorites onNavigate={onNavigate} />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favorites.map((recipe) => (
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
            )}
        </div>
    );
}

export default Favorites;