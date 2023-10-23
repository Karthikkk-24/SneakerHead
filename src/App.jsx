import Admin from "./Admin/index";
import "./App.css";
import Index from "./components/index";

const checkValid = 'admin';

function App() {
  if (checkValid === 'user') {
    return <>
        <Index />
    </>;
  } else if (checkValid === 'admin') {
    return <>
        <Admin />
    </>;
  } else {
    return <></>;
  }
}

export default App;
