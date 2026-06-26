import { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import CategoryChips from './CategoryChips';
import RecipeCard from '../../components/RecipeCard';

const API_BASE = 'https://www.themealdb.com/api/json/v1/1';

function Home({ favorites, toggleFavorite, onRecipeClick, onNavigate }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [recipeOfTheDay, setRecipeOfTheDay] = useState(null);
    const [popularRecipes, setPopularRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar categorías y recetas al montar
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 1. Categorías
                const catRes = await fetch(`${API_BASE}/categories.php`);
                const catData = await catRes.json();
                setCategories(catData.categories || []);

                // 2. Receta aleatoria del día
                const randomRes = await fetch(`${API_BASE}/random.php`);
                const randomData = await randomRes.json();
                setRecipeOfTheDay(randomData.meals?.[0] || null);

                // 3. Recetas populares (4 aleatorias)
                const popularPromises = Array(4).fill().map(() =>
                    fetch(`${API_BASE}/random.php`).then(r => r.json())
                );
                const popularResults = await Promise.all(popularPromises);
                setPopularRecipes(popularResults.map(r => r.meals?.[0]).filter(Boolean));

            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filtrar por categoría seleccionada
    const handleCategorySelect = async (category) => {
        setSelectedCategory(category);
        if (category === 'All') {
            // Recargar populares aleatorios
            const popularPromises = Array(4).fill().map(() =>
                fetch(`${API_BASE}/random.php`).then(r => r.json())
            );
            const popularResults = await Promise.all(popularPromises);
            setPopularRecipes(popularResults.map(r => r.meals?.[0]).filter(Boolean));
        } else {
            // Buscar por categoría
            try {
                const res = await fetch(`${API_BASE}/filter.php?c=${category}`);
                const data = await res.json();
                const meals = data.meals?.slice(0, 4) || [];
                // Necesitamos detalles completos para las tarjetas
                const detailPromises = meals.map(m =>
                    fetch(`${API_BASE}/lookup.php?i=${m.idMeal}`).then(r => r.json())
                );
                const details = await Promise.all(detailPromises);
                setPopularRecipes(details.map(d => d.meals?.[0]).filter(Boolean));
            } catch (error) {
                console.error('Error filtering by category:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="font-icons text-4xl text-brand-primary animate-spin">progress_activity</span>
                    <span className="text-text-secondary text-sm">Loading culinary delights...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            {/* ─── Hero Section ─── */}
            <HeroSection onNavigate={onNavigate} />

            {/* ─── Category Chips ─── */}
            <CategoryChips
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={handleCategorySelect}
            />

            {/* ─── Recipe of the Day ─── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-brand-neutral dark:text-white">
                        Recipe of the Day
                    </h2>
                    <button
                        onClick={() => onNavigate('explore')}
                        className="text-sm text-brand-primary hover:underline font-medium"
                    >
                        View all →
                    </button>
                </div>

                {recipeOfTheDay && (
                    <div className="max-w-4xl mx-auto">
                        <RecipeCard
                            recipe={recipeOfTheDay}
                            variant="featured"
                            favorites={favorites}
                            toggleFavorite={toggleFavorite}
                            onRecipeClick={onRecipeClick}
                        />
                    </div>
                )}
            </section>

            {/* ─── Popular Right Now ─── */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-brand-neutral dark:text-white">
                        Popular Right Now
                    </h2>
                    <button
                        onClick={() => onNavigate('explore')}
                        className="text-sm text-brand-primary hover:underline font-medium"
                    >
                        View all →
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {popularRecipes.map((recipe) => (
                        <RecipeCard
                            key={recipe.idMeal}
                            recipe={recipe}
                            variant="compact"
                            favorites={favorites}
                            toggleFavorite={toggleFavorite}
                            onRecipeClick={onRecipeClick}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}

export default Home;