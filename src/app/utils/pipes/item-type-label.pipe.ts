import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'itemTypeLabelPipe',
    standalone: false
})

export class ItemTypeLabelPipe implements PipeTransform{
  transform(value: any): any {
    if (value === 1) {
      return 'Service';
    }
    else if (value === 2){
      return 'NoStock';
    }
    else if (value === 3){
      return 'Stock';
    }
    else {
      return null;
    }
  }
}
