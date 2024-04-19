// App.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import 'firebase/auth';
import 'firebase/firestore';
import { AuthProvider } from './AuthContext';
import SignUp from './SignUp';
import Login from './login';
import MyQRCode from './myqrCode'; // Corrected filename
import CartView from './cartView';
import PaymentHistory from './paymentHistory';
import CartDetailView from './cartDetailView';
import TermsPage from './TermsPage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCG5pVt5fXPgHUeqpsxbpTt702cg6leJKU",
  authDomain: "ei-website-103a4.firebaseapp.com",
  databaseURL: "https://ei-website-103a4-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "ei-website-103a4",
  storageBucket: "ei-website-103a4.appspot.com",
  messagingSenderId: "609909198676",
  appId: "1:609909198676:web:88fe2d7d886e6eb17202c1",
  measurementId: "G-HZQ5QYRXQX"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

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

