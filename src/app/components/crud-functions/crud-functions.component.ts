import { Component } from '@angular/core';
import { ProductService } from 'src/app/Services/product.service';

@Component({
  selector: 'app-crud-functions',
  templateUrl: './crud-functions.component.html',
  styleUrls: ['./crud-functions.component.css']
})
export class CrudFunctionsComponent {

  constructor(private service:ProductService){}

  add(){
    this.service.mySubject.next("true");
  }

}
