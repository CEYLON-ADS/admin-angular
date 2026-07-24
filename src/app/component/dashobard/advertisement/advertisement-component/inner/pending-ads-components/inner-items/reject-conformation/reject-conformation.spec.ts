import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectConformation } from './reject-conformation';

describe('RejectConformation', () => {
  let component: RejectConformation;
  let fixture: ComponentFixture<RejectConformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectConformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectConformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
