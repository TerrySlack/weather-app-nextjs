import { FileData } from "@mainframework/dropzone/dist/esm/shared/types/types";
import Image from "next/image";
import { MouseEvent, KeyboardEvent } from "react";

interface Resolution {
  width: number;
  height: number;
  label: string;
}

export const imgResolutions: Resolution[] = [
  { width: 360, height: 640, label: "small" },
  { width: 768, height: 1366, label: "md" },
  { width: 1280, height: 720, label: "lg" },
  { width: 1920, height: 1080, label: "xl" },
  { width: 3840, height: 2160, label: "xxl" },
];

interface IResponsiveImage {
  alt?: string;
  layout?: string;
  file: FileData;

  //onIdChange, onCancel, onRemove
  onIdChange?: (e: MouseEvent<HTMLImageElement>) => void;
  onKeyUp?: (e: KeyboardEvent<HTMLElement>) => void;
  onRemove: (e: MouseEvent<HTMLButtonElement>) => void;
}
const defaultAlt = "Image";
const defaultLayout = "intrinsic"; // Maintain aspect ratio

export const ResponsiveImage = ({
  alt = defaultAlt,
  layout = defaultLayout,
  file: { id, url },
  onIdChange,
  onKeyUp,
  onRemove,
}: IResponsiveImage) => {
  //TODO:  Using the nextjs image component, do I need to Add the check for svgs to ensure they are formatted.
  return (
    <div>
      {imgResolutions.map((resolution, index) => (
        <span>
          <Image
            key={resolution.label}
            id={id}
            className="object-cover" //Do I need this?
            src={url} // Convert File to URL for src.  Do this in the dropzone
            alt={`${alt}-${resolution.label}`}
            width={resolution.width}
            height={resolution.height}
            layout={layout}
            onClick={onIdChange}
            onKeyUp={onKeyUp}
          />
          <button onClick={onRemove }>Remove</button>
        </span>
      ))}
    </div>
  );
};
