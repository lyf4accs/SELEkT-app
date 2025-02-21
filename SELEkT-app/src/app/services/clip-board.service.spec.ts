import { TestBed } from '@angular/core/testing';

import { ClipboardService } from './clip-board.service';

describe('ClipBoardService', () => {
  let service: ClipboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClipboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
