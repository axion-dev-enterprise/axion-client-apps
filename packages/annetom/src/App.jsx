// src/App.jsx
import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ui/ToastProvider";
import { HelmetProvider } from 'react-helmet-async';
import ErrorBoundary from "./components/ui/ErrorBoundary";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { reportWebVitals } from "./utils/performance";
import logger from "./utils/logger";

// Lazy loading das páginas para melhor performance
const HomeAnneTom = lazy(() => import("./pages/HomeAnneTom"));
const CardapioPage = lazy(() => import("./pages/CardapioPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const OrderConfirmationPage = lazy(() => import("./pages/OrderConfirmationPage.jsx"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const DeliveryPage = lazy(() => import("./pages/DeliveryPage"));
const PromotionsPage = lazy(() => import("./pages/PromotionsPage"));
const EventsPage = lazy(() => import("./pages/EventsPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const AllergensPage = lazy(() => import("./pages/AllergensPage"));
const LoyaltyPage = lazy(() => import("./pages/LoyaltyPage"));
const CareersPage = lazy(() => import("./pages/CareersPage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const CustomerDashboardPage = lazy(() => import("./pages/CustomerDashboardPage"));
const KitchenDashboardPage = lazy(() => import("./pages/KitchenDashboardPage"));
const AdminDashboardPage = lazy(() => import("./pages/AdminDashboardPage"));
const MotoboyDeliveryPage = lazy(() => import("./pages/MotoboyDeliveryPage"));
const ClubeVipLandingPage = lazy(() => import("./pages/ClubeVipLandingPage"));

const AppContent = () => {
  const location = useLocation();
  const hostname = window.location.hostname.toLowerCase();

  useEffect(() => {
    reportWebVitals((metric) => {
      logger.info(`Web Vitals - ${metric.name}`, {
        value: metric.value,
        id: metric.id,
        delta: metric.delta
      });
    });

    logger.info(`Page navigation: ${location.pathname} (${hostname})`, {
      path: location.pathname,
      search: location.search,
      hash: location.hash
    });
  }, [location, hostname]);

  // Hostname-based Subdomain Routing
  let overrideComponent = null;
  let requiredRole = null;

  if (hostname.startsWith("cozinha.") || hostname.startsWith("kds.")) {
    overrideComponent = <KitchenDashboardPage />;
    requiredRole = "kitchen";
  } else if (hostname.startsWith("admin.") || hostname.startsWith("painel.")) {
    overrideComponent = <AdminDashboardPage />;
    requiredRole = "admin";
  } else if (hostname.startsWith("motoboy.") || hostname.startsWith("delivery.")) {
    overrideComponent = <MotoboyDeliveryPage />;
    requiredRole = "motoboy";
  } else if (hostname.startsWith("vip.") || hostname.startsWith("clube.")) {
    overrideComponent = <ClubeVipLandingPage />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <div key={location.pathname} className="page-fade">
          <Suspense fallback={<LoadingSpinner />}>
            {overrideComponent ? (
              <Routes>
                <Route
                  path="*"
                  element={
                    requiredRole ? (
                      <ProtectedRoute requiredRole={requiredRole}>
                        {overrideComponent}
                      </ProtectedRoute>
                    ) : (
                      overrideComponent
                    )
                  }
                />
              </Routes>
            ) : (
              <Routes>
                <Route path="/" element={<HomeAnneTom />} />
                <Route path="/cardapio" element={<CardapioPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/confirmacao" element={<OrderConfirmationPage />} />
                
                {/* Rotas Protegidas de Clientes */}
                <Route path="/minha-conta" element={<ProtectedRoute requiredRole="customer"><CustomerDashboardPage /></ProtectedRoute>} />
                <Route path="/me" element={<CustomerDashboardPage />} />
                <Route path="/auth" element={<CustomerDashboardPage />} />
                
                {/* Rotas Protegidas da Cozinha (KDS) */}
                <Route path="/cozinha/*" element={<ProtectedRoute requiredRole="kitchen"><KitchenDashboardPage /></ProtectedRoute>} />
                <Route path="/kds/*" element={<ProtectedRoute requiredRole="kitchen"><KitchenDashboardPage /></ProtectedRoute>} />
                
                {/* Rotas Protegidas Administrativas */}
                <Route path="/admin/*" element={<ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute>} />
                <Route path="/painel/*" element={<ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute>} />
                
                {/* Rotas Protegidas de Entregadores */}
                <Route path="/motoboy/*" element={<ProtectedRoute requiredRole="motoboy"><MotoboyDeliveryPage /></ProtectedRoute>} />
                <Route path="/delivery/*" element={<ProtectedRoute requiredRole="motoboy"><MotoboyDeliveryPage /></ProtectedRoute>} />
                
                {/* Clube VIP Landing Page */}
                <Route path="/vip/*" element={<ClubeVipLandingPage />} />
                <Route path="/clube/*" element={<ClubeVipLandingPage />} />

                {/* Rotas Institucionais */}
                <Route path="/sobre" element={<AboutPage />} />
                <Route path="/contato" element={<ContactPage />} />
                <Route path="/entrega" element={<DeliveryPage />} />
                <Route path="/promocoes" element={<PromotionsPage />} />
                <Route path="/eventos" element={<EventsPage />} />
                <Route path="/faq" element={<FaqPage />} />
                <Route path="/alergenos" element={<AllergensPage />} />
                <Route path="/fidelidade" element={<LoyaltyPage />} />
                <Route path="/trabalhe-conosco" element={<CareersPage />} />
                <Route path="/galeria" element={<GalleryPage />} />
                <Route path="*" element={<HomeAnneTom />} />
              </Routes>
            )}
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
};

const App = () => (
  <HelmetProvider>
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  </HelmetProvider>
);

export default App;
