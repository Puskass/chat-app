import React from 'react'
import io from "socket.io-client"

const socket = io.connect("http://localhost:5000")
 
const App = () => {
  return (
    <div>App</div>
  )
}

export default App