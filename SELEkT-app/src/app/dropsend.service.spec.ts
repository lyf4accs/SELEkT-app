import { TestBed } from '@angular/core/testing';

import { DropsendService } from './dropsend.service';

describe('DropsendService', () => {
  let service: DropsendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DropsendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
