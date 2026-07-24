import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDistricts } from './new-districts';

describe('NewDistricts', () => {
  let component: NewDistricts;
  let fixture: ComponentFixture<NewDistricts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewDistricts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewDistricts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
