import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainContext } from './main-context';

describe('MainContext', () => {
  let component: MainContext;
  let fixture: ComponentFixture<MainContext>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainContext]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainContext);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
