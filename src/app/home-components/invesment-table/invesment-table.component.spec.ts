import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvesmentTableComponent } from './invesment-table.component';

describe('InvesmentTableComponent', () => {
  let component: InvesmentTableComponent;
  let fixture: ComponentFixture<InvesmentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvesmentTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvesmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
