import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeerscomponentComponent } from './peerscomponent.component';

describe('PeerscomponentComponent', () => {
  let component: PeerscomponentComponent;
  let fixture: ComponentFixture<PeerscomponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeerscomponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeerscomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
