import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../App'

function Signup() {
  const { isInitialized } = useContext(AuthContext)

  useEffect(() => {
    if (isInitialized) {
      // Show signup UI in this component
      const { ApperUI } = window.ApperSDK
      ApperUI.showSignup("#authentication")
    }
  }, [isInitialized])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Create Account</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Sign up for your account</p>
        </div>
        <div id="authentication" className="min-h-[400px]" />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup