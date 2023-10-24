import "./App.css";
import Index from "./components/index";

const checkValid = "user";

function App() {
  if (checkValid === "user") {
    return (
      <>
        <Index />
      </>
    );
  } else {
    return <></>;
  }
}

export default App;
