import { TestBed } from '@angular/core/testing';

import { AdvertiseTypeService } from './advertise-type-service';

describe('AdvertiseTypeService', () => {
  let service: AdvertiseTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdvertiseTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
