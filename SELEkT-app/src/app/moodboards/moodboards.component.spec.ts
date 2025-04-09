import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoodboardsComponent } from './moodboards.component';

describe('MoodboardsComponent', () => {
  let component: MoodboardsComponent;
  let fixture: ComponentFixture<MoodboardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodboardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoodboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
