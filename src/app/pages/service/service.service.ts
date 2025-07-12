import { Injectable } from '@angular/core';

export interface Service {
    id?: number;
    trackQty?: boolean;
    departmentName?: string | null;
    serviceTypeName?: string | null;
    name?: string | null;
    serviceTypeId?: number | null;
    departmentId?: number | null;
    maxQty?: number | null;
    image?: string | null;
    description?: string | null;
}

@Injectable({ providedIn: 'root' })
export class ServiceService {

} 