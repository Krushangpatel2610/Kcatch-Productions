export default function ClosingCTA() {
  return (
    <section
      style={{
        position: "relative",
        background: "#0A0A0A",
        padding: "8rem 6%",
        borderTop: "1px solid rgba(255,255,255,0.12)",
        textAlign: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(255,215,0,0.08) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative" }}>
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.65rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#FFD700",
            marginBottom: "1.5rem",
          }}
        >
          Kcatch Ahmedabad & Pune
        </p>
        <h2
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 400,
            fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
            color: "#FFFFFF",
            marginBottom: "2.5rem",
          }}
        >
          Let&apos;s make you seen.
        </h2>

        <div
          style={{
            fontFamily: "var(--font-inter)",
            fontWeight: 300,
            color: "#E0E0E0",
            fontSize: "0.95rem",
            lineHeight: 2,
            marginBottom: "3rem",
          }}
        >
          <p>Ahmedabad: Adit Suvarna (+91 81604 73945) | Jay Panchal (+91 87349 31730)</p>
          <p>Pune: Shagun Shukla (+91 99981 19667)</p>
        </div>

        <button
          style={{
            background: "#FFD700",
            color: "#000000",
            fontFamily: "var(--font-inter)",
            fontWeight: 500,
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            padding: "1rem 3rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          Get in Touch
        </button>
      </div>
    </section>
  );
}
