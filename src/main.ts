import "./style.css";
import html2canvas from "html2canvas";

const ext = document.querySelector("#ext") as HTMLSelectElement;
const downloadBtn = document.querySelector("#download") as HTMLButtonElement;
const canvas = document.querySelector("#canvas") as HTMLCanvasElement;
const textContainer = document.querySelector("#text-container") as HTMLDivElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

let lastChange = Date.now();
let prevInput: null | string = null;

const { drawPixels } = new ComlinkWorker<typeof import("./worker")>(new URL("./worker", import.meta.url));

textContainer.addEventListener("input", () => (lastChange = Date.now()));

setInterval(async () => {
  if (Date.now() - lastChange < 1000 || prevInput === textContainer.innerHTML) return;
  prevInput = textContainer.innerHTML;

  canvas.height = textContainer.getBoundingClientRect().height;
  canvas.width = textContainer.getBoundingClientRect().width;

  const canvasData = await html2canvas(textContainer);
  const ctxData = canvasData.getContext("2d") as CanvasRenderingContext2D;

  const imageData = await drawPixels(ctxData.getImageData(0, 0, canvas.width, canvas.height));
  const imageBitmap = await createImageBitmap(imageData, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(imageBitmap, 0, 0);
}, 500);

downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = canvas.toDataURL(ext.value);
  link.download = `secret.${ext.value}`;
  link.click();
  link.remove();
});
