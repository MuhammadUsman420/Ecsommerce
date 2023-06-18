import { Component } from '@angular/core';
import { BreadcrumbItem, ProductService } from 'src/app/Services/product.service';
import {  BreadcrumbService } from '../breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent {

  breadcrumbItems: BreadcrumbItem[] = [];
  item:any;

  constructor(private breadcrumbService: BreadcrumbService , private productService:ProductService) { }

  ngOnInit() {
    // Update breadcrumb items based on your logic
    // this.breadcrumbItems = [
    //   { label: 'Home', link: '/home' },
    //   { label: 'Category', link: '/category' },
    //   { label: 'Subcategory', link: '/category/subcategory' }
    //   // Add more items as needed
    // ];

    this.productService.myBreadCrumb.subscribe(res=>{
      this.item=res;
      this.breadcrumbItems.push(this.item)
      console.log(this.breadcrumbItems);
      
    })

    // this.breadcrumbService.updateItems(this.breadcrumbItems);
  }

  passPosition(item:any){
    this.productService.positionChecker.next(item);
  }
}
