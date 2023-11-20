import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import Index from "./components/index";
import Login from "./components/login";
import Register from "./components/register";

const checkValid = "user";

function App() {
  if (checkValid === "user") {
    return (
      <>
      <Router>
        <Switch>
          <Route exact path="/" component={Index} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </Router>
      </>
    );
  } else {
    return <></>;
  }
}

export default App;
