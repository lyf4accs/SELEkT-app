import { TestBed } from '@angular/core/testing';

import { DuplicatePhotoService } from './duplicate-photo.service';

describe('DuplicatePhotoService', () => {
  let service: DuplicatePhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DuplicatePhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
