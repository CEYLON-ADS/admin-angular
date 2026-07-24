import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateDistrict } from './update-district';

describe('UpdateDistrict', () => {
  let component: UpdateDistrict;
  let fixture: ComponentFixture<UpdateDistrict>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateDistrict]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateDistrict);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
