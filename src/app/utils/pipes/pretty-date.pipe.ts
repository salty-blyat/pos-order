import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'prettyDate',
    standalone: false
})
export class PrettyDate implements PipeTransform {
  transform(time: any, dateFormat: any,lang: any): string {
    var date;

    if (time instanceof Date) {
      date = time;
    } else {
      var temp = (time || "").replace(/-/g, "/").replace(/[T]/g, " ").split(" ");
      var time = temp[1] ? temp[1] : '';
      var dateTemp = temp[0];
      if(dateFormat != undefined){
        dateTemp = dateTemp.split('/');
        switch (dateFormat) {
          case 'dd/mm/yyyy':
            dateTemp = dateTemp[2]+'/'+dateTemp[1]+'/'+dateTemp[0]+' '+time;
            break;
          case 'mm/dd/yyyy':
            dateTemp = dateTemp[2] + '/' + dateTemp[0] + '/' + dateTemp[1] + ' ' + time;
            break;
          case 'yyyy/mm/dd':
            dateTemp = dateTemp[0] + '/' + dateTemp[1] + '/' + dateTemp[2] + ' ' + time;
            break;
          case 'yyyy/dd/mm':
            dateTemp = dateTemp[0] + '/' + dateTemp[2] + '/' + dateTemp[1] + ' ' + time;
            break;
          default:
            break;
        }
      }
      date = new Date(dateTemp);
    }

    try{
      var diff = (((new Date()).getTime() - date.getTime()) / 1000);
      var day_diff = Math.floor(diff / 86400);
    } catch(e){
      return dateTemp.substring(0,10);
    }

    if (isNaN(day_diff) || day_diff < 0)
      return dateTemp.substring(0,10);

    // @ts-ignore
    return day_diff == 0 && (
        diff < 60 && (lang == 'en' ? 'just now' : 'ឥឡូវនេះ') ||
        diff < 120 && "1" + (lang == 'en' ? ' minute ago' : ' នាទីមុន') ||
        diff < 3600 && Math.floor(diff / 60) + (lang == 'en' ? ' minutes ago' : ' នាទីមុន') ||
        diff < 7200 && "1" + (lang == 'en' ? 'hour ago' : 'ម៉ោងមុន') ||
        diff < 86400 && Math.floor(diff / 3600) + (lang == 'en' ? ' hours ago' : ' ម៉ោងមុន')) ||
      day_diff == 1 && (lang == 'en' ? 'Yesterday' : 'ម្សិលមិញ') ||
      day_diff < 7 && day_diff + (lang == 'en' ? ' days ago' : ' ថ្ងៃមុន') ||
      day_diff == 7 && "1" + (lang == 'en' ? ' week ago' : ' សប្តាហ៍មុន') ||
      day_diff < 31 && Math.ceil(day_diff / 7) + (lang == 'en' ? ' weeks ago' : ' សប្តាហ៍មុន') ||
      day_diff < 365 && Math.ceil(day_diff / 30) + (lang == 'en' ? ' months ago' : ' ខែមុន') ||
      day_diff >= 365 && "1" + (lang == 'en' ? ' year ago' : ' ឆ្នាំមុន') ||
      day_diff > 730 && Math.round(day_diff / 365) + (lang == 'en' ? ' year ago' : ' ឆ្នាំមុន');
  }
}
