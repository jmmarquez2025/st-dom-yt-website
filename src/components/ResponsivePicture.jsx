export default function ResponsivePicture({
  src,
  widths,
  sizes,
  alt,
  loading = "lazy",
  decoding = "async",
  fetchPriority,
  style,
  className = "",
  onLoad,
  onError,
}) {
  if (!src) return null;

  const hasWidths = Array.isArray(widths) && widths.length > 0;

  if (!hasWidths) {
    return (
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        style={style}
        className={className}
        onLoad={onLoad}
        onError={onError}
      />
    );
  }

  const lastDot = src.lastIndexOf(".");
  const lastSlash = src.lastIndexOf("/");
  const dir = lastSlash >= 0 ? src.slice(0, lastSlash + 1) : "";
  const basename =
    lastDot > lastSlash ? src.slice(lastSlash + 1, lastDot) : src.slice(lastSlash + 1);

  const webpSrcset = widths
    .map((w) => `${dir}${basename}-${w}.webp ${w}w`)
    .join(", ");
  const jpgSrcset = widths
    .map((w) => `${dir}${basename}-${w}.jpg ${w}w`)
    .join(", ");

  return (
    <picture>
      <source type="image/webp" srcSet={webpSrcset} sizes={sizes} />
      <source type="image/jpeg" srcSet={jpgSrcset} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        style={style}
        className={className}
        onLoad={onLoad}
        onError={onError}
      />
    </picture>
  );
}
