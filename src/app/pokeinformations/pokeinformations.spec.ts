import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pokeinformations } from './pokeinformations';

describe('Pokeinformations', () => {
  let component: Pokeinformations;
  let fixture: ComponentFixture<Pokeinformations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Pokeinformations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pokeinformations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
