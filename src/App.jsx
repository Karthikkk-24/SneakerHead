import "./App.css";
import Index from "./components/index";

const checkValid = true;

function App() {
  if (checkValid) {
    return <>
        <Index />
    </>;
  } else {
    return <></>;
  }
}

export default App;
