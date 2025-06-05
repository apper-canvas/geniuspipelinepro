import { createContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { setUser, clearUser } from './store/userSlice'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Callback from './pages/Callback'
import ErrorPage from './pages/ErrorPage'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

// Create auth context
export const AuthContext = createContext(null)

function AppContent() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [isInitialized, setIsInitialized] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user)
  const isAuthenticated = userState?.isAuthenticated || false

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

// Initialize ApperUI once when the app loads
  useEffect(() => {
    if (!window.ApperSDK) {
      console.error('ApperSDK not found on window object')
      setIsInitialized(true)
      return
    }

    const { ApperClient, ApperUI } = window.ApperSDK

    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    })

    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
setIsInitialized(true)
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        let currentPath = window.location.pathname + window.location.search
        let redirectPath = null
        try {
          redirectPath = new window.URLSearchParams(window.location.search).get('redirect')
        } catch (error) {
          console.warn('URLSearchParams not available:', error)
        }
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes('/callback') || currentPath.includes('/error')
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath)
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath)
            } else {
              navigate('/')
            }
          } else {
            navigate('/')
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))))
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            )
          } else if (redirectPath) {
            if (
              ![
                'error',
                'signup',
                'login',
                'callback'
              ].some((path) => currentPath.includes(path))
            )
              navigate(`/login?redirect=${redirectPath}`)
            else {
              navigate(currentPath)
            }
          } else if (isAuthPage) {
            navigate(currentPath)
          } else {
            navigate('/login')
          }
          dispatch(clearUser())
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error)
        setIsInitialized(true)
      }
    })
  }, [navigate, dispatch])

  // Authentication methods to share via context
  const authMethods = {
isInitialized,
    logout: async () => {
      try {
        if (!window.ApperSDK) {
          console.error('ApperSDK not available for logout')
          dispatch(clearUser())
          navigate('/login')
          return
        }
        const { ApperUI } = window.ApperSDK
        await ApperUI.logout()
        dispatch(clearUser())
        navigate('/login')
      } catch (error) {
        console.error("Logout failed:", error)
        dispatch(clearUser())
        navigate('/login')
      }
    }
  }

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/" element={<Home darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme={darkMode ? 'dark' : 'light'}
            className="mt-16"
          />
        </div>
      </div>
    </AuthContext.Provider>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App