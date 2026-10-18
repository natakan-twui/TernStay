import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter basename="/TernStay"> {/* <--- เติมตรงนี้ครับ */}
      <Routes>
        {/* โค้ดหน้าเว็บและ Route ต่างๆ ของคุณ */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;