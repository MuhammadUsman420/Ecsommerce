import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


export interface BreadcrumbItem {
  parentId: Number;
  uId: string;
  isChild: boolean
}
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  _url=environment.baseUrl

  constructor(private http: HttpClient) { }

  getProducts(): Observable<any> {
    return this.http.get(this._url+ "product")
  }

  getProductsById(id:any): Observable<any> {
    return this.http.get(this._url+ "product/"+id)
  }
  editProductCategory(id:any , obj:any):Observable<any>{
    return this.http.put(this._url+"product/"+id , obj);
  }

  addCategory(obj:any){
    return this.http.post(this._url + "product/",obj);
  }

  mySubject: Subject<any> = new Subject<any>();


  myBreadCrumb:Subject<any> = new Subject<BreadcrumbItem>();

  positionChecker:Subject<BreadcrumbItem> = new Subject<BreadcrumbItem>;
  

  


  
}
