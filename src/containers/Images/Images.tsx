import { Images } from "@/components/Images";
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
  return <Images />;
};

export { ImagesContainer as Images };
