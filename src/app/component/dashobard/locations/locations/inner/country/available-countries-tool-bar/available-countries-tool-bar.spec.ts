import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableCountriesToolBar } from './available-countries-tool-bar';

describe('AvailableCountriesToolBar', () => {
  let component: AvailableCountriesToolBar;
  let fixture: ComponentFixture<AvailableCountriesToolBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvailableCountriesToolBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvailableCountriesToolBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
