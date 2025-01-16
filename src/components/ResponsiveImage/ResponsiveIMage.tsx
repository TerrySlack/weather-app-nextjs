import Image from "next/image";

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

export const ResponsiveImage = ({ file }: { file: File }) => {
  //TODO:  Using the nextjs image component, do I need to Add the check for svgs to ensure they are formatted.
  return (
    <div>
      {imgResolutions.map((resolution) => (
        <Image
          key={resolution.label}
          src={URL.createObjectURL(file)} // Convert File to URL for src
          alt={`Image ${resolution.label}`}
          width={resolution.width}
          height={resolution.height}
          layout="intrinsic" // Maintain aspect ratio
        />
      ))}
    </div>
  );
};
