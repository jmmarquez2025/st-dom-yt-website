import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CONFIG } from "../constants/config";
import { T } from "../constants/theme";
import { useSchedule } from "../cms/hooks";
import { getTodayScheduleSummary } from "../utils/schedule";
import Icon from "./Icon";

export default function ParishActionBar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: schedule } = useSchedule();
  const { masses, confessions } = getTodayScheduleSummary(schedule);

  const actions = [
    {
      icon: "Church",
      label: t("actionBar.mass"),
      value: masses || t("actionBar.schedule"),
      onClick: () => navigate("/mass-times"),
    },
    {
      icon: "Cross",
      label: t("actionBar.confession"),
      value: confessions || t("actionBar.schedule"),
      onClick: () => navigate("/mass-times"),
    },
    {
      icon: "Phone",
      label: t("actionBar.call"),
      value: CONFIG.phone,
      href: CONFIG.phoneLink,
    },
  ];

  return (
    <aside className="parish-action-bar" aria-label={t("actionBar.label")}>
      {actions.map((action) => {
        const content = (
          <>
            <Icon name={action.icon} size={18} color={T.goldLight} />
            <span>
              <span className="parish-action-bar__label">{action.label}</span>
              <span className="parish-action-bar__value">{action.value}</span>
            </span>
          </>
        );

        if (action.href) {
          return (
            <a key={action.label} href={action.href} className="parish-action-bar__item">
              {content}
            </a>
          );
        }

        return (
          <button key={action.label} type="button" onClick={action.onClick} className="parish-action-bar__item">
            {content}
          </button>
        );
      })}
    </aside>
  );
}
