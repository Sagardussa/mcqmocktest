import { TestBed } from '@angular/core/testing';

import { Quiz3Service } from './quiz3.service';

describe('Quiz3Service', () => {
  let service: Quiz3Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Quiz3Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
