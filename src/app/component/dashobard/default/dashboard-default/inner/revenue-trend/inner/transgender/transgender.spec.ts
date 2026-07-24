import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Transgender } from './transgender';

describe('Transgender', () => {
  let component: Transgender;
  let fixture: ComponentFixture<Transgender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Transgender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Transgender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
