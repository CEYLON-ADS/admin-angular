import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FakeConformation } from './fake-conformation';

describe('FakeConformation', () => {
  let component: FakeConformation;
  let fixture: ComponentFixture<FakeConformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FakeConformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FakeConformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
