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
          <Route exact path="/">
            <IndexPage />
          </Route>
          <Route exact path="/fleet">
            <FleetPage />
          </Route>
          <Route exact path="/products">
            <ProductsPage />
          </Route>
          <Route exact path="/contact">
            <ContactPage />
          </Route>
          <Route exact path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/signup">
            <SignupPage />
          </Route>
        </Switch>
    </Router>
  );
}
