/**
 * Test script to verify signup endpoint works
 */

const testSignup = async () => {
  const testData = {
    name: "Test User",
    email: `test-${Date.now()}@test.com`,
    password: "test123456",
  }

  console.log("Testing signup endpoint with data:", testData)

  try {
    const response = await fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    const contentType = response.headers.get("content-type")
    let data

    if (contentType && contentType.includes("application/json")) {
      data = await response.json()
    } else {
      const text = await response.text()
      console.error("Non-JSON response:", text)
      process.exit(1)
    }

    console.log("Response data:", data)

    if (response.ok) {
      console.log("✅ Signup test PASSED!")
    } else {
      console.error("❌ Signup test FAILED:", data)
      process.exit(1)
    }
  } catch (error: any) {
    console.error("❌ Signup test ERROR:", error.message)
    console.error("Error stack:", error.stack)
    process.exit(1)
  }
}

// Wait for server to be ready
setTimeout(() => {
  testSignup()
}, 2000)

