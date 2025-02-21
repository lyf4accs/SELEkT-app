import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropsendComponent } from './dropsend.component';

describe('DropsendComponent', () => {
  let component: DropsendComponent;
  let fixture: ComponentFixture<DropsendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropsendComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropsendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
