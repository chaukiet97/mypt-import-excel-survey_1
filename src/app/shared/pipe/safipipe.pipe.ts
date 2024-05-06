import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'safipipe'
})
export class SafipipePipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}
  transform(value) {
    return value?this.domSanitizer.bypassSecurityTrustHtml(value):''
  }

}
