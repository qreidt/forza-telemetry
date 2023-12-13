
export function $percentage(value: number, decimals: number = 0): string {
    return (value * 100).toFixed(decimals);
}