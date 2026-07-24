import { TestBed } from '@angular/core/testing';

import { DashboardStatisticService } from './dashboard-statistic-service';

describe('DashboardStatisticService', () => {
  let service: DashboardStatisticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardStatisticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
