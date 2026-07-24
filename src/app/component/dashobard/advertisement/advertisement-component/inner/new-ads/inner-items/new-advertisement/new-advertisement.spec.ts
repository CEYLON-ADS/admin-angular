import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAdvertisement } from './new-advertisement';

describe('NewAdvertisement', () => {
  let component: NewAdvertisement;
  let fixture: ComponentFixture<NewAdvertisement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewAdvertisement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewAdvertisement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
