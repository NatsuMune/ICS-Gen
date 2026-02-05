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

  const guessMimeType = (base64) => {
    if (!base64 || typeof base64 !== "string") return "image/png";
    if (base64.startsWith("/9j/")) return "image/jpeg";
    if (base64.startsWith("iVBOR")) return "image/png";
    if (base64.startsWith("R0lG")) return "image/gif";
    if (base64.startsWith("UklGR")) return "image/webp";
    return "image/png";
  };

  const setImageFromBase64 = (value, name = "URL image") => {
    if (!value || typeof value !== "string") return;
    const trimmed = value.trim();
    if (!trimmed) return;

    let base64 = trimmed;
    let previewSrc = trimmed;

    if (trimmed.startsWith("data:image/")) {
      const splitIndex = trimmed.indexOf(",");
      if (splitIndex !== -1) {
        base64 = trimmed.slice(splitIndex + 1);
        previewSrc = trimmed;
      }
    } else {
      const mimeType = guessMimeType(trimmed);
      previewSrc = `data:${mimeType};base64,${trimmed}`;
    }

    imageBase64 = base64;
    imagePreview.src = previewSrc;
    imageName.textContent = name;
    uploadPrompt.classList.add("hidden");
    imagePreviewContainer.classList.remove("hidden");
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
    setImageFromBase64,
    clearImage,
  };
}
