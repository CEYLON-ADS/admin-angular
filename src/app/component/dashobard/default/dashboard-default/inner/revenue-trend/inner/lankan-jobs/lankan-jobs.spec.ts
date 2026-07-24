import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LankanJobs } from './lankan-jobs';

describe('LankanJobs', () => {
  let component: LankanJobs;
  let fixture: ComponentFixture<LankanJobs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LankanJobs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LankanJobs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
