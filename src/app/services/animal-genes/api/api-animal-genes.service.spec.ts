import { TestBed } from '@angular/core/testing';

import { ApiAnimalGenesService } from './api-animal-genes.service';

describe('ApiAnimalGenesService', () => {
  let service: ApiAnimalGenesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAnimalGenesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
