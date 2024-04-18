import { TestBed } from '@angular/core/testing';

import { ApiMatchAnimalsService } from './api-match-animals-service';

describe('ApiMatchAnimalsService', () => {
  let service: ApiMatchAnimalsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiMatchAnimalsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
