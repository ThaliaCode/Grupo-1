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
    // THALIA - Controla la receta  que se muestra en el carrusel de la Receta del Día.
    const [currentRecipeSlide, setCurrentRecipeSlide] = useState(0); 

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
    //  - Mueve el carrusel a la siguiente receta.
    const recipeCarousel = [recipeOfTheDay, ...popularRecipes].filter(Boolean);
    
    const nextRecipeSlide = () => {
    setCurrentRecipeSlide((prev) =>
        prev === recipeCarousel.length - 1 ? 0 : prev + 1
      );
    };
    //  - va al carrusel a la receta anterior
    const prevRecipeSlide = () => {
    setCurrentRecipeSlide((prev) =>
        prev === 0 ? recipeCarousel.length - 1 : prev - 1
      );
    };
// - Cambia automáticamente la imagen del carrusel cada 4 segundos.

    useEffect(() => {
    if (recipeCarousel.length === 0) return;

    const interval = setInterval(() => {
        setCurrentRecipeSlide((prev) =>
            prev === recipeCarousel.length - 1 ? 0 : prev + 1
        );
    }, 4000);

    return () => clearInterval(interval);
}, [recipeCarousel.length]);


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

           {/*  - Main visual carousel for Recipe of the Day */}
  <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="flex items-center justify-between mb-6">
        <div>
            <span className="text-sm font-semibold text-brand-primary uppercase tracking-wide">
                Featured selection
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-brand-neutral dark:text-white">
                Recipe of the Day
            </h2>
        </div>

        <button
            onClick={() => onNavigate('explore')}
            className="text-sm text-brand-primary hover:underline font-medium"
        >
            View all →
        </button>
    </div>

    {recipeCarousel.length > 0 && (
        <div className="relative overflow-hidden rounded-3xl shadow-xl bg-white dark:bg-bg-dark border border-border dark:border-border-dark">
            <img
                src={recipeCarousel[currentRecipeSlide].strMealThumb}
                alt={recipeCarousel[currentRecipeSlide].strMeal}
                className="w-full h-[280px] sm:h-[380px] lg:h-[480px] object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white">
                <span className="inline-block mb-3 px-4 py-1 rounded-full bg-brand-primary text-sm font-semibold">
                    Today&apos;s recommendation
                </span>

                <h3 className="text-2xl sm:text-4xl font-bold mb-3">
                    {recipeCarousel[currentRecipeSlide].strMeal}
                </h3>

                <p className="text-sm sm:text-base text-white/80 max-w-2xl mb-5">
                    Discover a delicious recipe selected for you. Explore its ingredients,
                    preparation and save it as favorite.
                </p>

                <button
                    onClick={() => onRecipeClick(recipeCarousel[currentRecipeSlide].idMeal)}
                    className="px-5 py-3 rounded-full bg-white text-brand-neutral font-semibold hover:bg-brand-primary hover:text-white transition-colors"
                >
                    View recipe
                </button>
            </div>

            <button
                onClick={prevRecipeSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-brand-neutral flex items-center justify-center shadow-md text-2xl"
            >
                ‹
            </button>

            <button
                onClick={nextRecipeSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-brand-neutral flex items-center justify-center shadow-md text-2xl"
            >
                ›
            </button>

            <div className="absolute bottom-4 right-6 flex gap-2">
                {recipeCarousel.map((recipe, index) => (
                    <button
                        key={recipe.idMeal}
                        onClick={() => setCurrentRecipeSlide(index)}
                        className={`h-3 rounded-full transition-all ${
                            currentRecipeSlide === index
                                ? 'w-8 bg-brand-primary'
                                : 'w-3 bg-white/70'
                        }`}
                    ></button>
                ))}
             </div>
          </div>
        )}
   </section> 
{/* final de carrucel de  */}

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