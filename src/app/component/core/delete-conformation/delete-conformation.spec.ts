import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteConformation } from './delete-conformation';

describe('DeleteConformation', () => {
  let component: DeleteConformation;
  let fixture: ComponentFixture<DeleteConformation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConformation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteConformation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
