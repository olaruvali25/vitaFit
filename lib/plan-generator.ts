import {
  RECIPES,
  calculateRecipeMacros,
  filterRecipesByRestrictions,
  filterRecipesByPreferences,
  type Recipe,
} from "./recipes"
import { supabaseAdmin } from "./supabase"

// Meal distribution percentages
const MEAL_DISTRIBUTION = {
  breakfast: 0.25,
  lunch: 0.30,
  dinner: 0.30,
  snack: 0.15,
}

// Default water target
const DEFAULT_WATER_GLASSES = 8

interface PlanGenerationParams {
  profileId: string
  days: number
  caloriesTarget: number
  proteinTargetG: number
  fatTargetG: number
  carbTargetG: number
  workoutsPerWeek: number
  dietaryRestrictions: string[]
  foodPreferences: string[]
}

interface DayMealPlan {
  dayNumber: number
  date: Date
  meals: Array<{
    mealType: string
    mealOrder: number
    recipeId: string
    recipeName: string
    imageUrl: string
    description: string
    calories: number
    proteinG: number
    fatG: number
    carbG: number
    ingredients: any[]
  }>
}

// Generate workout days for the week
function generateWorkoutDays(workoutsPerWeek: number, startDate: Date): Set<number> {
  const workoutDays = new Set<number>()
  const startDay = startDate.getDay()

  // Distribute workouts evenly across the week
  const interval = Math.floor(7 / workoutsPerWeek)
  let currentDay = startDay

  for (let i = 0; i < workoutsPerWeek; i++) {
    workoutDays.add(currentDay)
    currentDay = (currentDay + interval) % 7
  }

  return workoutDays
}

// Select recipes for a meal type that match targets
function selectRecipeForMeal(
  mealType: "breakfast" | "lunch" | "dinner" | "snack",
  targetCalories: number,
  targetProtein: number,
  availableRecipes: Recipe[],
  tolerance: number = 0.5
): Recipe | null {
  const mealRecipes = availableRecipes.filter((r) => r.mealType === mealType)

  if (mealRecipes.length === 0) {
    console.warn(`[Plan Generator] No recipes found for meal type: ${mealType}`)
    return null
  }

  // Try to find a recipe that matches the target macros with tolerance
  for (const recipe of mealRecipes) {
    const macros = calculateRecipeMacros(recipe)
    const caloriesDiff = Math.abs(macros.calories - targetCalories) / (targetCalories || 1)
    const proteinDiff = Math.abs(macros.proteinG - targetProtein) / (targetProtein || 1)

    if (caloriesDiff <= tolerance && proteinDiff <= tolerance) {
      return recipe
    }
  }

  // If no match within tolerance, find the closest one
  let bestRecipe: Recipe | null = null
  let bestScore = Infinity

  for (const recipe of mealRecipes) {
    const macros = calculateRecipeMacros(recipe)
    const caloriesDiff = Math.abs(macros.calories - targetCalories) / (targetCalories || 1)
    const proteinDiff = Math.abs(macros.proteinG - targetProtein) / (targetProtein || 1)
    const score = caloriesDiff + proteinDiff

    if (score < bestScore) {
      bestScore = score
      bestRecipe = recipe
    }
  }

  if (!bestRecipe && mealRecipes.length > 0) {
    return mealRecipes[0]
  }

  return bestRecipe
}

// Adjust recipe portions to match targets more closely
function adjustRecipePortions(
  recipe: Recipe,
  targetCalories: number,
  targetProtein: number
): { recipe: Recipe; portions: Record<string, number> } {
  const baseMacros = calculateRecipeMacros(recipe)
  const caloriesRatio = targetCalories / (baseMacros.calories || 1)
  const proteinRatio = targetProtein / (baseMacros.proteinG || 1)

  const scaleFactor = (caloriesRatio + proteinRatio) / 2

  const portions: Record<string, number> = {}
  for (const ingredient of recipe.ingredients) {
    portions[ingredient.ingredientId] = Math.round(ingredient.grams * scaleFactor * 10) / 10
  }

  return { recipe, portions }
}

