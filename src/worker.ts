export function drawPixels(imageData: ImageData) {
  const { width, height } = imageData;
  const output = new ImageData(width, height);
  const { data } = output;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const red = imageData.data[index];
      const green = imageData.data[index + 1];
      const blue = imageData.data[index + 2];

      const color1 = Math.random();
      const color2 = Math.random();
      const color3 = 1 - color1 - color2;

      data[index] = color1 * red;
      data[index + 1] = color2 * green;
      data[index + 2] = color3 * blue;
      data[index + 3] = 255;
    }
  }

  return output;
}
