import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackListConformation } from './black-list-conformation';

describe('BlackListConformation', () => {
  let component: BlackListConformation;
  let fixture: ComponentFixture<BlackListConformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlackListConformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlackListConformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
