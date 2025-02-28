import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePhotoComponent } from './manage-photo.component';

describe('ManagePhotoComponent', () => {
  let component: ManagePhotoComponent;
  let fixture: ComponentFixture<ManagePhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagePhotoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
