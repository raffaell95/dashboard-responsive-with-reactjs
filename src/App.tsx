import { ThemeProvider } from "styled-components"
import GlobalStyles from "./styles/GlobalStyles"
import { RouterProvider } from 'react-router-dom'
import router from "./routes/app.routes"

import {useTheme} from './hooks/theme'

const App: React.FC = () =>{
  const { theme } = useTheme()
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles/>
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App