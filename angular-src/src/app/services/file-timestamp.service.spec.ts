import { TestBed } from '@angular/core/testing';

import { FileTimestampService } from './file-timestamp.service';

describe('FileTimestampService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FileTimestampService = TestBed.get(FileTimestampService);
    expect(service).toBeTruthy();
  });
});
