
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  writeText(text: string): Promise<void> {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    } else {

      return new Promise<void>((resolve, reject) => {
        const span = document.createElement('span');
        span.textContent = text;
        span.style.whiteSpace = 'pre';
        span.style.position = 'absolute';
        span.style.left = '-9999px';
        span.style.top = '-9999px';
        document.body.appendChild(span);
        const range = document.createRange();
        range.selectNode(span);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        let success = false;
        try {
          success = document.execCommand('copy');
        } catch (err) {
          reject(err);
        }
        selection?.removeAllRanges();
        span.remove();
        success ? resolve() : reject('Copy command failed');
      });
    }
  }
}
