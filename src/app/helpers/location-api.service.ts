import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

export interface ILocation {
  id?: string;
  name?: string;
  name_en?: string;
  pid?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationApiService {
  locations: BehaviorSubject<ILocation[]>;

  path: string;

  constructor(private http: HttpClient) {
    this.path = '../../assets/other/kh-2020.json';
    // @ts-ignore
    this.locations = new BehaviorSubject<ILocation[]>(null);
  }

  get(parent: string): Observable<ILocation[]> {
    return this.http.get<ILocation[]>(this.path).pipe(
      map((res) => res.filter(itm => itm.pid === parent))
    );
  }

  find(id: string): Observable<ILocation> {
    // @ts-ignore
    return this.http.get(this.path).pipe(
      // @ts-ignore
      map((res: ILocation[]) => {
        return res.find(itm => itm.id === id);
      })
    );
  }
 }
