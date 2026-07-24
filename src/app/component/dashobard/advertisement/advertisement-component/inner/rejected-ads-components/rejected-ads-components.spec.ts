import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedAdsComponents } from './rejected-ads-components';

describe('RejectedAdsComponents', () => {
  let component: RejectedAdsComponents;
  let fixture: ComponentFixture<RejectedAdsComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedAdsComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedAdsComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
