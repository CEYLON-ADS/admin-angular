import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoostAdvertisement } from './boost-advertisement';

describe('NewAdvertisement', () => {
  let component: BoostAdvertisement;
  let fixture: ComponentFixture<BoostAdvertisement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoostAdvertisement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BoostAdvertisement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
