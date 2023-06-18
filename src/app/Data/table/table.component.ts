import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from 'src/app/Services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

export interface Category {
  uniqueCategoryNumber: string;
  categoryName: string;
  titleEnglish: string;
  titleFrench: string;
  status: string;
  actions: string;
  childrenCategories:Category[];
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  displayedColumns: string[] = ['check', 'categoryName', 'titleEnglish', 'titleFrench', 'status', 'actions'];
  showModal = false;
  showModalForNewCategory = false;
  selectedItem: any;
  openEdit: boolean = false;
  check: boolean | undefined;
  getProductId: any;
  updatedResponse: any = [];
  dataSource: Category[] = []
  EditForm: any;
  dataStorageForEdit: any = [];
  objectForPatching: any;
  parentId: any = 0;
  data: any;
  createForm: FormGroup;
  newResponseAfterAdd: any = [];
  isShow: boolean | undefined;
  paramId: any;
  isChild: boolean = true;

  constructor(private products_service: ProductService, private fb: FormBuilder, private route: ActivatedRoute,
    private router: Router) {
    this.createForm = this.fb.group({
      uniqueCategoryNumber: [uuidv4()],
      categoryName: [''],
      titleEnglish: [''],
      titleFrench: [''],
      status: [''],
      childrenCategories: this.fb.array([])
    });
  }

  ngOnInit(): any {
   // this.getProducts();
    this.products_service.mySubject.subscribe(res => {
      if (res == "true") {
        this.openModalForAddNewCategory();
      }
    })

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const unique = params['uniq'];
      if (id) {
        this.products_service.getProductsById(id).subscribe(res => {
          debugger
          if (res != undefined && res.uniqueCategoryNumber == unique) {
            this.dataSource = res.childrenCategories
            console.log(this.dataSource);
           
          } else {
            this.dataSource = this.findCategory(res.childrenCategories, unique);
          
          }
        })
      } else{
        this.getProducts();
      }
    });
  }

  getProducts() {
    debugger;
    this.products_service.getProducts().subscribe(res => {
      this.dataSource = res;
      this.dataStorageForEdit = res;
     
    })
  }

  addIntoProduct(newChild: any, data: any, uniqueNumber: any, isChild: boolean) {
    debugger
    if (data.some((c: any) => c.uniqueCategoryNumber == uniqueNumber)) {
      console.log("okay");
      let obj = data.find((d: any) => d.uniqueCategoryNumber == uniqueNumber)
      obj.childrenCategories.push(newChild)
      return;
    } else {
      for (let d of data) {
        this.addIntoProduct(newChild, d.childrenCategories, uniqueNumber, isChild)
      }
    }
  }

  findCategory(data: any, uniqueNumber: any) {
    debugger
    if (data.some((c: any) => c.uniqueCategoryNumber == uniqueNumber)) {
      return data.find((d: any) => d.uniqueCategoryNumber == uniqueNumber).childrenCategories;
    } else {
      for (let d of data) {
        this.findCategory(d.childrenCategories, uniqueNumber)
      }
    }
  }

  getCategory(obj: any, index: any) {
    if(obj.id) {
      this.parentId = obj.id;
    }

    this.router.navigate([''], { queryParams: { id: this.parentId, uniq: obj.uniqueCategoryNumber, isChild: this.isChild } });
  }

  openModal() {
    this.showModal = true;
    this.showModalForNewCategory = true
  }

  closeModalOfAdd() {
    this.showModalForNewCategory = false
  }

  closeModal() {
    if (this.check == true) {
      this.showModal = false;
    }
    this.showModalForNewCategory = false

  }

  EditCategory(obj: Category) {
    this.objectForPatching = obj;
    this.showModal = true;
    this.getProductId = obj.uniqueCategoryNumber;

    this.selectedItem = obj;
    this.EditForm = this.fb.group({
      categoryId: [''],
      categoryName: [''],
      titleEnglish: [''],
      titleFrench: ['']
    });

    this.EditForm.patchValue(this.selectedItem);
    this.openEdit = true;
  }

  openModalForAddNewCategory() {
    this.showModalForNewCategory = true;
  }

  addNewCategory() {
    debugger

    this.route.queryParams.subscribe(params => {
      debugger;
      const id = params['id'];
      const unique = params['uniq'];

      if (id == null) {

        console.log(this.createForm.value);


        this.products_service.addCategory(this.createForm.value).subscribe(res => {
          this.newResponseAfterAdd = res
          console.log(this.newResponseAfterAdd);
          this.getProducts();
          this.showModalForNewCategory = false
        })
      } else {
        const queryParams = new URLSearchParams(window.location.search);
        this.paramId = queryParams.get('id');
        const queryParamsUid = new URLSearchParams(window.location.search);
        const Uid = queryParamsUid.get('uniq');

        let parentId = 1 //url
        let uniqueNumber = 'DEF3691' //url
        let isChild = true; //url
        let data = this.dataStorageForEdit.filter((d: any) => {
          return d.id == id;
        })

        this.addIntoProduct(this.createForm.value, data, Uid, isChild);
        this.showModalForNewCategory = false;
        this.parentId = parseInt(this.parentId)

        this.products_service.editProductCategory(this.paramId, data[0]).subscribe(res => {
          this.updatedResponse = res;
          console.log(this.updatedResponse);
        })
      }
    });

  }

  isEmpty(dataSource:Category[]){
      
  }

}
