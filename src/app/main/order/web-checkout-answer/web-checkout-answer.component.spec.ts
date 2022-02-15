import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebCheckoutAnswerComponent } from './web-checkout-answer.component';

describe('WebCheckoutAnswerComponent', () => {
  let component: WebCheckoutAnswerComponent;
  let fixture: ComponentFixture<WebCheckoutAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebCheckoutAnswerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebCheckoutAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
