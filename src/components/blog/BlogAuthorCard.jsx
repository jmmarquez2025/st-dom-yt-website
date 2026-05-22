import { useTranslation } from "react-i18next";
import { T } from "../../constants/theme";
import { friars, staff, initials } from "../../data/staff";
import DominicanDivider from "../DominicanDivider";

const allPeople = [...friars, ...staff];

const AUTHOR_BIOS = {
  "frassati-davis": {
    en: "Fr. Frassati Davis, O.P. is the Pastor of St. Dominic Catholic Church. A Dominican friar of the Province of St. Joseph, he is dedicated to preaching the Gospel and serving the Youngstown community.",
    es: "El P. Frassati Davis, O.P. es el Parroco de la Iglesia Catolica Santo Domingo. Fraile dominicano de la Provincia de San Jose, esta dedicado a predicar el Evangelio y servir a la comunidad de Youngstown.",
  },
  "charles-rooney": {
    en: "Fr. Charles Marie Rooney, O.P. is the Associate Pastor of St. Dominic Catholic Church. He brings a passion for Dominican spirituality, theological study, and the intellectual life of the faith to his preaching and parish ministry.",
    es: "El P. Charles Marie Rooney, O.P. es el Vicario Parroquial de la Iglesia Catolica Santo Domingo. Aporta una pasion por la espiritualidad dominicana, el estudio teologico y la vida intelectual de la fe a su predicacion y ministerio parroquial.",
  },
};

export default function BlogAuthorCard({ authorId }) {
  const { i18n } = useTranslation();
  const isEs = i18n.language === "es";
  const author = allPeople.find((p) => p.id === authorId);
  if (!author) return null;

  const bio = AUTHOR_BIOS[authorId]?.[isEs ? "es" : "en"] || "";

  return (
    <div style={{ marginTop: 48, marginBottom: 32 }}>
      <DominicanDivider style={{ marginBottom: 32 }} />
      <div
        className="glass-card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          padding: 28,
          borderTop: `3px solid ${T.gold}`,
        }}
      >
        {author.photo ? (
          <img
            src={author.photo}
            alt={author.name}
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: T.burgundy,
              color: T.goldLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 700,
              fontFamily: "'Cormorant Garamond', serif",
              flexShrink: 0,
            }}
          >
            {initials(author.name)}
          </div>
        )}
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: T.goldText,
              fontWeight: 600,
              marginBottom: 4,
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            {isEs ? "Escrito por" : "Written by"}
          </div>
          <div
            style={{
              fontSize: 20,
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              color: T.softBlack,
              marginBottom: 6,
            }}
          >
            {author.name}
          </div>
          {bio && (
            <p
              style={{
                fontSize: 14,
                lineHeight: 1.7,
                color: T.warmGray,
                margin: 0,
              }}
            >
              {bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
