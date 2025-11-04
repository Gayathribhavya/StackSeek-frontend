import { auth } from './firebaseConfig'

/**
 * Test Firebase connection and configuration
 */
export async function testFirebaseConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    // Test if Firebase is properly initialized
    console.log('Testing Firebase connection...')
    console.log('Auth instance:', auth)
    console.log('Firebase config:', {
      projectId: auth.app.options.projectId,
      authDomain: auth.app.options.authDomain,
      apiKey: auth.app.options.apiKey ? 'SET' : 'MISSING'
    })
    
    // Test network connectivity to Firebase
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/projects/${auth.app.options.projectId}/accounts:lookup?key=${auth.app.options.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: 'test' })
    })
    
    console.log('Firebase API response status:', response.status)
    
    if (response.status === 400) {
      // Expected for invalid token, but shows API is reachable
      return { success: true }
    } else if (response.status === 403) {
      return { success: false, error: 'Invalid API key or project configuration' }
    } else {
      return { success: true }
    }
  } catch (error: any) {
    console.error('Firebase connection test failed:', error)
    return { success: false, error: error.message }
  }
}
