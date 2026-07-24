import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToysAccessories } from './toys-accessories';

describe('ToysAccessories', () => {
  let component: ToysAccessories;
  let fixture: ComponentFixture<ToysAccessories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToysAccessories]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToysAccessories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
