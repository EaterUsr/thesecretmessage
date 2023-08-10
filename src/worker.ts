export function drawPixels(imageData: ImageData, contrast: number) {
  const { width, height } = imageData;
  const output = new ImageData(width, height);
  const { data } = output;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const red = imageData.data[index];
      const green = imageData.data[index + 1];
      const blue = imageData.data[index + 2];

      const gray = Math.max(Math.floor((red + green + blue) / 3), contrast);

      const color1 = Math.random();
      const color2 = Math.random();
      const color3 = 1 - color1 - color2;

      data[index] = color1 * gray;
      data[index + 1] = color2 * gray;
      data[index + 2] = color3 * gray;
      data[index + 3] = 255;
    }
  }

  return output;
}
