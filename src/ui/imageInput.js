export function createImageInputController({
  dropZone,
  imageUploadInput,
  uploadPrompt,
  imagePreviewContainer,
  imagePreview,
  imageName,
  removeImageBtn,
  textInput,
}) {
  let imageBase64 = null;

  const setTextDisabled = (isDisabled) => {
    textInput.disabled = isDisabled;
    if (isDisabled) {
      textInput.value = "";
      textInput.classList.add("field-disabled");
    } else {
      textInput.classList.remove("field-disabled");
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        imageBase64 = event.target.result.split(",")[1];
        imagePreview.src = event.target.result;
        imageName.textContent = file.name;
        uploadPrompt.classList.add("hidden");
        imagePreviewContainer.classList.remove("hidden");
        setTextDisabled(true);
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
    setTextDisabled(false);
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

  removeImageBtn.addEventListener("click", clearImage);

  return {
    getImageBase64: () => imageBase64,
    clearImage,
  };
}
