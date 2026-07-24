import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Secret } from './secret';

describe('Secret', () => {
  let component: Secret;
  let fixture: ComponentFixture<Secret>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Secret]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Secret);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
