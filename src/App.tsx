import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import BikeList from "./pages/bikes/BikeList";
import { ROUTES } from "./constants/routes";
import "./App.css";

const HomePlaceholder = () => (
  <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
    <h1
      style={{
        fontSize: "2.5rem",
        marginBottom: "1rem",
        color: "#1F2937",
      }}
    >
      🚲 Welcome to SecondBicycle
    </h1>
    <p
      style={{
        fontSize: "1.2rem",
        color: "#6B7280",
        marginBottom: "2rem",
      }}
    >
      Your trusted marketplace for quality used bicycles.
    </p>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "2rem",
        marginTop: "3rem",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ color: "#C41E3A", marginBottom: "1rem" }}>
          🏠 Trang chủ
        </h3>
        <p style={{ color: "#6B7280" }}>
          Browse our collection of quality used bicycles
        </p>
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ color: "#C41E3A", marginBottom: "1rem" }}>
          🛒 Giỏ hàng (3)
        </h3>
        <p style={{ color: "#6B7280" }}>
          View your selected items
        </p>
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ color: "#C41E3A", marginBottom: "1rem" }}>
          ❤️ Wishlist (5)
        </h3>
        <p style={{ color: "#6B7280" }}>
          Your favorite bikes saved for later
        </p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            width: "100vw",
          }}
        >
          <Header />

          {/* Main content */}
          <main
            style={{
              flex: 1,
              padding: "3rem 1.5rem",
              backgroundColor: "#f9fafb",
            }}
          >
            <Routes>
              {/* Auth Routes */}
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />

              {/* Bike Routes */}
              <Route path={ROUTES.BIKES} element={<BikeList />} />
              <Route path={ROUTES.STORE} element={<BikeList />} />

              {/* Home Route */}
              <Route path={ROUTES.HOME} element={<HomePlaceholder />} />
            </Routes>
          </main>

          <Footer />
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
