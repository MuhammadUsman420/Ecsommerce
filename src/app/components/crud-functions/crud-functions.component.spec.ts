import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudFunctionsComponent } from './crud-functions.component';

describe('CrudFunctionsComponent', () => {
  let component: CrudFunctionsComponent;
  let fixture: ComponentFixture<CrudFunctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrudFunctionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
