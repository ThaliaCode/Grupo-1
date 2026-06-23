import { useState, useEffect } from 'react';
import IngredientsList from './IngredientsList';
import VideoPlayer from './VideoPlayer';
import { formatMealIngredients, formatInstructions, getEmbedUrl } from '../../utils/mealFormatter';

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

function RecipeDetail({ recipeId, favorites, toggleFavorite, onNavigate }) {
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkedIngredients, setCheckedIngredients] = useState(new Set());

    // Cargar detalles de la receta
    useEffect(() => {
        const fetchRecipe = async () => {
            if (!recipeId) {
                onNavigate('explore');
                return;
            }

            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/lookup.php?i=${recipeId}`);
                const data = await res.json();
                const meal = data.meals?.[0];

                if (meal) {
                    setRecipe(meal);
                    setCheckedIngredients(new Set());
                } else {
                    onNavigate('explore');
                }
            } catch (error) {
                console.error('Error fetching recipe:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [recipeId, onNavigate]);

    const isFavorite = recipe ? favorites.some((fav) => fav.idMeal === recipe.idMeal) : false;

    const handleToggleIngredient = (id) => {
        setCheckedIngredients((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const handleToggleFavorite = () => {
        if (recipe) {
            toggleFavorite(recipe);
        }
    };

    const handleShare = async () => {
        if (navigator.share && recipe) {
            try {
                await navigator.share({
                    title: recipe.strMeal,
                    text: `Check out this recipe: ${recipe.strMeal}`,
                    url: window.location.href,
                });
            } catch {
                // Fallback: copiar al portapapeles
                navigator.clipboard.writeText(window.location.href);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="font-icons text-4xl text-brand-primary animate-spin">progress_activity</span>
                    <span className="text-text-secondary text-sm">Loading recipe...</span>
                </div>
            </div>
        );
    }

    if (!recipe) return null;

    const ingredients = formatMealIngredients(recipe);
    const instructions = formatInstructions(recipe.strInstructions);
    const embedUrl = getEmbedUrl(recipe.strYoutube);

    return (
        <div className="animate-in fade-in duration-500">
            {/* ─── Hero Image ─── */}
            <div className="relative h-75 md:h-100 lg:h-125 overflow-hidden">
                <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                {/* Botón volver */}
                <button
                    onClick={() => onNavigate('explore')}
                    className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm hover:bg-white/30 transition-colors"
                >
                    <span className="font-icons">arrow_back</span>
                    Back
                </button>
            </div>

            {/* ─── Contenido Principal ─── */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
                <div className="bg-surface dark:bg-surface-dark rounded-2xl shadow-xl border border-border dark:border-border-dark p-6 md:p-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div className="flex-1">
                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="px-3 py-1 bg-brand-secondary/10 text-brand-secondary text-xs font-semibold rounded-full">
                                    {recipe.strCategory}
                                </span>
                                <span className="px-3 py-1 bg-brand-tertiary/10 text-brand-tertiary text-xs font-semibold rounded-full">
                                    {recipe.strArea}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-bold text-brand-neutral dark:text-white mb-2">
                                {recipe.strMeal}
                            </h1>

                            <p className="text-text-secondary text-sm leading-relaxed">
                                {recipe.strInstructions?.substring(0, 200)}...
                            </p>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleToggleFavorite}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${isFavorite
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-gray-100 dark:bg-white/5 text-brand-neutral dark:text-white hover:bg-brand-primary hover:text-white'
                                    }`}
                            >
                                <span className={`font-icons ${isFavorite ? 'font-icons-filled' : ''}`}>
                                    favorite
                                </span>
                                {isFavorite ? 'Saved' : 'Save'}
                            </button>

                            <button
                                onClick={handleShare}
                                className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 text-brand-neutral dark:text-white hover:bg-brand-primary hover:text-white transition-colors"
                                aria-label="Share"
                            >
                                <span className="font-icons">share</span>
                            </button>

                            <button
                                onClick={() => window.print()}
                                className="p-2.5 rounded-full bg-gray-100 dark:bg-white/5 text-brand-neutral dark:text-white hover:bg-brand-primary hover:text-white transition-colors"
                                aria-label="Print"
                            >
                                <span className="font-icons">print</span>
                            </button>
                        </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-6 py-4 border-y border-border dark:border-border-dark mb-8">
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <span className="font-icons text-brand-secondary">schedule</span>
                            <span>30 min</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <span className="font-icons text-brand-secondary">restaurant</span>
                            <span>{recipe.strCategory}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-secondary">
                            <span className="font-icons text-brand-secondary">public</span>
                            <span>{recipe.strArea}</span>
                        </div>
                    </div>

                    {/* ─── Layout de 2 columnas ─── */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Columna izquierda: Ingredientes */}
                        <div>
                            <h2 className="text-xl font-bold text-brand-neutral dark:text-white mb-4 flex items-center gap-2">
                                <span className="font-icons text-brand-primary">shopping_basket</span>
                                Ingredients
                                <span className="text-sm font-normal text-text-muted ml-auto">
                                    {checkedIngredients.size}/{ingredients.length} checked
                                </span>
                            </h2>
                            <IngredientsList
                                ingredients={ingredients}
                                checkedIngredients={checkedIngredients}
                                onToggle={handleToggleIngredient}
                            />
                        </div>

                        {/* Columna derecha: Instrucciones */}
                        <div>
                            <h2 className="text-xl font-bold text-brand-neutral dark:text-white mb-4 flex items-center gap-2">
                                <span className="font-icons text-brand-primary">menu_book</span>
                                Instructions
                            </h2>
                            <ol className="space-y-4">
                                {instructions.map((step, index) => (
                                    <li key={index} className="flex gap-4">
                                        <span className="shrink-0 w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold flex items-center justify-center">
                                            {index + 1}
                                        </span>
                                        <p className="text-sm text-text-secondary dark:text-gray-300 leading-relaxed pt-1">
                                            {step}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>

                    {/* ─── Video Section ─── */}
                    {embedUrl && (
                        <div className="mt-10">
                            <h2 className="text-xl font-bold text-brand-neutral dark:text-white mb-4 flex items-center gap-2">
                                <span className="font-icons text-brand-primary">play_circle</span>
                                Watch & Learn
                            </h2>
                            <VideoPlayer embedUrl={embedUrl} thumbnail={recipe.strMealThumb} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default RecipeDetail;