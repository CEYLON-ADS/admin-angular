import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingAdsComponents } from './pending-ads-components';

describe('PendingAdsComponents', () => {
  let component: PendingAdsComponents;
  let fixture: ComponentFixture<PendingAdsComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingAdsComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingAdsComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