// Generate a single day's meal plan
function generateDayMeals(
  dayNumber: number,
  date: Date,
  params: PlanGenerationParams,
  availableRecipes: Recipe[]
): DayMealPlan {
  const meals: DayMealPlan["meals"] = []

  const breakfastTargets = {
    calories: params.caloriesTarget * MEAL_DISTRIBUTION.breakfast,
    protein: params.proteinTargetG * MEAL_DISTRIBUTION.breakfast,
  }
  const lunchTargets = {
    calories: params.caloriesTarget * MEAL_DISTRIBUTION.lunch,
    protein: params.proteinTargetG * MEAL_DISTRIBUTION.lunch,
  }
  const dinnerTargets = {
    calories: params.caloriesTarget * MEAL_DISTRIBUTION.dinner,
    protein: params.proteinTargetG * MEAL_DISTRIBUTION.dinner,
  }
  const snackTargets = {
    calories: params.caloriesTarget * MEAL_DISTRIBUTION.snack,
    protein: params.proteinTargetG * MEAL_DISTRIBUTION.snack,
  }

  // Generate breakfast
  let breakfastRecipe = selectRecipeForMeal("breakfast", breakfastTargets.calories, breakfastTargets.protein, availableRecipes)
  if (!breakfastRecipe) {
    const fallbackRecipes = availableRecipes.filter((r) => r.mealType === "breakfast")
    breakfastRecipe = fallbackRecipes[0] || null
  }
  
  if (breakfastRecipe) {
    const adjusted = adjustRecipePortions(breakfastRecipe, breakfastTargets.calories, breakfastTargets.protein)
    const macros = calculateRecipeMacros(adjusted.recipe, adjusted.portions)
    meals.push({
      mealType: "breakfast",
      mealOrder: 1,
      recipeId: adjusted.recipe.id,
      recipeName: adjusted.recipe.name,
      imageUrl: adjusted.recipe.imageUrl || "",
      description: adjusted.recipe.description || "",
      calories: macros.calories,
      proteinG: macros.proteinG,
      fatG: macros.fatG,
      carbG: macros.carbG,
      ingredients: macros.ingredients,
    })
  }

  // Generate snack (morning)
  let snackRecipe1 = selectRecipeForMeal("snack", snackTargets.calories / 2, snackTargets.protein / 2, availableRecipes)
  if (!snackRecipe1) {
    const fallbackSnacks = availableRecipes.filter((r) => r.mealType === "snack")
    snackRecipe1 = fallbackSnacks[0] || null
  }
  
  if (snackRecipe1) {
    const adjusted = adjustRecipePortions(snackRecipe1, snackTargets.calories / 2, snackTargets.protein / 2)
    const macros = calculateRecipeMacros(adjusted.recipe, adjusted.portions)
    meals.push({
      mealType: "snack",
      mealOrder: 2,
      recipeId: adjusted.recipe.id,
      recipeName: adjusted.recipe.name,
      imageUrl: adjusted.recipe.imageUrl || "",
      description: adjusted.recipe.description || "",
      calories: macros.calories,
      proteinG: macros.proteinG,
      fatG: macros.fatG,
      carbG: macros.carbG,
      ingredients: macros.ingredients,
    })
  }

  // Generate lunch
  let lunchRecipe = selectRecipeForMeal("lunch", lunchTargets.calories, lunchTargets.protein, availableRecipes)
  if (!lunchRecipe) {
    const fallbackLunches = availableRecipes.filter((r) => r.mealType === "lunch")
    lunchRecipe = fallbackLunches[0] || null
  }
  
  if (lunchRecipe) {
    const adjusted = adjustRecipePortions(lunchRecipe, lunchTargets.calories, lunchTargets.protein)
    const macros = calculateRecipeMacros(adjusted.recipe, adjusted.portions)
    meals.push({
      mealType: "lunch",
      mealOrder: 3,
      recipeId: adjusted.recipe.id,
      recipeName: adjusted.recipe.name,
      imageUrl: adjusted.recipe.imageUrl || "",
      description: adjusted.recipe.description || "",
      calories: macros.calories,
      proteinG: macros.proteinG,
      fatG: macros.fatG,
      carbG: macros.carbG,
      ingredients: macros.ingredients,
    })
  }

  // Generate snack (afternoon)
  let snackRecipe2 = selectRecipeForMeal("snack", snackTargets.calories / 2, snackTargets.protein / 2, availableRecipes)
  if (!snackRecipe2) {
    const fallbackSnacks = availableRecipes.filter((r) => r.mealType === "snack")
    snackRecipe2 = fallbackSnacks[fallbackSnacks.length > 1 ? 1 : 0] || null
  }
  
  if (snackRecipe2) {
    const adjusted = adjustRecipePortions(snackRecipe2, snackTargets.calories / 2, snackTargets.protein / 2)
    const macros = calculateRecipeMacros(adjusted.recipe, adjusted.portions)
    meals.push({
      mealType: "snack",
      mealOrder: 4,
      recipeId: adjusted.recipe.id,
      recipeName: adjusted.recipe.name,
      imageUrl: adjusted.recipe.imageUrl || "",
      description: adjusted.recipe.description || "",
      calories: macros.calories,
      proteinG: macros.proteinG,
      fatG: macros.fatG,
      carbG: macros.carbG,
      ingredients: macros.ingredients,
    })
  }

  // Generate dinner
  let dinnerRecipe = selectRecipeForMeal("dinner", dinnerTargets.calories, dinnerTargets.protein, availableRecipes)
  if (!dinnerRecipe) {
    const fallbackDinners = availableRecipes.filter((r) => r.mealType === "dinner")
    dinnerRecipe = fallbackDinners[0] || null
  }
  
  if (dinnerRecipe) {
    const adjusted = adjustRecipePortions(dinnerRecipe, dinnerTargets.calories, dinnerTargets.protein)
    const macros = calculateRecipeMacros(adjusted.recipe, adjusted.portions)
    meals.push({
      mealType: "dinner",
      mealOrder: 5,
      recipeId: adjusted.recipe.id,
      recipeName: adjusted.recipe.name,
      imageUrl: adjusted.recipe.imageUrl || "",
      description: adjusted.recipe.description || "",
      calories: macros.calories,
      proteinG: macros.proteinG,
      fatG: macros.fatG,
      carbG: macros.carbG,
      ingredients: macros.ingredients,
    })
  }

  console.log(`[Plan Generator] Day ${dayNumber}: Successfully generated ${meals.length} meals`)
  return {
    dayNumber,
    date,
    meals,
  }
}

