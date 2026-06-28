import { useTranslation } from "react-i18next";
import { T } from "../constants/theme";
import { CONFIG } from "../constants/config";
import { Section } from "../components/Section";
import PageHeader from "../components/PageHeader";
import Seo from "../components/Seo";
import ComingSoon from "../mass-intentions/ComingSoon";
import MassIntentionForm from "../mass-intentions/MassIntentionForm";

/**
 * Public "Request a Mass Intention" page. Thin shell: page chrome + the
 * feature-flag gate. The form (and its success state) live in
 * <MassIntentionForm>; the dark-launch placeholder lives in <ComingSoon>.
 */
export default function MassIntentions() {
  const { t } = useTranslation();
  const enabled = CONFIG.massIntentionsEnabled;

  return (
    <div style={{ paddingTop: 76 }}>
      <Seo title={t("massIntentions.pageTitle")} description={t("massIntentions.pageDescription")} />
      <PageHeader
        title={t("massIntentions.pageTitle")}
        variant="text"
        aside={enabled ? t("massIntentions.pageDescription") : undefined}
      />

      <Section bg={T.cream}>
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          {enabled ? <MassIntentionForm /> : <ComingSoon />}
        </div>
      </Section>

      <style>{`
        @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 520px) { .mi-two-col { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
