import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCountry } from './new-country';

describe('NewCountry', () => {
  let component: NewCountry;
  let fixture: ComponentFixture<NewCountry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCountry]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCountry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
