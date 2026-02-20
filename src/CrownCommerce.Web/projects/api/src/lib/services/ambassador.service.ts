import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { API_CONFIG } from '../api.config';
import type {
  AmbassadorApplication,
  AmbassadorProgram,
  CreateAmbassadorApplicationRequest,
} from '../models/ambassador.models';

@Injectable({ providedIn: 'root' })
export class AmbassadorService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(API_CONFIG).baseUrl}/api/ambassador`;

  getProgramInfo(): Observable<AmbassadorProgram> {
    return this.http.get<AmbassadorProgram>(`${this.baseUrl}/program`);
  }

  applyForProgram(request: CreateAmbassadorApplicationRequest): Observable<AmbassadorApplication> {
    return this.http.post<AmbassadorApplication>(`${this.baseUrl}/applications`, request);
  }

  getApplicationStatus(email: string): Observable<AmbassadorApplication> {
    return this.http.get<AmbassadorApplication>(`${this.baseUrl}/applications/status/${email}`);
  }

  getApplications(): Observable<AmbassadorApplication[]> {
    return this.http.get<AmbassadorApplication[]>(`${this.baseUrl}/applications`);
  }
}
