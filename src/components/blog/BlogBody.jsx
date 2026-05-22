import { T } from "../../constants/theme";
import { generateHeadingId } from "../../utils/blogUtils";

/**
 * Renders an array of content blocks as JSX.
 * Supports: paragraph, heading, quote, image, callout, list.
 */
export default function BlogBody({ blocks, isFirstPost = true }) {
  if (!blocks || !blocks.length) return null;

  return (
    <div>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={i}
                className={i === 0 && isFirstPost ? "blog-drop-cap" : undefined}
                style={{
                  fontSize: 17,
                  lineHeight: 1.85,
                  color: T.warmGray,
                  marginBottom: 24,
                  fontFamily: "'Source Sans 3', sans-serif",
                }}
              >
                {block.text}
              </p>
            );

          case "heading":
            const Tag = `h${block.level || 2}`;
            const id = generateHeadingId(block.text);
            return (
              <Tag
                key={i}
                id={id}
                style={{
                  fontSize: block.level === 3 ? 22 : 26,
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 600,
                  color: T.softBlack,
                  marginTop: 40,
                  marginBottom: 16,
                  lineHeight: 1.3,
                }}
              >
                {block.text}
              </Tag>
            );

          case "quote":
            return (
              <blockquote
                key={i}
                style={{
                  fontSize: "clamp(17px, 2.5vw, 20px)",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  lineHeight: 1.6,
                  color: T.warmGray,
                  borderLeft: `4px solid ${T.gold}`,
                  paddingLeft: 24,
                  margin: "32px 0",
                  maxWidth: 600,
                }}
              >
                {block.text}
                {block.attribution && (
                  <cite
                    style={{
                      display: "block",
                      fontSize: 12,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: T.goldText,
                      fontStyle: "normal",
                      marginTop: 12,
                      fontFamily: "'Source Sans 3', sans-serif",
                    }}
                  >
                    {block.attribution}
                  </cite>
                )}
              </blockquote>
            );

          case "image":
            return (
              <figure
                key={i}
                className="scroll-reveal-img"
                style={{ margin: "32px 0" }}
              >
                <img
                  src={block.src}
                  alt={block.alt || ""}
                  loading="lazy"
                  style={{
                    width: "100%",
                    borderRadius: 6,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                />
                {block.caption && (
                  <figcaption
                    style={{
                      fontSize: 13,
                      color: T.warmGray,
                      fontStyle: "italic",
                      textAlign: "center",
                      marginTop: 10,
                    }}
                  >
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case "callout":
            return (
              <div
                key={i}
                style={{
                  background: T.cream,
                  borderLeft: `4px solid ${T.burgundy}`,
                  borderRadius: "0 6px 6px 0",
                  padding: "20px 24px",
                  margin: "28px 0",
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: T.charcoal,
                  fontFamily: "'Source Sans 3', sans-serif",
                }}
              >
                {block.text}
              </div>
            );

          case "list":
            const ListTag = block.ordered ? "ol" : "ul";
            return (
              <ListTag
                key={i}
                style={{
                  paddingLeft: 24,
                  marginBottom: 24,
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: T.warmGray,
                }}
              >
                {block.items?.map((item, j) => (
                  <li key={j} style={{ marginBottom: 6 }}>{item}</li>
                ))}
              </ListTag>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
