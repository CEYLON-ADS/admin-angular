import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSlotAdd } from './view-slot-add';

describe('ViewSlotAdd', () => {
  let component: ViewSlotAdd;
  let fixture: ComponentFixture<ViewSlotAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewSlotAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewSlotAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
