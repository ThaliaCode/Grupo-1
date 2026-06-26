import { useState } from 'react';

function RecipeCard({
    recipe,
    favorites,
    toggleFavorite,
    onRecipeClick,
    variant = 'default' // 'default' | 'featured' | 'compact'
}) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Verificar si esta receta está en favoritos
    const isFavorite = favorites.some((fav) => fav.idMeal === recipe.idMeal);

    // Manejar click en favorito (evita propagación al card)
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        toggleFavorite(recipe);
    };

    // Manejar click en la tarjeta completa
    const handleCardClick = () => {
        onRecipeClick(recipe.idMeal);
    };

    // Badge de categoría (simulado con strCategory o strTags, fallback a "Recipe")
    const category = recipe.strCategory || 'Recipe';
    const categoryColors = {
        'Vegan': 'bg-brand-secondary/10 text-brand-secondary',
        'Vegetarian': 'bg-brand-secondary/10 text-brand-secondary',
        'Healthy': 'bg-brand-secondary/10 text-brand-secondary',
        'Dessert': 'bg-brand-tertiary/10 text-brand-tertiary',
        'Breakfast': 'bg-brand-tertiary/10 text-brand-tertiary',
        'default': 'bg-brand-primary/10 text-brand-primary'
    };

    // Tiempo de preparación (simulado, la API gratuita no lo tiene)
    const prepTime = recipe.strTags?.includes('30') ? '30m' :
        recipe.strTags?.includes('45') ? '45m' : '20m';

    // Dificultad (simulada)
    const difficulty = recipe.strTags?.includes('Easy') ? 'Easy' :
        recipe.strTags?.includes('Hard') ? 'Hard' : 'Medium';

    // Clases condicionales según variante
    const cardClasses = {
        default: 'group cursor-pointer bg-surface dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-border dark:border-border-dark transition-all duration-300 hover:-translate-y-1',
        featured: 'group cursor-pointer bg-surface dark:bg-surface-dark rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-border dark:border-border-dark transition-all duration-300 hover:-translate-y-1',
        compact: 'group cursor-pointer bg-surface dark:bg-surface-dark rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-border dark:border-border-dark transition-all duration-300 hover:-translate-y-0.5'
    };

    const imageClasses = {
        default: 'aspect-[4/3] w-full object-cover',
        featured: 'aspect-[4/3] w-full object-cover',
        compact: 'aspect-square w-full object-cover'
    };

    return (
        <article
            className={cardClasses[variant] || cardClasses.default}
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
        >
            {/* ─── Imagen Container ─── */}
            <div className="relative overflow-hidden">
                {/* Placeholder mientras carga */}
                {!imageLoaded && !imageError && (
                    <div className={`${imageClasses[variant]} bg-gray-200 dark:bg-gray-700 animate-pulse`} />
                )}

                {/* Imagen real */}
                {!imageError && (
                    <img
                        src={recipe.strMealThumb}
                        alt={recipe.strMeal}
                        className={`${imageClasses[variant]} transition-transform duration-500 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
                            }`}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageError(true)}
                        loading="lazy"
                    />
                )}

                {/* Fallback si la imagen falla */}
                {imageError && (
                    <div className={`${imageClasses[variant]} bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}>
                        <span className="font-icons text-4xl text-gray-300 dark:text-gray-600">restaurant</span>
                    </div>
                )}

                {/* ─── Badge de Categoría ─── */}
                <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors[category] || categoryColors.default
                        }`}>
                        {category}
                    </span>
                </div>

                {/* ─── Botón de Favorito ─── */}
                <button
                    onClick={handleFavoriteClick}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-all duration-200"
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                    <span className={`font-icons text-lg transition-colors duration-200 ${isFavorite
                            ? 'font-icons-filled text-brand-primary'
                            : 'text-gray-400 hover:text-brand-primary'
                        }`}>
                        favorite
                    </span>
                </button>
            </div>

            {/* ─── Contenido ─── */}
            <div className="p-4">
                {/* Meta info: tiempo y dificultad */}
                <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                        <span className="font-icons text-sm">schedule</span>
                        {prepTime}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-text-muted">
                        <span className="font-icons text-sm">trending_up</span>
                        {difficulty}
                    </span>
                </div>

                {/* Título */}
                <h3 className="font-semibold text-brand-neutral dark:text-white text-sm leading-tight line-clamp-2 group-hover:text-brand-primary transition-colors">
                    {recipe.strMeal}
                </h3>
            </div>
        </article>
    );
}

export default RecipeCard;