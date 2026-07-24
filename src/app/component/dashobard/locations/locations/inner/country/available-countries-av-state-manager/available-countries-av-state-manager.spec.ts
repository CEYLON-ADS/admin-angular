import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableCountriesAvStateManager } from './available-countries-av-state-manager';

describe('AvailableCountriesAvStateManager', () => {
  let component: AvailableCountriesAvStateManager;
  let fixture: ComponentFixture<AvailableCountriesAvStateManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableCountriesAvStateManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableCountriesAvStateManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
