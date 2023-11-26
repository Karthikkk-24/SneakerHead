import { Link, Route, BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import About from "./components/About";
import Category from "./components/Categories";
import Contact from "./components/Contact";
import Index from "./components/Index";
import Login from "./components/Login";
import Register from "./components/Register";
import Specials from "./components/Specials";
import Upcoming from "./components/Upcoming";

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
          <Route exact path="/about" component={About} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/category" component={Category} />
          <Route exact path="/specials" component={Specials} />
          <Route exact path="/upcoming" component={Upcoming} />
        </Switch>
      </Router>
      </>
    );
  } else {
    return <></>;
  }
}

export default App;
