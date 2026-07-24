import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCites } from './update-cites';

describe('UpdateCites', () => {
  let component: UpdateCites;
  let fixture: ComponentFixture<UpdateCites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateCites]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCites);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
