import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnmarkAsFakeConformation } from './unmark-as-fake-conformation';

describe('UnmarkAsFakeConformation', () => {
  let component: UnmarkAsFakeConformation;
  let fixture: ComponentFixture<UnmarkAsFakeConformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnmarkAsFakeConformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnmarkAsFakeConformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
