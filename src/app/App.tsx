import { Route, Routes } from "react-router";
import { MainLayout } from "../shared";
import { HomePage, SettingsPage } from "../pages";

function App() {

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/settings" element={<SettingsPage/>} />
      </Route>
    </Routes>
  );
}

export default App;
