import { TestBed } from '@angular/core/testing';

import { GeneralAdvertisementProcessService } from './general-advertisement-process-service';

describe('GeneralAdvertisementProcessService', () => {
  let service: GeneralAdvertisementProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralAdvertisementProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
