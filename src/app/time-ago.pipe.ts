import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: false  // ✅ for Angular 15+ standalone usage
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number | null | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    const seconds = Math.floor((+new Date() - +date) / 1000);

    const intervals: { [key: string]: number } = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
      second: 1
    };

    for (const key in intervals) {
      const interval = Math.floor(seconds / intervals[key]);
      if (interval >= 1) {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        return rtf.format(-interval, key as Intl.RelativeTimeFormatUnit);
      }
    }
    return 'a few seconds ago';
  }
}
