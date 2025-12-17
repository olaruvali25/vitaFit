import {
  RECIPES,
  INGREDIENTS,
  calculateRecipeMacros,
  filterRecipesByRestrictions,
  filterRecipesByPreferences,
  type Recipe,
} from "./recipes"
import { prisma } from "./prisma"

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
  const daysOfWeek = [1, 2, 3, 4, 5, 6, 0] // Mon-Sun
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
  tolerance: number = 0.5 // Increased tolerance to 50% to ensure we always find a recipe
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

  // If no match within tolerance, find the closest one (always return something)
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

  // Always return a recipe if available (even if not perfect match)
  if (!bestRecipe && mealRecipes.length > 0) {
    console.warn(`[Plan Generator] Using first available recipe for ${mealType} as fallback`)
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

  // Use the average ratio to scale portions
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

  // Calculate target macros for each meal type
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

  // Generate breakfast - ALWAYS create a meal, even if recipe doesn't match perfectly
  let breakfastRecipe = selectRecipeForMeal("breakfast", breakfastTargets.calories, breakfastTargets.protein, availableRecipes)
  if (!breakfastRecipe) {
    // Fallback: use any breakfast recipe if none found
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
  } else {
    console.error(`[Plan Generator] CRITICAL: No breakfast recipe available!`)
  }

  // Generate snack (morning) - optional, skip if no recipe found
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

  // Generate lunch - ALWAYS create
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
  } else {
    console.error(`[Plan Generator] CRITICAL: No lunch recipe available!`)
  }

  // Generate snack (afternoon) - optional
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

  // Generate dinner - ALWAYS create
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
  } else {
    console.error(`[Plan Generator] CRITICAL: No dinner recipe available!`)
  }
  
  // Ensure we have at least breakfast, lunch, and dinner
  if (meals.length < 3) {
    console.error(`[Plan Generator] CRITICAL: Only ${meals.length} meals generated! Minimum 3 required.`)
    console.error(`[Plan Generator] Available recipes:`, availableRecipes.map(r => `${r.mealType}: ${r.name}`))
    
    // EMERGENCY FALLBACK: Create minimal meals if we don't have enough
    const allBreakfast = availableRecipes.filter(r => r.mealType === "breakfast")
    const allLunch = availableRecipes.filter(r => r.mealType === "lunch")
    const allDinner = availableRecipes.filter(r => r.mealType === "dinner")
    
    // Force create at least breakfast, lunch, dinner
    if (meals.length === 0) {
      if (allBreakfast.length > 0) {
        const recipe = allBreakfast[0]
        const macros = calculateRecipeMacros(recipe)
        meals.push({
          mealType: "breakfast",
          mealOrder: 1,
          recipeId: recipe.id,
          recipeName: recipe.name,
          imageUrl: recipe.imageUrl || "",
          description: recipe.description || "",
          calories: macros.calories,
          proteinG: macros.proteinG,
          fatG: macros.fatG,
          carbG: macros.carbG,
          ingredients: macros.ingredients,
        })
      }
      if (allLunch.length > 0) {
        const recipe = allLunch[0]
        const macros = calculateRecipeMacros(recipe)
        meals.push({
          mealType: "lunch",
          mealOrder: 2,
          recipeId: recipe.id,
          recipeName: recipe.name,
          imageUrl: recipe.imageUrl || "",
          description: recipe.description || "",
          calories: macros.calories,
          proteinG: macros.proteinG,
          fatG: macros.fatG,
          carbG: macros.carbG,
          ingredients: macros.ingredients,
        })
      }
      if (allDinner.length > 0) {
        const recipe = allDinner[0]
        const macros = calculateRecipeMacros(recipe)
        meals.push({
          mealType: "dinner",
          mealOrder: 3,
          recipeId: recipe.id,
          recipeName: recipe.name,
          imageUrl: recipe.imageUrl || "",
          description: recipe.description || "",
          calories: macros.calories,
          proteinG: macros.proteinG,
          fatG: macros.fatG,
          carbG: macros.carbG,
          ingredients: macros.ingredients,
        })
      }
    }
    
    // If still less than 3, throw error
    if (meals.length < 3) {
      throw new Error(`Failed to generate minimum required meals. Only ${meals.length} meals created. Available recipes: ${availableRecipes.length}`)
    }
  }

  console.log(`[Plan Generator] Day ${dayNumber}: Successfully generated ${meals.length} meals`)
  return {
    dayNumber,
    date,
    meals,
  }
}

