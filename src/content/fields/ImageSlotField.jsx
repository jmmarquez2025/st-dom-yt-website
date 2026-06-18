import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { T } from "../../constants/theme";
import { currentImage, originalImage, setImage, resetImage } from "../images";
import { notifyI18nChange } from "../applyOverrides";
import ImagePicker from "../ImagePicker";
import { LABEL, SANS } from "./styles";

/**
 * One editable image slot: shows the current image, opens the picker to change
 * it, and reverts to the shipped default. Saves immediately (image swaps are
 * infrequent and don't need the page's text Save button).
 */
export default function ImageSlotField({ slot, label, onToast }) {
  const [value, setValue] = useState(() => currentImage(slot));
  const [picking, setPicking] = useState(false);
  const overridden = value !== originalImage(slot);

  const choose = (path) => {
    setImage(slot, path);
    setValue(currentImage(slot));
    setPicking(false);
    notifyI18nChange(); // nudge mounted pages to re-read PHOTOS
    onToast?.({ message: `${label} updated`, type: "success" });
  };

  const reset = () => {
    resetImage(slot);
    setValue(currentImage(slot));
    notifyI18nChange();
    onToast?.({ message: `${label} reset to default`, type: "success" });
  };

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label style={{ ...LABEL, marginBottom: 8 }}>{label}</label>
        {overridden && (
          <button
            type="button"
            onClick={reset}
            style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "none", border: "none", color: T.warmGray, fontSize: 12, fontFamily: SANS, cursor: "pointer" }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 160,
            aspectRatio: "16 / 10",
            borderRadius: "var(--radius-card)",
            border: `1px solid ${T.stone}`,
            overflow: "hidden",
            background: T.stoneLight,
            flexShrink: 0,
          }}
        >
          {value && (
            <img src={value} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          )}
        </div>
        <button
          type="button"
          onClick={() => setPicking(true)}
          style={{ padding: "9px 16px", background: "#fff", border: `1px solid ${T.stone}`, borderRadius: "var(--radius-card)", color: T.charcoal, fontFamily: SANS, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
        >
          Change image
        </button>
      </div>
      {picking && <ImagePicker onPick={choose} onClose={() => setPicking(false)} />}
    </div>
  );
}
