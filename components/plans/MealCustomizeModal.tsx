"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, RefreshCw } from "lucide-react"
import { RECIPES, INGREDIENTS, calculateRecipeMacros } from "@/lib/recipes"

interface MealCustomizeModalProps {
  planId: string
  dayId: string
  mealId: string
  meal: {
    id: string
    mealType: string
    recipeId: string
    recipeName: string
    calories: number
    proteinG: number
    fatG: number
    carbG: number
    ingredients: any[]
  }
  onClose: () => void
  onUpdate: () => void
}

export function MealCustomizeModal({
  planId,
  dayId,
  mealId,
  meal,
  onClose,
  onUpdate,
}: MealCustomizeModalProps) {
  const [activeTab, setActiveTab] = useState<"swap" | "customize">("swap")
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
  const [ingredientPortions, setIngredientPortions] = useState<Record<string, number>>({})
  const [updating, setUpdating] = useState(false)
  const [calculatedMacros, setCalculatedMacros] = useState({
    calories: meal.calories,
    proteinG: meal.proteinG,
    fatG: meal.fatG,
    carbG: meal.carbG,
  })

  // Initialize ingredient portions from meal
  useEffect(() => {
    const portions: Record<string, number> = {}
    if (meal.ingredients && Array.isArray(meal.ingredients)) {
      meal.ingredients.forEach((ing: any) => {
        if (ing.id && ing.grams) {
          portions[ing.id] = ing.grams
        }
      })
    }
    setIngredientPortions(portions)
  }, [meal])

  // Get available recipes for swapping
  const availableRecipes = RECIPES.filter((r) => r.mealType === meal.mealType)

  // Calculate macros when ingredients change
  useEffect(() => {
    if (activeTab === "customize" && Object.keys(ingredientPortions).length > 0) {
      const currentRecipe = RECIPES.find((r) => r.id === meal.recipeId)
      if (currentRecipe) {
        const macros = calculateRecipeMacros(currentRecipe, ingredientPortions)
        setCalculatedMacros(macros)
      }
    }
  }, [ingredientPortions, activeTab, meal.recipeId])

  const handleSwapMeal = async () => {
    if (!selectedRecipeId) return

    try {
      setUpdating(true)
      const response = await fetch(
        `/api/plans/${planId}/days/${dayId}/meals/${mealId}/swap`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipeId: selectedRecipeId }),
        }
      )

      if (!response.ok) throw new Error("Failed to swap meal")
      onUpdate()
      onClose()
    } catch (error) {
      console.error("Error swapping meal:", error)
    } finally {
      setUpdating(false)
    }
  }

  const handleCustomizeIngredients = async () => {
    try {
      setUpdating(true)
      const ingredientsArray = Object.entries(ingredientPortions).map(([id, grams]) => {
        const ingredient = INGREDIENTS[id]
        return {
          id,
          name: ingredient?.name || id,
          grams,
        }
      })

      const response = await fetch(`/api/plans/${planId}/days/${dayId}/meals/${mealId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients: ingredientsArray }),
      })

      if (!response.ok) throw new Error("Failed to update meal")
      onUpdate()
      onClose()
    } catch (error) {
      console.error("Error customizing meal:", error)
    } finally {
      setUpdating(false)
    }
  }

  const handleIngredientChange = (ingredientId: string, grams: number) => {
    setIngredientPortions((prev) => ({
      ...prev,
      [ingredientId]: Math.max(0, grams),
    }))
  }

  const currentRecipe = RECIPES.find((r) => r.id === meal.recipeId)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/20">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-white/10 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold">Customize Meal</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-white/10">
            <button
              onClick={() => setActiveTab("swap")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "swap"
                  ? "border-b-2 border-[#18c260] text-[#18c260]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Swap Meal
            </button>
            <button
              onClick={() => setActiveTab("customize")}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === "customize"
                  ? "border-b-2 border-[#18c260] text-[#18c260]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Customize Ingredients
            </button>
          </div>

          {/* Swap Meal Tab */}
          {activeTab === "swap" && (
            <div className="space-y-4">
              <p className="text-white/70 mb-4">
                Choose a different recipe for this meal
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto">
                {availableRecipes.map((recipe) => (
                  <button
                    key={recipe.id}
                    onClick={() => setSelectedRecipeId(recipe.id)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      selectedRecipeId === recipe.id
                        ? "border-[#18c260] bg-[#18c260]/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <h3 className="font-semibold mb-1">{recipe.name}</h3>
                    <p className="text-sm text-white/70 mb-2">{recipe.description}</p>
                    <div className="flex gap-2 text-xs">
                      <span className="px-2 py-1 bg-white/10 rounded">
                        {Math.round(calculateRecipeMacros(recipe).calories)} kcal
                      </span>
                      <span className="px-2 py-1 bg-white/10 rounded">
                        {Math.round(calculateRecipeMacros(recipe).proteinG)}g protein
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex gap-4 pt-4">
                <Button onClick={handleSwapMeal} disabled={!selectedRecipeId || updating}>
                  {updating ? "Swapping..." : "Swap Meal"}
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Customize Ingredients Tab */}
          {activeTab === "customize" && (
            <div className="space-y-4">
              <p className="text-white/70 mb-4">
                Adjust ingredient quantities. Macros will update automatically.
              </p>

              {/* Current Recipe Info */}
              {currentRecipe && (
                <div className="mb-6 p-4 bg-white/5 rounded-lg">
                  <h3 className="font-semibold mb-2">{currentRecipe.name}</h3>
                  <p className="text-sm text-white/70">{currentRecipe.description}</p>
                </div>
              )}

              {/* Ingredients List */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {meal.ingredients &&
                  Array.isArray(meal.ingredients) &&
                  meal.ingredients.map((ing: any, index: number) => {
                    const ingredient = INGREDIENTS[ing.id]
                    if (!ingredient) return null

                    const grams = ingredientPortions[ing.id] || ing.grams || 0
                    const multiplier = grams / 100

                    return (
                      <div
                        key={ing.id || index}
                        className="p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Label className="font-medium">{ingredient.name}</Label>
                          <div className="text-sm text-white/70">
                            {Math.round(grams * 10) / 10}g
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Input
                            type="number"
                            value={grams}
                            onChange={(e) =>
                              handleIngredientChange(ing.id, parseFloat(e.target.value) || 0)
                            }
                            min="0"
                            step="1"
                            className="flex-1"
                          />
                          <div className="text-xs text-white/70 min-w-[120px]">
                            <div>
                              {Math.round(ingredient.caloriesPer100g * multiplier)} kcal
                            </div>
                            <div>
                              P: {Math.round(ingredient.proteinPer100g * multiplier * 10) / 10}g
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Calculated Macros */}
              <div className="mt-6 p-4 bg-[#18c260]/10 rounded-lg border border-[#18c260]/20">
                <h4 className="font-semibold mb-3">Updated Macros</h4>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-white/70 mb-1">Calories</p>
                    <p className="text-lg font-bold">
                      {Math.round(calculatedMacros.calories)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Protein</p>
                    <p className="text-lg font-bold">
                      {Math.round(calculatedMacros.proteinG * 10) / 10}g
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Carbs</p>
                    <p className="text-lg font-bold">
                      {Math.round(calculatedMacros.carbG * 10) / 10}g
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Fats</p>
                    <p className="text-lg font-bold">
                      {Math.round(calculatedMacros.fatG * 10) / 10}g
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={handleCustomizeIngredients} disabled={updating}>
                  {updating ? "Updating..." : "Save Changes"}
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

