

export function $getTimeStringFromSeconds(seconds: number): string {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const [secs, millis] = ((Math.floor(seconds * 1000) % 60000) / 1000)
        .toString().split('.');

    return `${mins}:${secs.padStart(2, '0')}.${millis ?? '000'}`;
}