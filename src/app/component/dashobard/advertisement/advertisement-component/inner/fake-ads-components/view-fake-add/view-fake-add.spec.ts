import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFakeAdd } from './view-fake-add';

describe('ViewFakeAdd', () => {
  let component: ViewFakeAdd;
  let fixture: ComponentFixture<ViewFakeAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFakeAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewFakeAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
