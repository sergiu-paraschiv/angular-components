import { TestBed } from '@angular/core/testing';

import { TProgressService } from './t-progress.service';

describe('TProgressService', () => {
  let service: TProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
