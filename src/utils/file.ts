interface Resolution {
  width: number;
  height: number;
  label: string;
}

interface FileGroup {
  id: string;
  files: File[];
}

export const imgResolutions: Resolution[] = [
  { width: 360, height: 640, label: "small" }, // Mobile small
  { width: 768, height: 1366, label: "md" }, // Mobile medium
  { width: 1280, height: 720, label: "lg" }, // Desktop standard
  { width: 1920, height: 1080, label: "xl" }, // Full HD
  { width: 3840, height: 2160, label: "xxl" }, // 4K
];
function* resizeImageFileGenerator(
  file: File,
  targetWidth: number,
  targetHeight: number
): Generator<undefined, File, undefined> {
  // Step 1: Read the file as a data URL
  const reader = new FileReader();
  let fileDataUrl: string | undefined;

  reader.onload = () => {
    fileDataUrl = reader.result as string;
  };
  reader.onerror = () => {
    throw new Error("Failed to read the file.");
  };
  reader.readAsDataURL(file);

  yield; // Pause until FileReader completes

  if (!fileDataUrl) {
    throw new Error("FileReader result is undefined.");
  }

  // Step 2: Load the image
  const img = new Image();
  let imageLoaded = false;

  img.onload = () => {
    imageLoaded = true;
  };
  img.onerror = () => {
    throw new Error("Failed to load the image.");
  };
  img.src = fileDataUrl;

  yield; // Pause until image loads

  if (!imageLoaded) {
    throw new Error("Image loading failed.");
  }

  // Step 3: Resize the image using a canvas
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D context not supported.");
  }

  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  // Step 4: Convert the canvas to a Blob
  let resizedBlob: Blob | null = null;

  canvas.toBlob(
    (blob) => {
      resizedBlob = blob;
    },
    file.type,
    1.0 // Quality for image (1.0 is max quality)
  );

  yield; // Pause until canvas.toBlob completes

  if (!resizedBlob) {
    throw new Error("Canvas conversion to Blob failed.");
  }

  // Step 5: Create and return a new File object from the Blob
  return new File([resizedBlob], file.name, {
    type: file.type,
    lastModified: Date.now(),
  });
}

// Example usage
const processFile = (file: File, width: number, height: number): File => {
  const generator = resizeImageFileGenerator(file, width, height);
  let result = generator.next(); // Start the generator

  // Advance the generator step-by-step
  while (!result.done) {
    result = generator.next();
  }

  // Return the resized file
  return result.value as File;
};

function* resizeImageForResolutionsGenerator(
  file: File,
  id: string,
  resolutions: Resolution[]
): Generator<undefined, { [key: string]: File }, undefined> {
  const resizedFiles: { [key: string]: File } = {};
  let i = 0;

  while (i < resolutions.length) {
    const { width, height, label } = resolutions[i];

    // Generator logic for resizing a single image
    const resizeGenerator = resizeImageFileGenerator(file, width, height);
    let result = resizeGenerator.next(); // Start the generator

    // Step through the resize generator
    while (!result.done) {
      result = resizeGenerator.next();
    }

    resizedFiles[`${id}_${label}`] = result.value as File; // Store the resized file with the id and label
    i++;
    yield; // Pause after each resolution
  }

  return resizedFiles; // Return the object of resized files
}

// Function to handle resizing for multiple resolutions
const processFileForResolutions = (
  file: File,
  id: string,
  resolutions: Resolution[]
): { [key: string]: File } => {
  const generator = resizeImageForResolutionsGenerator(file, id, resolutions);
  let result = generator.next(); // Start the generator

  // Exhaust the generator
  while (!result.done) {
    result = generator.next();
  }

  return result.value as { [key: string]: File }; // Return the object of resized files
};

