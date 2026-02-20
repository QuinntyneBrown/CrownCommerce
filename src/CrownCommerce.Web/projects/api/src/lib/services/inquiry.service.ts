import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { API_CONFIG } from '../api.config';
import type {
  ContactInquiry,
  CreateContactRequest,
  CreateInquiryRequest,
  CreateWholesaleInquiryRequest,
  Inquiry,
  WholesaleInquiry,
} from '../models/inquiry.models';

@Injectable({ providedIn: 'root' })
export class InquiryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(API_CONFIG).baseUrl}/api/inquiries`;

  createInquiry(request: CreateInquiryRequest): Observable<Inquiry> {
    return this.http.post<Inquiry>(`${this.baseUrl}/inquiries`, request);
  }

  getInquiries(): Observable<Inquiry[]> {
    return this.http.get<Inquiry[]>(`${this.baseUrl}/inquiries`);
  }

  deleteInquiry(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/inquiries/${id}`);
  }

  createWholesaleInquiry(request: CreateWholesaleInquiryRequest): Observable<WholesaleInquiry> {
    return this.http.post<WholesaleInquiry>(`${this.baseUrl}/wholesale`, request);
  }

  getWholesaleInquiries(): Observable<WholesaleInquiry[]> {
    return this.http.get<WholesaleInquiry[]>(`${this.baseUrl}/wholesale`);
  }

  createContactInquiry(request: CreateContactRequest): Observable<ContactInquiry> {
    return this.http.post<ContactInquiry>(`${this.baseUrl}/contact`, request);
  }

  getContactInquiries(): Observable<ContactInquiry[]> {
    return this.http.get<ContactInquiry[]>(`${this.baseUrl}/contact`);
  }
}
