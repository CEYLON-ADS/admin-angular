import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GirlsPersonal } from './girls-personal';

describe('GirlsPersonal', () => {
  let component: GirlsPersonal;
  let fixture: ComponentFixture<GirlsPersonal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GirlsPersonal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GirlsPersonal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
