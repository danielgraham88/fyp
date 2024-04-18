import { TestBed } from '@angular/core/testing';

import { ApiAnimalDefectsService } from './api-animal-defects.service';

describe('ApiAnimalDefectsService', () => {
  let service: ApiAnimalDefectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAnimalDefectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
