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
  id: number
  childrenCategories: Category[];
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
  datastore: any = [];
  getProductId1: any;
  uniqNumberToGet: any;

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

    this.EditForm = this.fb.group({
      categoryName: [''],
      titleEnglish: [''],
      titleFrench: [''],
      status: [''],
      uniqueCategoryNumber: [this.getProductId],
      childrenCategories: this.fb.array([])
    });
  }

  ngOnInit(): any {
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
          if (res != undefined && res.uniqueCategoryNumber == unique) {
            this.dataSource = res.childrenCategories

          } else {
            this.dataSource = this.findCategory(res.childrenCategories, unique);

          }
        })
      } else {
        this.getProducts();
      }
    });
  }

  getProducts() {
    this.products_service.getProducts().subscribe(res => {
      this.dataSource = res;
      this.dataStorageForEdit = res;


    })
  }

  addIntoProduct(newChild: any, data: any, uniqueNumber: any, isChild: boolean) {
    if (data.some((c: any) => c.uniqueCategoryNumber == uniqueNumber)) {
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
    if (data.some((c: any) => c.uniqueCategoryNumber == uniqueNumber)) {
      return data.find((d: any) => d.uniqueCategoryNumber == uniqueNumber).childrenCategories;
    } else {
      for (let d of data) {
        this.findCategory(d.childrenCategories, uniqueNumber)
      }
    }
  }

  getCategory(obj: any, index: any) {
    if (obj.id) {
      this.parentId = obj.id;
    }
    this.uniqNumberToGet = obj.uniqueCategoryNumber

    this.router.navigate([''], { queryParams: { id: this.parentId, uniq: obj.uniqueCategoryNumber, isChild: this.isChild } });
  }

  openModal() {
    this.showModal = true;
    this.showModalForNewCategory = true
  }

  closeModalOfAdd() {
    this.showModalForNewCategory = false
  }

  closeModalOfEdit(){
    this.showModal=false
  }

  update() {

    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const unique = params['uniq'];
      const isChild = params['isChild']

      if (id == null) {
        let find = this.dataStorageForEdit.find((el: any) => el.id == this.getProductId1)

        let storeChilds1 = find.childrenCategories;

        let storeChilds = find.childrenCategories;
        storeChilds.categoryName = this.EditForm.value.categoryName;
        storeChilds.titleEnglish = this.EditForm.value.titleEnglish;
        storeChilds.titleEnglish = this.EditForm.value.titleEnglish;
        storeChilds.uniqueCategoryNumber = this.EditForm.value.uniqueCategoryNumber;
        this.EditForm.value.childrenCategories = storeChilds1
        storeChilds.status = this.EditForm.value.status

        this.products_service.editProductCategory(find.id, this.EditForm.value).subscribe(res => {
          this.updatedResponse = res;
        })


      } else {

        this.products_service.getProducts().subscribe(res => {
          this.dataStorageForEdit = res;
          this.datastore = this.dataStorageForEdit.filter((d: any) => d.id == id);
          this.findParticularCategory(this.EditForm.value, this.datastore, unique, id);
          this.products_service.editProductCategory(id, this.datastore[0]).subscribe(res => {
            this.updatedResponse = res;
          })
        })
      }
    })

    this.showModal = false;
  }

  findParticularCategory(newChild: any, data: any, uniq: any, id: any) {

    if (data.some((c: any) => c.uniqueCategoryNumber == uniq)) {
      let obj = data.find((d: any) => d.uniqueCategoryNumber == uniq)

      let childs = obj.childrenCategories;
      if (childs.length == null) {
        obj.childrenCategories[0] = newChild
      } else {
        let findObject = obj.childrenCategories.find((el: any) => el.uniqueCategoryNumber == this.getProductId);
        let finIndex = obj.childrenCategories.findIndex((el: any) => el.uniqueCategoryNumber == this.getProductId)

        let collectChild = findObject.childrenCategories;
        this.EditForm.value.childrenCategories = collectChild
        findObject.categoryName = this.EditForm.value.categoryName;
        findObject.titleEnglish = this.EditForm.value.titleEnglish;
        findObject.titleEnglish = this.EditForm.value.titleEnglish;
        findObject.uniqueCategoryNumber = this.EditForm.value.uniqueCategoryNumber;
        obj.childrenCategories[finIndex] = this.EditForm.value;
        findObject.status = this.EditForm.value.status
      }
      return;
    } else {
      for (let d of data) {
        this.findParticularCategory(newChild, d.childrenCategories, uniq, id)
      }
    }

  }

  EditCategory(obj: Category, event: Event) {
    event.stopPropagation();
    this.showModal = true;
    this.getProductId = obj.uniqueCategoryNumber;

    this.getProductId1 = obj.id;

    this.selectedItem = obj;


    this.EditForm.patchValue(this.selectedItem);
    this.openEdit = true;
  }

  openModalForAddNewCategory() {
    this.showModalForNewCategory = true;
  }

  addNewCategory() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const unique = params['uniq'];

      if (id == null) {
        this.products_service.addCategory(this.createForm.value).subscribe(res => {
          this.newResponseAfterAdd = res
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
        })
      }
    });

  }

  isEmpty(dataSource: Category[]) {

  }

  deleteCategory(obj: any, event: Event) {
    event.stopPropagation();
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      const unique = params['uniq'];


      if (id) {
        this.products_service.getProducts().subscribe(res => {
          this.dataStorageForEdit = res;
          this.datastore = this.dataStorageForEdit.filter((d: any) => d.id == id);

          this.findForDelete(obj, this.datastore, obj.uniqueCategoryNumber, unique);

          this.products_service.deleteCategory(id, this.datastore[0]).subscribe(res => {
            this.updatedResponse = res;

          })


        })
      } else {


        this.products_service.deleteParentLevel(obj.id).subscribe(res => {
          this.updatedResponse = res;

        })
      }
    })

  }


  findForDelete(object: any, data: any, uniq: any, uniqno: any) {
    if (data.some((c: any) => c.uniqueCategoryNumber == uniq)) {
      let obj = data.find((d: any) => d.uniqueCategoryNumber == uniq);

      let findIndex = data.findIndex((el: any) => el.uniqueCategoryNumber == uniq);
      data.splice(findIndex, 1)


      return;
    } else {
      for (let d of data) {
        this.findForDelete(object, d.childrenCategories, uniq, uniq)
      }
    }
  }

}


