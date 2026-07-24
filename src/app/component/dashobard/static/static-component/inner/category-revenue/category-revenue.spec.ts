import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryRevenue } from './category-revenue';

describe('CategoryRevenue', () => {
  let component: CategoryRevenue;
  let fixture: ComponentFixture<CategoryRevenue>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryRevenue]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryRevenue);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
