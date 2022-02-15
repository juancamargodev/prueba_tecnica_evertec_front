import { TestBed } from '@angular/core/testing';

import { EvertecBackendService } from './evertec-backend.service';

describe('EvertecBackendService', () => {
  let service: EvertecBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EvertecBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
