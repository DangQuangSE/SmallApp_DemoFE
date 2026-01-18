import { BrowserRouter } from "react-router-dom";
import Header from "./components/layout/header";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
        <Header />

        {/* Main content */}
        <main style={{ padding: "3rem 1.5rem" }}>
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
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
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
                <p style={{ color: "#6B7280" }}>View your selected items</p>
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
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
