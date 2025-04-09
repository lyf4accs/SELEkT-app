import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodboardDisplayComponent } from './moodboard-display.component';

describe('MoodboardDisplayComponent', () => {
  let component: MoodboardDisplayComponent;
  let fixture: ComponentFixture<MoodboardDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodboardDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoodboardDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
