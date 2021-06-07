import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Login from "./pages/Login";
import ManageMentor from "./pages/ManageMentor";

function App() {
  return(
    <Router>
      <Switch>
        <Route path='/login' exact>
          <Login/>
        </Route>
        <Route path='/'>
          <ManageMentor/>
        </Route>
      </Switch>
    </Router>
  )
}

export default App;
