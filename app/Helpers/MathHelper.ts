

export default class MathHelper {

  public static getAverage(values: number[]): number {
    let sum = 0;
    for (let value of values) {
      sum += value;
    }

    return sum / values.length;
  }

  public static getMedian(values: number[]): number {
    values = values.sort((a,b) => a - b);
    const halfIndex = Math.floor(values.length / 2);

    if (values.length % 2) {
      return values[halfIndex];
    }

    return (values[halfIndex - 1] + values[halfIndex + 1]) / 2;
  }

  public static getMin(values: number[]): number {
    let min: number|null = null;

    for (let value of values) {
      if (min === null) {
        min = value;
      }

      if (value < min) {
        min = value;
      }
    }

    return min ?? 0;
  }
}
