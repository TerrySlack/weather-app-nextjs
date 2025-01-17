import { FileData } from "@mainframework/dropzone/dist/esm/shared/types/types";
import { memo, MouseEvent } from "react";

import { isEqual } from "@/utils/equal";
import { ResponsiveImage } from "../ResponsiveImage";

//TODO:  We need the methods for t
interface IIMages {
  images: FileData[];

  onIdChange: (
    index: number,
    id: string
  ) => (e: MouseEvent<HTMLImageElement>) => void;
  onCancel: () => void;
  onRemove: (index: number) => (e: MouseEvent<HTMLButtonElement>) => void;
}

export const Images = memo(
  ({ images, onIdChange, onCancel, onRemove }: IIMages) => {
    return (
      <div className="p-4 md:p-6 lg:p-8 flex flex-wrap md:flex-row sm:flex-col gap-4 md:gap-6 border border-gray-300 rounded-lg">
        {images.map((file: FileData, index) => (
          <ResponsiveImage
            file={file}
            onIdChange={onIdChange(index, file.id)}
            onRemove={onRemove(index)}
          />
        ))}
      </div>
    );
  },
  isEqual
);
