/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { KeyGenService } from './keyGen.service';

describe('Service: KeyGen', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeyGenService]
    });
  });

  it('should ...', inject([KeyGenService], (service: KeyGenService) => {
    expect(service).toBeTruthy();
  }));
});
