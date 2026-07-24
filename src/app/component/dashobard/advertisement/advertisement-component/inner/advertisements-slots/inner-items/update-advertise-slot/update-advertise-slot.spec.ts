import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateAdvertiseSlot } from './update-advertise-slot';

describe('UpdateAdvertiseSlot', () => {
  let component: UpdateAdvertiseSlot;
  let fixture: ComponentFixture<UpdateAdvertiseSlot>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateAdvertiseSlot]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateAdvertiseSlot);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
