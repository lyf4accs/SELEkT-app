import { TestBed } from '@angular/core/testing';

import { SimilarPhotoService } from './similar-photo.service';

describe('SimilarPhotoService', () => {
  let service: SimilarPhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimilarPhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
