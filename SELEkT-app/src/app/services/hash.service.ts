import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HashService {
  private lastHashUrlPairs: { hash: string; url: string; fileName: string }[] =
    [];

  setHashes(pairs: { hash: string; url: string; fileName: string }[]): void {
    this.lastHashUrlPairs = pairs;
  }

  getHashes(): { hash: string; url: string; fileName: string }[] {
    return this.lastHashUrlPairs;
  }

  clearHashes(): void {
    this.lastHashUrlPairs = [];
  }
}
