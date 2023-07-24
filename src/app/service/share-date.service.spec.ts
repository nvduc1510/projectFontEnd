import { TestBed } from '@angular/core/testing';

import { ShareDateService } from './share-date.service';

describe('ShareDateService', () => {
  let service: ShareDateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareDateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
