import Header from "./components/Header";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BasePriceTable from "./components/BasePriceTable";
import SlotPriceTable from "./components/SlotPriceTable";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="basePrice" element={<BasePriceTable />} />
        <Route path="slotPrice" element={<SlotPriceTable />} />
        <Route path="/" element={<Header />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
