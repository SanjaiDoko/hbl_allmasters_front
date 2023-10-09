import "./App.css";
import Hbl from "./views/Hbl";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes } from "react-router";
import { Navigate } from "react-router";
import  PreviewHbl  from "./views/PreviewHbl";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/stores/store";
import { PersistGate } from "redux-persist/integration/react";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function App() {
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="header" style={{background: "blue", height: "50px"}}>HBL DOCUMENT</div>
        <Routes>
          <Route path="/" element={<Hbl />} />
          <Route path="/preview" element={<PreviewHbl />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </PersistGate>
      </LocalizationProvider>
    </Provider>
  );
}

export default App;
