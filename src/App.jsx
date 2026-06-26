import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home/Home';
import Explore from './pages/Explore/Explore';
import RecipeDetail from './pages/RecipeDetail/RecipeDetail';
import Favorites from './pages/Favorites/Favorites';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('gourmet-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('gourmet-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((recipe) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.idMeal === recipe.idMeal);
      if (exists) {
        return prev.filter((fav) => fav.idMeal !== recipe.idMeal);
      }
      return [...prev, recipe];
    });
  }, []);

  const handleRecipeClick = useCallback((recipeId) => {
    setSelectedRecipeId(recipeId);
    setCurrentView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const renderView = () => {
    const commonProps = {
      favorites,
      toggleFavorite,
      onRecipeClick: handleRecipeClick,
      onNavigate: setCurrentView,
    };

    switch (currentView) {
      case 'home':
        return <Home {...commonProps} />;
      case 'explore':
        return <Explore {...commonProps} />;
      case 'detail':
        return <RecipeDetail {...commonProps} recipeId={selectedRecipeId} />;
      case 'favorites':
        return <Favorites {...commonProps} />;
      default:
        return <Home {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg dark:bg-bg-dark transition-colors duration-300">
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        favoritesCount={favorites.length}
      />
      <main className="flex-1">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
}

export default App;