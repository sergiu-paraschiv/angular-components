import { TestBed } from '@angular/core/testing';

import { TGridService } from './t-grid.service';

describe('TGridService', () => {
  let service: TGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
