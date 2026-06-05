const authConfig = {
  authority: 'http://localhost:8181/realms/fitness-app',
  client_id: 'fitness-oauth2-realm',
  redirect_uri: 'http://localhost:5173',
  post_logout_redirect_uri: 'http://localhost:5173',
  scope: 'openid profile email',
  onSigninCallback: (_user) => {
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    )
  }
}

export default authConfig