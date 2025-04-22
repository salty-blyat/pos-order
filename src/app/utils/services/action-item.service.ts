import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActionItemService {
  result: BehaviorSubject<any>;
  constructor() {
    this.result = new BehaviorSubject(null);
  }

  nextResult(type: any) {
    this.result.next(type);
  }

  get resultValue(): any {
    return this.result.value;
  }
}
