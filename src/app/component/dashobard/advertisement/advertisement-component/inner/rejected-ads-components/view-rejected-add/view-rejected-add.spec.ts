import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRejectedAdd } from './view-rejected-add';

describe('ViewRejectedAdd', () => {
  let component: ViewRejectedAdd;
  let fixture: ComponentFixture<ViewRejectedAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewRejectedAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewRejectedAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
