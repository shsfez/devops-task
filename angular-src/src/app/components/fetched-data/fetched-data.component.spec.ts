import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchedDataComponent } from './fetched-data.component';

describe('FetchedDataComponent', () => {
  let component: FetchedDataComponent;
  let fixture: ComponentFixture<FetchedDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetchedDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchedDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
