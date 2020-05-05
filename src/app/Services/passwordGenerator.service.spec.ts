/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PasswordGeneratorService } from './passwordGenerator.service';

describe('Service: PasswordGenerator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PasswordGeneratorService]
    });
  });

  it('should ...', inject([PasswordGeneratorService], (service: PasswordGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
