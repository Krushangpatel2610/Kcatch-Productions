const PARTNERS = [
  "ZEE5",
  "Razorpay",
  "RummyCircle",
  "Qatar Airways",
  "My11Circle",
  "PokerBaazi",
  "Azorte",
  "Delhi Bulls",
  "Motul",
  "Flipkart Health+",
  "Capsul India",
  "The Entertainers",
];

export default function AboutSection() {
  return (
    <section
      style={{
        background: "#0A0A0A",
        padding: "8rem 6% 6rem",
        borderTop: "1px solid rgba(255,255,255,0.12)",
      }}
    >
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
        #1 About Us
      </p>
      <h2
        style={{
          fontFamily: "var(--font-playfair)",
          fontWeight: 400,
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          color: "#FFFFFF",
          maxWidth: "16ch",
          marginBottom: "2.5rem",
        }}
      >
        A precision-driven attention studio.
      </h2>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontWeight: 300,
          fontSize: "1.15rem",
          color: "#E0E0E0",
          maxWidth: 720,
          lineHeight: 1.8,
          marginBottom: "3.5rem",
        }}
      >
        Kcatch Media combines brand strategy, visual design, content production, and
        performance thinking into one seamless system. We don&apos;t just make things look
        good — we build content engineered to move through the feed, hold attention, and
        convert it into results for brands operating at scale.
      </p>

      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "0.65rem",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: "#888888",
          marginBottom: "1.25rem",
        }}
      >
        Trusted By
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem 1.25rem",
        }}
      >
        {PARTNERS.map((name) => (
          <span
            key={name}
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 400,
              fontSize: "0.95rem",
              color: "#FFFFFF",
              padding: "0.5rem 1rem",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  );
}
