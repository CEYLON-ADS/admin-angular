import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'truncate'
})
export class TruncatePipePipe implements PipeTransform {
  transform(value: string, limit = 50, trail = '...'): string {
    return value && value.length > limit ? value.substring(0, limit) + trail : value;
  }
}
