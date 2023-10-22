import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';

import { environment } from 'src/environments/environment';
import { SignUpService } from './sign-up.service';
import { SignUpModel } from '../models/sign-up.model';

describe('SignUpService', () => {
  let service: SignUpService;
  let httpTestingController: HttpTestingController;
  const mockSignUpData: SignUpModel = {
    firstName: 'John',
    lastName: 'Snow',
    email: 'snow@mail',
    password: 'MockPassword',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SignUpService],
    });

    service = TestBed.inject(SignUpService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send a POST request to the API on calling signUp method', () => {
    service.signUp(mockSignUpData).subscribe();
    const req: TestRequest = httpTestingController.expectOne(
      `${environment.apiUrl}users`,
    );
    expect(req.request.method).toBe('POST');
    req.flush(mockSignUpData);
  });

  it('should receive a response of type SignUpModel when POST request to the API is successful', () => {
    service
      .signUp(mockSignUpData)
      .subscribe((response: boolean | SignUpModel) => {
        expect(response).toBeTruthy();
        expect(response).toEqual(mockSignUpData);
      });

    const req: TestRequest = httpTestingController.expectOne(
      `${environment.apiUrl}users`,
    );
    req.flush(mockSignUpData);
  });

  it('should return false in observable on API error', () => {
    service.signUp(mockSignUpData).subscribe((response) => {
      expect(response).toBe(false);
    });

    const req: TestRequest = httpTestingController.expectOne(
      `${environment.apiUrl}users`,
    );
    req.error(new ErrorEvent('API error'));
  });

  it('should return true in observable if the email is in use', fakeAsync(() => {
    const email = 'inuse@example.com';
    let result: boolean | undefined;

    service.checkEmailInUse(email).subscribe((res) => {
      result = res;
    });
    tick(500);

    expect(result).toBe(true);
  }));

  afterEach(() => {
    httpTestingController.verify();
  });
});
