import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifiConformation } from './verifi-conformation';

describe('VerifiConformation', () => {
  let component: VerifiConformation;
  let fixture: ComponentFixture<VerifiConformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerifiConformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerifiConformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
