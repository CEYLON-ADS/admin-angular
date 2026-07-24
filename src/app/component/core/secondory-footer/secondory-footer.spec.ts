import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondoryFooter } from './secondory-footer';

describe('SecondoryFooter', () => {
  let component: SecondoryFooter;
  let fixture: ComponentFixture<SecondoryFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecondoryFooter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecondoryFooter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
