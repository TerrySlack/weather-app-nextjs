import { Images } from "@/components/Images";
import { MouseEvent } from "react";
import { useFileSelector } from "@mainframework/dropzone";
import { FileData } from "@mainframework/dropzone/dist/esm/shared/types/types";

import { defaultTypeExtensions } from "./uploadTypes";

//Let's set a max size of 5 mbs
const maximumFileSize = 1e6;

const ImagesContainer = () => {
  /*
    TODO:  Add the logic here to:
      upload images
      process them to:
        ensure svg's have xmlns attributes
        create the images in various resolutions
        Use a srcset on the next image to load the proper image.
          determine how to set the height and width by doing so

        Enable the images to be given an id.     
      
      Cropper:        
        Do I want too this?
    */

  const { validFiles, onIdChange, onCancel, onRemoveFile, FileSelector } =
    useFileSelector({
      maximumUploadCount: 5, //Defaults to 30
      maximumFileSize,
      acceptedTypes: defaultTypeExtensions, //See the default extensions above
    });

  const onSelect = () => {
    if (Array.isArray(validFiles)) {
      //This will be used to select the files individual.  Loop through and set each one to selected
    }
  };

  const imageIdChange =
    (index: number, id: string) => (e: MouseEvent<HTMLImageElement>) => {
      e.preventDefault();
      onIdChange(index, id, validFiles);
    };

  const removeImage = (index: number) => (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onRemoveFile(index);
  };

  console.log(`validFiles
    ${JSON.stringify(validFiles)}
    `)
  return (
    <div>
      <FileSelector />
      {validFiles.length > 0 && (
        <Images //<---PreviewImages is a component where you render the images.  It's up to you to provide this functionality
          onIdChange={imageIdChange}
          images={validFiles}
          onCancel={onCancel}
          onRemove={removeImage}
        />
      )}
    </div>
  );
};

export { ImagesContainer as Images };