export const processUploadedImageFiles = (
  fileGroups: FileGroup[], // Array of file groups, each containing an id and files[]
  imageResolutions: Resolution[] = imgResolutions
): { [key: string]: { [key: string]: File } } => {
  const result: { [key: string]: { [key: string]: File } } = {};

  let i = 0; // Index for iterating over fileGroups

  // Use while loop to iterate over the file groups
  while (i < fileGroups.length) {
    const fileGroup = fileGroups[i];
    const resizedFiles: { [key: string]: File } = {};

    let j = 0; // Index for iterating over the files in the current fileGroup

    // Use while loop to iterate over the files in the file group
    while (j < fileGroup.files.length) {
      const file = fileGroup.files[j];
      const resizedFile = processFileForResolutions(
        file,
        fileGroup.id,
        imageResolutions
      );

      // Directly assign the resized files to the resizedFiles object using the key (id)
      Object.keys(resizedFile).forEach((key) => {
        resizedFiles[key] = resizedFile[key];
      });

      j++;
    }

    // Add the resized files to the result object under the file group id
    result[fileGroup.id] = resizedFiles;
    i++;
  }

  return result;
};


//Utils to store files in sessionstorage
//In TypeScript (or JavaScript), you can't directly store file objects, such as those created from uploading images, in sessionStorage because sessionStorage only supports storing strings. However, you can convert the file to a Base64 string and then store it.

//Refactor
/*
//Convert each file to a Base64 string and store the array in sessionStorage:
async function storeFilesInSessionStorage(files: File[]) {
    const fileDataArray = await Promise.all(files.map(async (file) => {
        const base64String = await fileToBase64(file);
        return {
            name: file.name,
            type: file.type,
            file: base64String
        };
    }));
    sessionStorage.setItem('uploadedFiles', JSON.stringify(fileDataArray));
}

//Convert the file to a Base64 string:
function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}
//Store the Base64 string in sessionStorage:
async function storeFileInSessionStorage(file: File) {
    try {
        const base64String = await fileToBase64(file);
        sessionStorage.setItem('uploadedImage', base64String);
    } catch (error) {
        console.error('Error converting file to Base64:', error);
    }
}

//Convert the Base64 string to a Blob:
function base64ToBlob(base64: string, contentType: string): Blob {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}
//Convert the Blob to a File:
function blobToFile(blob: Blob, fileName: string): File {
    return new File([blob], fileName, { type: blob.type });
}
//Combine the steps to convert a Base64 string to a File:
function base64ToFile(base64: string, fileName: string, contentType: string): File {
    const blob = base64ToBlob(base64, contentType);
    return blobToFile(blob, fileName);
}
*/

//----------------
// Function to convert a file to a Base64 string
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
  });
}

// Function to store an array of files in sessionStorage
async function storeFilesInSessionStorage(files: File[]) {
  const fileDataArray = await Promise.all(files.map(async (file) => {
      const base64String = await fileToBase64(file);
      return {
          name: file.name,
          type: file.type,
          file: base64String
      };
  }));
  sessionStorage.setItem('uploadedFiles', JSON.stringify(fileDataArray));
}

// Function to retrieve the array of files from sessionStorage
function getFilesFromSessionStorage(): { name: string, type: string, file: string }[] | null {
  const fileDataArrayString = sessionStorage.getItem('uploadedFiles');
  return fileDataArrayString ? JSON.parse(fileDataArrayString) : null;
}

// Function to convert a Base64 string to a Blob
function base64ToBlob(base64: string, contentType: string): Blob {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}

// Function to convert a Blob to a File
function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, { type: blob.type });
}

// Function to convert a Base64 string to a File
function base64ToFile(base64: string, fileName: string, contentType: string): File {
  const blob = base64ToBlob(base64, contentType);
  return blobToFile(blob, fileName);
}

// Example usage
const storedFileDataArray = getFilesFromSessionStorage();
if (storedFileDataArray) {
  const files = storedFileDataArray.map(data => base64ToFile(data.file, data.name, data.type));
  console.log(files); // This will log the array of File objects
}