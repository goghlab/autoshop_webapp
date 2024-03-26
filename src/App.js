import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './SignUp';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import 'firebase/auth'; // Include Firebase authentication module
import 'firebase/firestore'; // Include Firestore module
import MyQRCode from './myqrCode';
import CartView from './cartView'

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


// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);

function App() {
  return (
    <Router>
      <div>
        <Routes>
          {/* Define routes */}
          <Route path="/signup" element={<SignUp />} /> 
          <Route path="/myqrcode" element={<MyQRCode />} /> 
          <Route path="/CartView" element={<CartView />} /> 
        </Routes>
      </div>
    </Router>
  );
}

// Use createRoot().render() instead of createRoot() directly
createRoot(document.getElementById('root')).render(<App />);

export default App;
