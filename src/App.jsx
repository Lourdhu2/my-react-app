import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import TicTacToe from './TicTacToe'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  const handleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential)
    setUser(decoded)
  }

  if (!user) {
    return (
      <section id="center" style={{ textAlign: 'center', paddingTop: '100px' }}>
        <h1>Welcome</h1>
        <p>Sign in to continue</p>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log('Login Failed')}
          />
        </div>
      </section>
    )
  }

  return (
    <>
      <div style={{ position: 'absolute', top: '20px', right: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <img src={user.picture} alt="" style={{ width: 32, height: 32, borderRadius: '50%' }} />
        <span>{user.name}</span>
        <button onClick={() => setUser(null)} style={{ cursor: 'pointer' }}>Sign out</button>
      </div>
      <section id="center">
        <TicTacToe />
      </section>
    </>
  )
}

export default App
