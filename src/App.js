import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import SignUp from './SignUp';
import Login from './login';
import MyQRCode from './myqrCode'; // Corrected filename
import CartView from './cartView';
import PaymentHistory from './paymentHistory';
import CartDetailView from './cartDetailView';
import TermsPage from './TermsPage';
import PhoneSignIn from './PhoneSignIn'; // Import the PhoneSignIn component

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/signup" element={<SignUp />} /> 
          <Route path="/login" element={<Login />} /> 
          <Route path="/myqrcode" element={<MyQRCode />} /> 
          <Route path="/cartView" element={<CartView />} /> 
          <Route path="/paymentHistory" element={<PaymentHistory />} /> 
          <Route path="/cartDetailView" element={<CartDetailView />} /> 
          <Route path="/cart-detail/:cartItemId" element={<CartDetailView />} />
          <Route exact path="/terms" element={<TermsPage />} />
          <Route exact path="/phone-signin" element={<PhoneSignIn />} /> {/* Add PhoneSignIn route */}
        </Routes>
      </div>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

export default App;
