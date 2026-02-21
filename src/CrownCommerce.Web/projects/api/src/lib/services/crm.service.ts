import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { API_CONFIG } from '../api.config';
import type { CreateCustomerRequest, CreateLeadRequest, Customer, Lead } from '../models/crm.models';

@Injectable({ providedIn: 'root' })
export class CrmService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(API_CONFIG).baseUrl}/api/crm`;

  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.baseUrl}/crm/customers`);
  }

  getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/crm/customers/${id}`);
  }

  createCustomer(request: CreateCustomerRequest): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUrl}/crm/customers`, request);
  }

  updateCustomer(id: string, request: CreateCustomerRequest): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/crm/customers/${id}`, request);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/crm/customers/${id}`);
  }

  getLeads(): Observable<Lead[]> {
    return this.http.get<Lead[]>(`${this.baseUrl}/crm/leads`);
  }

  getLead(id: string): Observable<Lead> {
    return this.http.get<Lead>(`${this.baseUrl}/crm/leads/${id}`);
  }

  createLead(request: CreateLeadRequest): Observable<Lead> {
    return this.http.post<Lead>(`${this.baseUrl}/crm/leads`, request);
  }

  updateLead(id: string, request: CreateLeadRequest): Observable<Lead> {
    return this.http.put<Lead>(`${this.baseUrl}/crm/leads/${id}`, request);
  }

  deleteLead(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/crm/leads/${id}`);
  }
}
