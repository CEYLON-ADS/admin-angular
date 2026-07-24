import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlackListedUsersComponent } from './black-listed-users-component';

describe('BlackListedUsersComponent', () => {
  let component: BlackListedUsersComponent;
  let fixture: ComponentFixture<BlackListedUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlackListedUsersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlackListedUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
