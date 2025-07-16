import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'prettyDate',
    standalone: false
})
export class PrettyDate implements PipeTransform {
  transform(datetime: any, dateFormat: any, lang: any): string {
    var date;

    if (datetime instanceof Date) {
      date = datetime;
    } else {
      var temp = (datetime || '')
          .replace(/-/g, '/')
          .replace(/[T]/g, ' ')
          .split(' ');
      var time = temp[1] ? temp[1] : '';
      var dateTemp = temp[0];
      if (dateFormat != undefined) {
        dateTemp = dateTemp.split('/');
        switch (dateFormat) {
          case 'dd/mm/yyyy':
            dateTemp =
                dateTemp[2] + '/' + dateTemp[1] + '/' + dateTemp[0] + ' ' + time;
            break;
          case 'mm/dd/yyyy':
            dateTemp =
                dateTemp[2] + '/' + dateTemp[0] + '/' + dateTemp[1] + ' ' + time;
            break;
          case 'yyyy/mm/dd':
            dateTemp =
                dateTemp[0] + '-' + dateTemp[1] + '-' + dateTemp[2] + 'T' + time;
            break;
          case 'yyyy/dd/mm':
            dateTemp =
                dateTemp[0] + '/' + dateTemp[2] + '/' + dateTemp[1] + ' ' + time;
            break;
          case 'yyyy-MM-dd':
            dateTemp = dateTemp[0] + '-' + dateTemp[1] + '-' + dateTemp[2];
            break
          default:
            dateTemp = dateTemp[0] + '-' + dateTemp[1] + '-' + dateTemp[2] + 'T' + time;
            break;
        }
      }
      date = new Date(dateTemp);
    }

    try {
      var diff = (new Date().getTime() - date.getTime()) / 1000;
      var day_diff = Math.floor(diff / 86400);
    } catch (e) {
      return dateTemp.substring(0, 10);
    }

    if (isNaN(day_diff) || day_diff < 0) {
      // @ts-ignore
      return (
          (day_diff == -1 &&
              ((-diff < 60 && '1' + (lang == 'en' ? ' more minute' : ' នាទីទៀត')) ||
                  (-diff < 120 &&
                      -Math.floor(diff / 60) +
                      (lang == 'en' ? ' more minutes' : ' នាទីទៀត')) ||
                  (-diff < 3600 &&
                      -Math.floor(diff / 60) +
                      (lang == 'en' ? ' more minutes' : ' នាទីទៀត')) ||
                  (-diff < 7200 && '1' + (lang == 'en' ? ' more hour' : 'ម៉ោងទៀត')) ||
                  (-diff < 86400 &&
                      -Math.floor(diff / 3600) +
                      (lang == 'en' ? ' more hours' : ' ម៉ោងទៀត')))) ||
          (-day_diff < 7 &&
              -day_diff + (lang == 'en' ? ' more days' : ' ថ្ងៃទៀត')) ||
          (-day_diff == 7 &&
              '1' + (lang == 'en' ? ' more week' : ' សប្តាហ៍ទៀត')) ||
          (-day_diff < 31 &&
              -Math.ceil(day_diff / 7) +
              (lang == 'en' ? ' more weeks' : ' សប្តាហ៍ទៀត')) ||
          (-day_diff < 365 &&
              -Math.ceil(day_diff / 30) +
              (lang == 'en' ? ' more months' : ' ខែទៀត')) ||
          (-day_diff >= 365 &&
              '1' + (lang == 'en' ? ' more year' : ' ឆ្នាំទៀត')) ||
          (-day_diff > 730 &&
              -Math.round(day_diff / 365) +
              (lang == 'en' ? ' more year' : ' ឆ្នាំទៀត'))
      );
    }

    // @ts-ignore
    return (
        (day_diff == 0 &&
            ((diff < 60 && (lang == 'en' ? 'just now' : 'ឥឡូវនេះ')) ||
                (diff < 120 && '1' + (lang == 'en' ? ' minute ago' : ' នាទីមុន')) ||
                (diff < 3600 &&
                    Math.floor(diff / 60) +
                    (lang == 'en' ? ' minutes ago' : ' នាទីមុន')) ||
                (diff < 7200 && '1' + (lang == 'en' ? ' hour ago' : 'ម៉ោងមុន')) ||
                (diff < 86400 &&
                    Math.floor(diff / 3600) +
                    (lang == 'en' ? ' hours ago' : ' ម៉ោងមុន')))) ||
        (day_diff == 1 && (lang == 'en' ? 'Yesterday' : 'ម្សិលមិញ')) ||
        (day_diff < 7 && day_diff + (lang == 'en' ? ' days ago' : ' ថ្ងៃមុន')) ||
        (day_diff == 7 && '1' + (lang == 'en' ? ' week ago' : ' សប្តាហ៍មុន')) ||
        (day_diff < 31 &&
            Math.ceil(day_diff / 7) +
            (lang == 'en' ? ' weeks ago' : ' សប្តាហ៍មុន')) ||
        (day_diff < 365 &&
            Math.ceil(day_diff / 30) + (lang == 'en' ? ' months ago' : ' ខែមុន')) ||
        (day_diff > 730 &&
            Math.round(day_diff / 365) +
            (lang == 'en' ? ' year ago' : ' ឆ្នាំមុន')) ||
        (day_diff >= 365 && '1' + (lang == 'en' ? ' year ago' : ' ឆ្នាំមុន'))
    );
  }
}
