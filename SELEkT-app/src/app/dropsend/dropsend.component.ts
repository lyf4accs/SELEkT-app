import { Component } from '@angular/core';
import { DropsendService } from '../dropsend.service';
import {Device} from '../models/device.model'
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-dropsend',
  standalone:true,
  imports: [CommonModule],
  templateUrl: './dropsend.component.html',
  styleUrl: './dropsend.component.css',
})
export class DropsendComponent {
  devices: Device[] = [];
  selectedDevice: Device | null = null;

  constructor(public dropSendService: DropsendService) {}

  ngOnInit(): void {
    this.getConnectedDevices();
  }

  getConnectedDevices(): void {
    this.devices = this.dropSendService
      .getDevices()
      .map((id) => ({ id, name: `Device ${id}` }));
  }

  selectDevice(device: Device): void {
    this.selectedDevice = device;
    console.log(`Dispositivo seleccionado: ${device.name}`);
  }

  sendFile(event: any): void {
    if (!this.selectedDevice) {
      console.error('Ningún dispositivo seleccionado');
      return;
    }
    const file = event.target.files[0];
    if (file) {
      console.log(`Enviando archivo a ${this.selectedDevice.name}`);
      this.dropSendService.sendFile(file);
    }
  }
}
