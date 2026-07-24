import { TestBed } from '@angular/core/testing';

import { SlotAdService } from './slot-ad-service';

describe('SlotAdService', () => {
  let service: SlotAdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SlotAdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
