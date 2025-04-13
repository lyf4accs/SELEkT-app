import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeersComponent } from './peerscomponent.component';

describe('PeerscomponentComponent', () => {
  let component: PeersComponent;
  let fixture: ComponentFixture<PeersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
