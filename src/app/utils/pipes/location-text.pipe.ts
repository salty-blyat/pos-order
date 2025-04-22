import { Pipe, PipeTransform } from '@angular/core';
import { ILocation } from '../../helpers/location-api.service';

export interface LocationPipe {
  locationCode?: string;
  /*
   . street, home, village, etc,...
   */
  village?: string;
  /*
   . commune, district and province
   */
  locationText?: string;
}

@Pipe({
    name: 'locationText',
    standalone: false
})
export class LocationTextPipe implements PipeTransform {
  // @ts-ignore
  transform(value: any, ...args): string {
    if (!value) {
      return '';
    }
    let offsetText = '';
    const locationPipe = this.toObject(value);
    if (locationPipe) {
      // @ts-ignore
      offsetText = locationPipe.locationCode;
    }
    return value.replace(offsetText, '').trim();
  }

  /*
    . args[0]: location fist line(Home, Street, Village,...)
   */
  toFullText(
    value: { province?: ILocation; district?: ILocation; commune?: ILocation },
    ...args: string[]
  ): string {
    let locationText = '';
    let locationCode = '';
    const offsetText = '(គ្មាន)';
    if (args[0]) {
      locationText += `${args[0]}\n`;
    }
    if (value.commune) {
      // @ts-ignore
      locationCode = value.commune.id;
      locationText +=
        !value.commune.name || value.commune.name.includes(offsetText)
          ? ''
          : `${value.commune.name} `;
    }
    if (value.district) {
      if (!locationCode) {
        // @ts-ignore
        locationCode = value.district.id;
      }
      locationText +=
        !value.district.name || value.district.name.includes(offsetText)
          ? ''
          : `${value.district.name} `;
    }
    if (value.province) {
      if (!locationCode) {
        // @ts-ignore
        locationCode = value.province.id;
      }
      locationText +=
        !value.province.name || value.province.name.includes(offsetText)
          ? ''
          : `${value.province.name} `;
    }
    locationText = `${locationText.trim()} \n[${locationCode || ''}]`;
    return locationText.trim();
  }

  toObject(param: string): LocationPipe {
    if (!param) {
      return {};
    }
    let targets: { type: number; value: string }[] = [];
    let index = 0;
    if (!param.includes('\n')) {
      // dummy empty location text, code
      param += '\n\n[]';
    }
    param
      .split('\n')
      .forEach((itm) => targets.push({ type: ++index, value: itm }));
    targets = targets.sort((i, j) => j.type - i.type);

    const locationCode = targets[0]?.value || '';
    const locationText = targets[1]?.value || '';
    // set village text is location blank([001010])..
    const village = targets[locationCode === '[001010]' ? 1 : 2]?.value || '';
    return { village, locationText, locationCode };
  }
}
