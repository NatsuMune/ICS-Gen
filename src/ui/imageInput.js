export function createImageInputController({
  dropZone,
  imageUploadInput,
  uploadPrompt,
  imagePreviewContainer,
  imagePreview,
  imageName,
  removeImageBtn,
}) {
  let imageBase64 = null;

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        imageBase64 = event.target.result.split(",")[1];
        imagePreview.src = event.target.result;
        imageName.textContent = file.name;
        uploadPrompt.classList.add("hidden");
        imagePreviewContainer.classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    imageBase64 = null;
    imageUploadInput.value = "";
    imagePreview.src = "";
    imageName.textContent = "";
    uploadPrompt.classList.remove("hidden");
    imagePreviewContainer.classList.add("hidden");
  };

  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.remove("drag-over");
    const files = event.dataTransfer.files;
    if (files.length) {
      imageUploadInput.files = files;
      handleFile(files[0]);
    }
  });

  imageUploadInput.addEventListener("change", (event) =>
    handleFile(event.target.files[0])
  );

  dropZone.addEventListener("click", (event) => {
    if (event.target.closest("#remove-image-btn")) return;
    imageUploadInput.click();
  });

  removeImageBtn.addEventListener("click", clearImage);

  return {
    getImageBase64: () => imageBase64,
    clearImage,
  };
}
