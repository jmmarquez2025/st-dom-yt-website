import { useTranslation } from "react-i18next";
import PremiumPageActions from "./PremiumPageActions";

export default function SacramentPageActions({ sacramentKey, icon }) {
  const { t } = useTranslation();

  return (
    <PremiumPageActions
      overlap
      eyebrow={t("sacraments.sub")}
      title={t(`sacraments.${sacramentKey}.title`)}
      items={[
        {
          title: t(`sacraments.${sacramentKey}.cta`),
          description: t(`sacraments.${sacramentKey}.ctaDesc`),
          to: "/contact",
          icon,
          primary: true,
        },
        {
          title: t("nav.massTimes"),
          description: t("massTimes.reviewed"),
          to: "/mass-times",
          icon: "Church",
        },
        {
          title: t("nav.register"),
          description: t("register.desc"),
          to: "/register",
          icon: "ClipboardList",
        },
      ]}
    />
  );
}
