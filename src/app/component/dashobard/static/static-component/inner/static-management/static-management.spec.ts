import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticManagement } from './static-management';

describe('StaticManagement', () => {
  let component: StaticManagement;
  let fixture: ComponentFixture<StaticManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaticManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaticManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
