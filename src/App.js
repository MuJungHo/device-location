import React from 'react'
import Editor from "./Editor"
import { GlobalProvider } from "./contexts/GlobalContext"
import "./style/normalize.css"

const App = () => (
  <GlobalProvider>
    <Editor />
  </GlobalProvider>
)

export default App
