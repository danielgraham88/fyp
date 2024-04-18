import { TestBed } from '@angular/core/testing';

import { ApiGlobalService } from './api-global.service';

describe('ApiGlobalService', () => {
  let service: ApiGlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiGlobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
