export async function sendResetEmail(email: string, code: string) {
  // Stubbed email sender. In production, replace with a real provider.
  console.log(`[password-reset] Send code to ${email}: ${code}`)
}

