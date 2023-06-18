import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  // private itemsSubject: BehaviorSubject<BreadcrumbItem[]> = new BehaviorSubject<BreadcrumbItem[]>([]);
  // public items$: Observable<BreadcrumbItem[]> = this.itemsSubject.asObservable();

  // updateItems(items: BreadcrumbItem[]) {
  //   this.itemsSubject.next(items);
  // }
  
  constructor() { }
}

  // export interface BreadcrumbItem {
  //   label: string;
  //   link: string;
  // }
