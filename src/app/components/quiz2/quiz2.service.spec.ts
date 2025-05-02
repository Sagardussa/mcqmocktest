import { TestBed } from '@angular/core/testing';

import { Quiz2Service } from './quiz2.service';

describe('Quiz2Service', () => {
  let service: Quiz2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Quiz2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
