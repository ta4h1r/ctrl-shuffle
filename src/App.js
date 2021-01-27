import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';

import IndexPage from './pages/Index.js';
import FleetPage from './pages/FleetManager.js';
import ProductsPage from './pages/Products.js';
import ContactPage from './pages/Contact.js';
import LoginPage from './pages/Login.js';
import SignupPage from './pages/Signup.js';

export default function App() {
  return (
    <Router>
        <Switch>
          <Route exact path="/landing">
            <IndexPage />
          </Route>
          <Route path="/landing/fleet">
            <FleetPage />
          </Route>
          <Route path="/landing/products">
            <ProductsPage />
          </Route>
          <Route path="/landing/contact">
            <ContactPage />
          </Route>
          <Route path="/landing/login">
            <LoginPage />
          </Route>
          <Route path="/landing/signup">
            <SignupPage />
          </Route>
        </Switch>
    </Router>
  );
}
