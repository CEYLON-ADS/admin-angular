import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCites } from './new-cites';

describe('NewCites', () => {
  let component: NewCites;
  let fixture: ComponentFixture<NewCites>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCites]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCites);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
