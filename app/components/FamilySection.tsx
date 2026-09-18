const FAMILY = [
  "Ministry of Culture",
  "Gujarat Police",
  "Praveg",
  "Pepperfry",
  "Swiggy",
  "AnyTime Fitness",
  "Roastery Coffee Co.",
  "Radio City 91.1 FM",
  "Tea Post",
  "The Ummed Hotels",
  "Laxmi Namkeen",
  "Nook",
  "Aquaplus",
];

export default function FamilySection() {
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
        Our Family
      </p>
      <h2
        style={{
          fontFamily: "var(--font-playfair)",
          fontWeight: 400,
          fontSize: "clamp(2rem, 4vw, 3.5rem)",
          color: "#FFFFFF",
          maxWidth: "16ch",
          marginBottom: "3.5rem",
        }}
      >
        Brands who trust us to be seen.
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.75rem 1.25rem",
        }}
      >
        {FAMILY.map((name) => (
          <span
            key={name}
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 400,
              fontSize: "0.95rem",
              color: "#E0E0E0",
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
