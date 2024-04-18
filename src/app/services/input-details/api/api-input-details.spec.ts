import { TestBed } from '@angular/core/testing';

import { ApiInputDetailsService } from './api-input-detials.service';

describe('ApiInputDetailsService', () => {
  let service: ApiInputDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiInputDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
