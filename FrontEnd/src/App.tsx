import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Room, Services, Home, Guests,Booking ,Login,Staff,Payments} from './pages'
import { DefaultLayout } from "./components";
import {Toaster} from 'react-hot-toast'
function App() {


  return (
    <BrowserRouter>
        <Toaster position="top-right"></Toaster>
        <Routes>
            <Route path={'/'} element={<Login/>}/>
        </Routes>
      <Routes>
        <Route path="/home" element={<DefaultLayout><Home /></DefaultLayout>} />
      </Routes>
      <Routes>
        <Route path="/rooms" element={<DefaultLayout><Room /></DefaultLayout>} />
      </Routes>
      <Routes>
        <Route path="/bookings" element={<DefaultLayout><Booking /></DefaultLayout>} />
      </Routes>
      <Routes>
        <Route path="/services" element={<DefaultLayout><Services /></DefaultLayout>} />
      </Routes>
      <Routes>
        <Route path="/guests" element={<DefaultLayout><Guests /></DefaultLayout>} />
      </Routes>
      <Routes>
        <Route path="/staff" element={<DefaultLayout><Staff/></DefaultLayout>} />
      </Routes>
      <Routes>
        <Route path="/payments" element={<DefaultLayout><Payments/></DefaultLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
