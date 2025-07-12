 
import { Injectable } from '@angular/core';

export interface History {
    id?: number;
    requestTime?: string | null;
    guestId?: number | null;
    roomId?: number | null;
    stayId?: number | null;
    serviceItemId?: number | null;
    quantity?: number | null;
    status?: number | null;
    note?: string | null;
    attachments?: string | null;
}

@Injectable({ providedIn: 'root' })
export class HistoryService {

} 