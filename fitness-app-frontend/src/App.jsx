import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAuth } from 'react-oidc-context'
import { Navigate, Route, Routes, BrowserRouter as Router } from 'react-router'
import { setCredentials, logout as clearCredentials } from './store/authSlice'
import ActivityForm from './components/ActivityForm'
import ActivityList from './components/ActivityList'
import ActivitiesDetail from './components/ActivitiesDetail'
import HomePage from './components/HomePage'
import Layout from './components/Layout'

// No extra padding wrapper — Layout's content div handles scroll,
// each page component sets its own max-width and padding.
const LogActivityPage = () => (
  <div style={{ width:'100%', maxWidth:'100%', padding:'32px 40px 80px', fontFamily:'"DM Sans",sans-serif', boxSizing:'border-box' }}>
    <ActivityForm onActivitiesAdded={() => window.location.reload()} />
  </div>
)

const ActivitiesPage = () => (
  <div style={{ width:'100%', maxWidth:'100%', padding:'32px 40px 80px', fontFamily:'"DM Sans",sans-serif', boxSizing:'border-box' }}>
    <ActivityList />
  </div>
)

export default function App() {
  const { user, isAuthenticated, signinRedirect, signoutRedirect } = useAuth()
  const dispatch = useDispatch()

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(setCredentials({ token: user.access_token, user: user.profile }))
    }
  }, [isAuthenticated, user, dispatch])

  const handleLogout = () => {
    dispatch(clearCredentials())
    signoutRedirect()
  }

  return (
    <Router>
      {!user?.access_token ? (
        <Routes>
          <Route path="*" element={<HomePage />} />
        </Routes>
      ) : (
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/log-activity"  element={<LogActivityPage />} />
            <Route path="/activities"    element={<ActivitiesPage />} />
            <Route path="/activities/:id" element={<ActivitiesDetail />} />
            <Route path="/"              element={<Navigate to="/activities" replace />} />
          </Routes>
        </Layout>
      )}
    </Router>
  )
}
