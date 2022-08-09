import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotpwdModalComponent } from './forgotpwd-modal.component';

describe('ForgotpwdModalComponent', () => {
  let component: ForgotpwdModalComponent;
  let fixture: ComponentFixture<ForgotpwdModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForgotpwdModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotpwdModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
