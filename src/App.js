import React from "react";
import { BrowserRouter } from "react-router-dom";
// import Connect from "./component/pages/Connect";
// import TalismanChosen from "./component/pages/TalismanChosen";
// import Transfer from "./component/pages/Transfer";
import RoutePage from "./component/pages/RoutePages";
import { RecoilRoot } from "recoil";

function App() {
  return (
    <div>
      <BrowserRouter>
        {/**<Connect />
        <TalismanChosen /> */}
        <RecoilRoot>
          <RoutePage />
        </RecoilRoot>
      </BrowserRouter>
    </div>
  );
}

export default App;
