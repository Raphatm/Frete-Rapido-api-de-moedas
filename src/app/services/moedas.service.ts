// moedas.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MoedasData, Moeda } from '../components/models/moedasData';

@Injectable({
  providedIn: 'root',
})
export class MoedasService {
  private baseURL: string = '';

  constructor(private http: HttpClient) {
    this.baseURL = environment.moedasApi;
  }

  getMoeda(moedaName: string): Observable<MoedasData> {
    return this.http.get<MoedasData>(`${this.baseURL}${moedaName}`);
  }
}
