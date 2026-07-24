import { TestBed } from '@angular/core/testing';
import { GeneralAdvertisementService} from './general-advertisement';

describe('GeneralAdvertisementService', () => {
  let service: GeneralAdvertisementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralAdvertisementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