// Main plan generation function
export async function generatePlan(params: PlanGenerationParams) {
  console.log(`[Plan Generator] Starting plan generation for profileId: ${params.profileId}`)
  console.log(`[Plan Generator] Total recipes available: ${RECIPES.length}`)
  
  // Filter recipes based on restrictions and preferences
  let availableRecipes = RECIPES
  const beforeRestrictions = availableRecipes.length
  availableRecipes = filterRecipesByRestrictions(availableRecipes, params.dietaryRestrictions)
  console.log(`[Plan Generator] After restrictions filter: ${availableRecipes.length} recipes (from ${beforeRestrictions})`)
  
  const beforePreferences = availableRecipes.length
  availableRecipes = filterRecipesByPreferences(availableRecipes, params.foodPreferences)
  console.log(`[Plan Generator] After preferences filter: ${availableRecipes.length} recipes (from ${beforePreferences})`)

  // If no recipes after filtering, use all recipes (safety fallback)
  if (availableRecipes.length === 0) {
    console.warn(`[Plan Generator] No recipes after filtering, using all recipes as fallback`)
    availableRecipes = RECIPES
  }
  
  // Verify we have recipes for each meal type
  const breakfastCount = availableRecipes.filter(r => r.mealType === "breakfast").length
  const lunchCount = availableRecipes.filter(r => r.mealType === "lunch").length
  const dinnerCount = availableRecipes.filter(r => r.mealType === "dinner").length
  const snackCount = availableRecipes.filter(r => r.mealType === "snack").length
  
  console.log(`[Plan Generator] Recipe counts - Breakfast: ${breakfastCount}, Lunch: ${lunchCount}, Dinner: ${dinnerCount}, Snack: ${snackCount}`)
  
  if (breakfastCount === 0 || lunchCount === 0 || dinnerCount === 0) {
    throw new Error(`Insufficient recipes: Breakfast: ${breakfastCount}, Lunch: ${lunchCount}, Dinner: ${dinnerCount}`)
  }

  // Calculate start date (today)
  const startDate = new Date()
  startDate.setHours(0, 0, 0, 0)

  // Generate workout days
  const workoutDays = generateWorkoutDays(params.workoutsPerWeek, startDate)

  // Generate plan days
  const planDays: DayMealPlan[] = []
  console.log(`[Plan Generator] Generating ${params.days} days of meals...`)
  
  for (let day = 0; day < params.days; day++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + day)
    
    try {
      const dayPlan = generateDayMeals(day + 1, date, params, availableRecipes)
      
      // Validate day plan has meals
      if (!dayPlan.meals || dayPlan.meals.length === 0) {
        throw new Error(`Day ${day + 1} has no meals generated`)
      }
      
      console.log(`[Plan Generator] Day ${day + 1}: Generated ${dayPlan.meals.length} meals`)
      planDays.push(dayPlan)
    } catch (error: any) {
      console.error(`[Plan Generator] Error generating day ${day + 1}:`, error)
      throw new Error(`Failed to generate meals for day ${day + 1}: ${error.message}`)
    }
  }
  
  console.log(`[Plan Generator] Successfully generated ${planDays.length} days with ${planDays.reduce((sum, day) => sum + day.meals.length, 0)} total meals`)

  // Create plan in database
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + params.days - 1)

  console.log(`[Plan Generator] Creating plan in database for profileId: ${params.profileId}`)
  console.log(`[Plan Generator] Plan will have ${planDays.length} days`)
  console.log(`[Plan Generator] Total meals to create: ${planDays.reduce((sum, day) => sum + day.meals.length, 0)}`)

  try {
    const plan = await prisma.plan.create({
      data: {
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
        days: {
          create: planDays.map((dayPlan) => ({
            dayNumber: dayPlan.dayNumber,
            date: dayPlan.date,
            waterTargetGlasses: DEFAULT_WATER_GLASSES,
            meals: {
              create: dayPlan.meals.map((meal) => ({
                mealType: meal.mealType,
                mealOrder: meal.mealOrder,
                recipeId: meal.recipeId,
                recipeName: meal.recipeName,
                imageUrl: meal.imageUrl,
                description: meal.description,
                calories: meal.calories,
                proteinG: meal.proteinG,
                fatG: meal.fatG,
                carbG: meal.carbG,
                ingredients: meal.ingredients,
              })),
            },
            progress: {
              create: {
                waterGlassesDrunk: 0,
                workoutCompleted: false,
              },
            },
          })),
        },
      },
      include: {
        days: {
          include: {
            meals: {
              orderBy: { mealOrder: "asc" },
            },
            progress: true,
          },
          orderBy: { dayNumber: "asc" },
        },
      },
    })

    console.log(`[Plan Generator] Plan created successfully! ID: ${plan.id}`)
    console.log(`[Plan Generator] Plan has ${plan.days.length} days`)
    const totalMeals = plan.days.reduce((sum: number, day: any) => sum + (day.meals?.length || 0), 0)
    console.log(`[Plan Generator] Plan has ${totalMeals} meals total`)

    if (!plan.id) {
      throw new Error("Plan was created but has no ID")
    }

    if (!plan.days || plan.days.length === 0) {
      throw new Error("Plan was created but has no days")
    }

    if (totalMeals === 0) {
      throw new Error("Plan was created but has no meals")
    }

    return plan
  } catch (error: any) {
    console.error(`[Plan Generator] Error creating plan:`, error)
    console.error(`[Plan Generator] Error details:`, {
      message: error.message,
      code: error.code,
      meta: error.meta,
    })
    throw new Error(`Failed to create plan in database: ${error.message}`)
  }
}

