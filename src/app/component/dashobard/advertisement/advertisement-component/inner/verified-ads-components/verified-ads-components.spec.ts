import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiedAdsComponents } from './verified-ads-components';

describe('VerifiedAdsComponents', () => {
  let component: VerifiedAdsComponents;
  let fixture: ComponentFixture<VerifiedAdsComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifiedAdsComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifiedAdsComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
