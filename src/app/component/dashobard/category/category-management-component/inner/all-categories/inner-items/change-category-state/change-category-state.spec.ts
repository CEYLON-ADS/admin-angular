import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeCategoryState } from './change-category-state';

describe('ChangeCategoryState', () => {
  let component: ChangeCategoryState;
  let fixture: ComponentFixture<ChangeCategoryState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangeCategoryState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangeCategoryState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
