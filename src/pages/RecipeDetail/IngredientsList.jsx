function IngredientsList({ ingredients, checkedIngredients, onToggle }) {
    const allChecked = checkedIngredients.size === ingredients.length && ingredients.length > 0;
    const someChecked = checkedIngredients.size > 0 && !allChecked;

    const handleToggleAll = () => {
        if (allChecked) {
            // Desmarcar todos
            ingredients.forEach(ing => onToggle(ing.id));
        } else {
            // Marcar todos
            ingredients.forEach(ing => {
                if (!checkedIngredients.has(ing.id)) {
                    onToggle(ing.id);
                }
            });
        }
    };

    return (
        <div className="space-y-2">
            {/* Checkbox "Select All" */}
            {ingredients.length > 0 && (
                <button
                    onClick={handleToggleAll}
                    className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors mb-2"
                >
                    <span className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${allChecked
                            ? 'bg-brand-primary border-brand-primary'
                            : someChecked
                                ? 'bg-brand-primary/50 border-brand-primary'
                                : 'border-gray-300 dark:border-gray-600'
                        }`}>
                        {(allChecked || someChecked) && (
                            <span className="font-icons text-white text-xs">check</span>
                        )}
                    </span>
                    <span className="text-sm font-medium text-brand-neutral dark:text-white">
                        {allChecked ? 'Deselect all' : 'Select all'}
                    </span>
                </button>
            )}

            {/* Lista de ingredientes */}
            {ingredients.map((ingredient) => {
                const isChecked = checkedIngredients.has(ingredient.id);

                return (
                    <label
                        key={ingredient.id}
                        className={`flex items-center gap-3 w-full px-3 py-3 rounded-xl border transition-all cursor-pointer ${isChecked
                                ? 'bg-brand-secondary/5 border-brand-secondary/20'
                                : 'bg-gray-50 dark:bg-white/5 border-transparent hover:bg-gray-100 dark:hover:bg-white/10'
                            }`}
                    >
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => onToggle(ingredient.id)}
                            className="sr-only"
                        />

                        <span className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isChecked
                                ? 'bg-brand-secondary border-brand-secondary'
                                : 'border-gray-300 dark:border-gray-600'
                            }`}>
                            {isChecked && (
                                <span className="font-icons text-white text-xs">check</span>
                            )}
                        </span>

                        <div className="flex-1 min-w-0">
                            <span className={`text-sm font-medium block ${isChecked
                                    ? 'text-brand-secondary line-through opacity-70'
                                    : 'text-brand-neutral dark:text-white'
                                }`}>
                                {ingredient.name}
                            </span>
                            {ingredient.measure && (
                                <span className={`text-xs ${isChecked ? 'text-brand-secondary/60' : 'text-text-muted'
                                    }`}>
                                    {ingredient.measure}
                                </span>
                            )}
                        </div>
                    </label>
                );
            })}
        </div>
    );
}

export default IngredientsList;