import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PrivateRoute from './components/shared/PrivateRoute';
import NotificationContainer from './components/shared/NotificationContainer';
import AppLayout from './components/layout/AppLayout';
import LoadingSpinner from './components/shared/LoadingSpinner';

const LoginPage = React.lazy(() => import('./components/auth/LoginPage'));
const ProductsPage = React.lazy(() => import('./components/products/ProductsPage'));
const ProductDetailPage = React.lazy(() => import('./components/products/ProductDetailPage'));

function App() {
  return (
    <>
      <NotificationContainer />
      <Router future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <Suspense fallback={<LoadingSpinner label="Loading..." />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route element={<PrivateRoute />}>
                <Route path="/products" element={<AppLayout />}>
                    <Route index element={<ProductsPage />} />
                    <Route path=":id" element={<ProductDetailPage />} />
                </Route>
            </Route>
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
