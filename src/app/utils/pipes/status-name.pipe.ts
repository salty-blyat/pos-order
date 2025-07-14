import {Injectable, Pipe, PipeTransform} from '@angular/core';
import { RequestStatus } from '../../pages/request/request.service';

@Pipe({
    name: 'statusName',
    standalone: false
})
@Injectable({ providedIn: 'root' })
export class StatusPipe implements PipeTransform{
  transform(value: RequestStatus): string {
    switch (value) {
      case RequestStatus.Pending:
        return 'Pending';
      case RequestStatus.InProgress:
        return 'In Progress';
      case RequestStatus.Done:
        return 'Done';
      case RequestStatus.Cancel:
        return 'Cancel';
      default:
        return '-';
    }
  }
}