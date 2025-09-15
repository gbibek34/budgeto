import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [dbStatus, setDbStatus] = useState('Connecting...')
  const [accounts, setAccounts] = useState([])

  useEffect(() => {
    // Test database connection
    axios.get('http://localhost:5000/api/test')
      .then(response => {
        setDbStatus('✅ Database Connected!')
        console.log(response)
      })
      .catch(error => {
        setDbStatus('❌ Database Connection Failed')
        console.error(error)
      })

    // Fetch accounts
    axios.get('http://localhost:5000/api/accounts')
      .then(response => {
        setAccounts(response.data)
      })
      .catch(error => {
        console.error('Error fetching accounts:', error)
      })
  }, [])

  return (
    <div className="App">
      <h1>Budget App</h1>
      <p>Status: {dbStatus}</p>

      <h2>Accounts</h2>
      {accounts.length > 0 ? (
        <ul>
          {accounts.map(account => (
            <li key={account.id}>
              {account.name} - ${account.current_balance}
            </li>
          ))}
        </ul>
      ) : (
        <p>No accounts found. Let's add some!</p>
      )}
    </div>
  )
}

export default App