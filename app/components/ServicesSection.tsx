const SERVICES = [
  {
    title: "Performance-Led Campaigns",
    description:
      "Simplifying complex digital products through lifestyle storytelling that converts.",
  },
  {
    title: "Influencer Marketing",
    description: "Let's spread the word like it's butter.",
  },
  {
    title: "Music Videos & Cultural IPs",
    description:
      "Cinematic music assets and large-scale live spectacles like Rakshak & Hebron School Brainology.",
  },
  {
    title: "Brand Strategy & Design",
    description:
      "Positioning, identity, and creative systems built for brands that want to be unmissable.",
  },
];

export default function ServicesSection() {
  return (
    <section
      style={{
        background: "#0A0A0A",
        padding: "6rem 6%",
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
        What We Do
      </p>
      <h2
        style={{
          fontFamily: "var(--font-playfair)",
          fontWeight: 400,
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          color: "#FFFFFF",
          maxWidth: "18ch",
          marginBottom: "4rem",
        }}
      >
        Content engineered to move through the feed.
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1px",
          background: "rgba(255,255,255,0.12)",
        }}
      >
        {SERVICES.map((service, i) => (
          <div
            key={service.title}
            style={{
              background: "#0A0A0A",
              padding: "2.5rem 2rem",
              transition: "background 0.3s ease",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.8rem",
                color: "#FFD700",
                display: "block",
                marginBottom: "1.25rem",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3
              style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 400,
                fontSize: "1.5rem",
                color: "#FFFFFF",
                marginBottom: "1rem",
              }}
            >
              {service.title}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                fontSize: "0.95rem",
                color: "#E0E0E0",
                lineHeight: 1.6,
              }}
            >
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
