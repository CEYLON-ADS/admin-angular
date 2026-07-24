import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVerifiedAd } from './view-verified-ad';

describe('ViewVerifiedAd', () => {
  let component: ViewVerifiedAd;
  let fixture: ComponentFixture<ViewVerifiedAd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewVerifiedAd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVerifiedAd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
