import { TestBed } from '@angular/core/testing';

import { EmployeeCertificationService } from './employee-certification.service';

describe('EmployeeCertificationService', () => {
  let service: EmployeeCertificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeCertificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
