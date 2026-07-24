import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableCountriesManager } from './available-countries-manager';

describe('AvailableCountriesManager', () => {
  let component: AvailableCountriesManager;
  let fixture: ComponentFixture<AvailableCountriesManager>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableCountriesManager]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableCountriesManager);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
