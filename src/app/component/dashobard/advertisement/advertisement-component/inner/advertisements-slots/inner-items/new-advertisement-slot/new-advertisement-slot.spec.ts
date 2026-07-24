import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAdvertisementSlot } from './new-advertisement-slot';

describe('NewAdvertisementSlot', () => {
  let component: NewAdvertisementSlot;
  let fixture: ComponentFixture<NewAdvertisementSlot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAdvertisementSlot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAdvertisementSlot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
