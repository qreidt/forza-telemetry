import {DateTime} from 'luxon';

export function $getTimeStringFromSeconds(seconds: number): string {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const [secs, millis] = ((Math.floor(seconds * 1000) % 60000) / 1000)
        .toString().split('.');

    return `${mins}:${secs.padStart(2, '0')}.${millis ?? '000'}`;
}

export function $diffTime(best_time: number, comp_time: number): string {
    if (best_time === comp_time) {
        return '';
    }

    const diff = comp_time - best_time;
    return (diff >= 0)
        ? '+ ' + diff.toFixed(3)
        : '- ' + (diff * -1).toFixed(3);
}

export function isoToFormattedTime(iso_time: string|null): string {
    if (! iso_time) {
        return '-';
    }

    return DateTime.fromISO(iso_time).toFormat('ff');
}