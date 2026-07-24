import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdCategory } from './ad-category';

describe('AdCategory', () => {
  let component: AdCategory;
  let fixture: ComponentFixture<AdCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
