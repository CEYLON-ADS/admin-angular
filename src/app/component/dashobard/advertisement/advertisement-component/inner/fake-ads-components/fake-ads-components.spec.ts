import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeAdsComponents } from './fake-ads-components';

describe('FakeAdsComponents', () => {
  let component: FakeAdsComponents;
  let fixture: ComponentFixture<FakeAdsComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FakeAdsComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FakeAdsComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