// Main plan generation function - now returns plan data without saving to database
// The caller should handle storage (e.g., via Supabase or other means)
export async function generatePlan(params: PlanGenerationParams) {
  console.log(`[Plan Generator] Starting plan generation for profileId: ${params.profileId}`)
  console.log(`[Plan Generator] Total recipes available: ${RECIPES.length}`)
  
  // Filter recipes based on restrictions and preferences
  let availableRecipes = RECIPES
  availableRecipes = filterRecipesByRestrictions(availableRecipes, params.dietaryRestrictions)
  availableRecipes = filterRecipesByPreferences(availableRecipes, params.foodPreferences)

  if (availableRecipes.length === 0) {
    console.warn(`[Plan Generator] No recipes after filtering, using all recipes as fallback`)
    availableRecipes = RECIPES
  }

  // Calculate start date (today)
  const startDate = new Date()
  startDate.setHours(0, 0, 0, 0)

  // Generate workout days
  const workoutDays = generateWorkoutDays(params.workoutsPerWeek, startDate)

  // Generate plan days
  const planDays: DayMealPlan[] = []
  
  for (let day = 0; day < params.days; day++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + day)
    
    const dayPlan = generateDayMeals(day + 1, date, params, availableRecipes)
    planDays.push(dayPlan)
  }

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + params.days - 1)

  // Return plan data (caller handles storage)
  const planData = {
    profileId: params.profileId,
    title: `${params.days}-Day Personalized Meal Plan`,
    startDate: startDate,
    endDate: endDate,
    source: "make-webhook",
    caloriesTarget: params.caloriesTarget,
    proteinTargetG: params.proteinTargetG,
    fatTargetG: params.fatTargetG,
    carbTargetG: params.carbTargetG,
    workoutsPerWeek: params.workoutsPerWeek,
    days: planDays.map((dayPlan) => ({
      dayNumber: dayPlan.dayNumber,
      date: dayPlan.date,
      waterTargetGlasses: DEFAULT_WATER_GLASSES,
      meals: dayPlan.meals,
    })),
  }

  console.log(`[Plan Generator] Plan generated successfully with ${planDays.length} days`)
  return planData
}
