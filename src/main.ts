import "./style.css";
import html2canvas from "html2canvas";

const ext = document.querySelector("#ext") as HTMLSelectElement;
const downloadBtn = document.querySelector("#download") as HTMLButtonElement;
const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const textContainer = document.querySelector("#text-container") as HTMLDivElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const textSizeSlider = document.querySelector("#text-size") as HTMLInputElement;
const contrastSlider = document.querySelector("#contrast") as HTMLInputElement;
const textAlignContainer = document.querySelector(".text-align") as HTMLDivElement;

let lastChange = Date.now();
let prevInput: null | string = null;

const { drawPixels } = new ComlinkWorker<typeof import("./worker")>(new URL("./worker", import.meta.url));

textContainer.addEventListener("input", () => (lastChange = Date.now()));

setInterval(async () => {
  if (Date.now() - lastChange < 1000 || prevInput === textContainer.innerHTML) return;
  prevInput = textContainer.innerHTML;
  await loadImage();
}, 500);

async function loadImage() {
  canvas.height = textContainer.getBoundingClientRect().height;
  canvas.width = textContainer.getBoundingClientRect().width;

  const canvasData = await html2canvas(textContainer);
  const ctxData = canvasData.getContext("2d") as CanvasRenderingContext2D;

  const imageData = await drawPixels(
    ctxData.getImageData(0, 0, canvas.width, canvas.height),
    Number(contrastSlider.value)
  );
  const imageBitmap = await createImageBitmap(imageData, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(imageBitmap, 0, 0);
}

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = canvas.toDataURL(ext.value);
  link.download = `secret.${ext.value}`;
  link.click();
  link.remove();
});

textSizeSlider.addEventListener("input", () => {
  textContainer.style.setProperty("--text-size", `${+textSizeSlider.value / 2}`);
  prevInput = null;
});
contrastSlider.addEventListener("input", () => {
  prevInput = null;
});
textAlignContainer.addEventListener("input", e => {
  textContainer.style.setProperty("--text-align", (e.srcElement as HTMLElement).id);
  prevInput = null;
});
