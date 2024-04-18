import { TestBed } from '@angular/core/testing';

import { ApiUserDetailsService } from './api-user-details.service';

describe('ApiUserDetailsService', () => {
  let service: ApiUserDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiUserDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
