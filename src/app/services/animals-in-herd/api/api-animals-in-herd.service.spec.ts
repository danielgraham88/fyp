import { TestBed } from '@angular/core/testing';

import { ApiAnimalsInHerdService } from './api-animals-in-herd.service';

describe('ApiAnimalsInHerdService', () => {
  let service: ApiAnimalsInHerdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAnimalsInHerdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
