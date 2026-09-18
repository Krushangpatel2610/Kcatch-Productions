const CAMPAIGNS = [
  {
    title: "ZEE5 & RummyCircle",
    tag: "Performance Ads",
  },
  {
    title: "Rakshak: Ek Shaam Gujarat Police Ke Naam",
    tag: "Karnavati Club",
  },
  {
    title: "The Entertainers Tour",
    tag: "New Jersey / Global Arenas",
  },
  {
    title: "League of Hebronian",
    tag: "School Education IP",
  },
];

export default function CampaignsSection() {
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
        Featured Work
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
        Moments that make people look twice.
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {CAMPAIGNS.map((c) => (
          <div
            key={c.title}
            style={{
              background: "#111111",
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "2.5rem 2rem",
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.7rem",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#FFD700",
                marginBottom: "0.75rem",
              }}
            >
              {c.tag}
            </span>
            <h3
              style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 400,
                fontSize: "1.4rem",
                color: "#FFFFFF",
                lineHeight: 1.3,
              }}
            >
              {c.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
