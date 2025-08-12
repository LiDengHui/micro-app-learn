import { Outlet } from "react-router-dom";
import "./App.css";
import "./global-styles.css";

function App() {
  return (
    <div className="react-sub-app">
      <Outlet />
    </div>
  );
}

export default App;
