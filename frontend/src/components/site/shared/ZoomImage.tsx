import InnerImageZoom, { InnerImageZoomProps } from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";

export default function ZoomImage({ src, ...props }: InnerImageZoomProps) {
  return <InnerImageZoom src={src} {...props} />;
}
