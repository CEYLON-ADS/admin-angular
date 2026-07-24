import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAds } from './new-ads';

describe('NewAds', () => {
  let component: NewAds;
  let fixture: ComponentFixture<NewAds>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAds]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAds);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
