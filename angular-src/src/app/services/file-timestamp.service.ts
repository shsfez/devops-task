import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { FetchedResponse } from '../models/FetchedResponse';

@Injectable({
  providedIn: 'root'
})
export class FileTimestampService {
  updateDateUrl:string = '/api/update_date';

  constructor(private http:HttpClient) { }

  getMessage():Observable<FetchedResponse> {
    return this.http.get<FetchedResponse>(this.updateDateUrl);
  }
}
