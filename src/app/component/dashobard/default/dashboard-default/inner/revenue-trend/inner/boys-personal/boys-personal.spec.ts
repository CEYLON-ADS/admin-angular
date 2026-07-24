import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoysPersonal } from './boys-personal';

describe('BoysPersonal', () => {
  let component: BoysPersonal;
  let fixture: ComponentFixture<BoysPersonal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoysPersonal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoysPersonal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
