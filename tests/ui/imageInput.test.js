import { describe, it, expect } from "vitest";
import { createImageInputController } from "../../src/ui/imageInput.js";

describe("imageInputController", () => {
  it("handles image upload and exposes base64", async () => {
    document.body.innerHTML = `
      <div id="drop-zone"></div>
      <input id="image-upload-input" />
      <div id="upload-prompt"></div>
      <div id="image-preview-container" class="hidden"></div>
      <img id="image-preview" />
      <div id="image-name"></div>
      <button id="remove-image-btn"></button>
      <textarea id="text-input"></textarea>
    `;

    const dropZone = document.getElementById("drop-zone");
    const imageUploadInput = document.getElementById("image-upload-input");
    const uploadPrompt = document.getElementById("upload-prompt");
    const imagePreviewContainer = document.getElementById(
      "image-preview-container"
    );
    const imagePreview = document.getElementById("image-preview");
    const imageName = document.getElementById("image-name");
    const removeImageBtn = document.getElementById("remove-image-btn");
    const textInput = document.getElementById("text-input");

    globalThis.FileReader = class {
      readAsDataURL() {
        this.onload({ target: { result: "data:image/png;base64,abc" } });
      }
    };

    const controller = createImageInputController({
      dropZone,
      imageUploadInput,
      uploadPrompt,
      imagePreviewContainer,
      imagePreview,
      imageName,
      removeImageBtn,
      textInput,
    });

    const file = new File(["x"], "file.png", { type: "image/png" });
    Object.defineProperty(imageUploadInput, "files", {
      value: [file],
    });
    imageUploadInput.dispatchEvent(new Event("change"));

    expect(controller.getImageBase64()).toBe("abc");
    expect(textInput.disabled).toBe(true);
    expect(uploadPrompt.classList.contains("hidden")).toBe(true);
    expect(imagePreviewContainer.classList.contains("hidden")).toBe(false);
  });
});
