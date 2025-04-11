import { TestBed } from '@angular/core/testing';

import { photoFacade } from './photoFacade.service';
describe('MediatorService', () => {
  let service: photoFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(photoFacade);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
