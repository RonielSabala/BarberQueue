// AuthLayout.jsx — fondo con blobs, elementos flotantes de barbería,
// y el card centrado en pantalla (igual que la página 404)
import "../styles/auth/login.css";

function AuthLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6fb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        overflow: "hidden",
        padding: "24px",
      }}
    >
      {/* Blobs de fondo */}
      <div
        style={{
          position: "absolute",
          top: -160,
          left: -160,
          width: 560,
          height: 560,
          borderRadius: 999,
          background:
            "radial-gradient(circle, rgba(59,130,246,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -120,
          right: -120,
          width: 480,
          height: 480,
          borderRadius: 999,
          background:
            "radial-gradient(circle, rgba(240,124,12,0.09) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Elementos flotantes */}
      {[
        { emoji: "✂️", top: "12%", left: "8%", size: 40, delay: "0s" },
        { emoji: "💈", top: "20%", right: "10%", size: 34, delay: "1.2s" },
        { emoji: "🪒", bottom: "25%", left: "12%", size: 36, delay: "2.4s" },
        { emoji: "✂️", bottom: "18%", right: "8%", size: 38, delay: "0.8s" },
        { emoji: "💈", top: "55%", left: "5%", size: 32, delay: "3.2s" },
        { emoji: "🪒", top: "40%", right: "5%", size: 36, delay: "1.8s" },
      ].map((d, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            fontSize: d.size,
            opacity: 0.45,
            top: d.top,
            left: d.left,
            right: d.right,
            bottom: d.bottom,
            animation: `auth-float 6s ease-in-out ${d.delay} infinite`,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {d.emoji}
        </span>
      ))}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes auth-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%       { transform: translateY(-14px) rotate(5deg); }
          66%       { transform: translateY(8px) rotate(-4deg); }
        }
      `}</style>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 420,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
