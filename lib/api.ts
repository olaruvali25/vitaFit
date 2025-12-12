export async function generateMealPlan(user: any, targets: any) {
  const res = await fetch("/api/generate-meal-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, targets }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || "Meal plan generation failed.")
  }

  return res.json()
}

