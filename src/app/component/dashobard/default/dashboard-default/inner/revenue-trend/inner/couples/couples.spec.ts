import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Couples } from './couples';

describe('Couples', () => {
  let component: Couples;
  let fixture: ComponentFixture<Couples>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Couples]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Couples);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
