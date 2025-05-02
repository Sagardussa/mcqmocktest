import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appFocusNext]',
})
export class FocusNextDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    const inputElement = this.el.nativeElement as HTMLInputElement;

    if (inputElement.value === '' || +inputElement.value <= 0) {
      // Add the 'is-invalid' class to highlight invalid input
      this.renderer.addClass(inputElement, 'is-invalid');
      event.preventDefault();
    } else {
      // Remove the 'is-invalid' class if the value is valid
      this.renderer.removeClass(inputElement, 'is-invalid');
      this.moveToNextElement(event);
    }
  }

  private moveToNextElement(event: KeyboardEvent) {
    event.preventDefault(); // Prevent form submission on Enter

    const form = this.el.nativeElement.form;
    const elements = Array.from(form.elements) as Array<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >;

    const index = elements.indexOf(this.el.nativeElement as HTMLInputElement);

    // Loop through the next elements until we find a visible and enabled one
    for (let i = index + 1; i < elements.length; i++) {
      const nextElement = elements[i];

      if (this.isElementFocusable(nextElement)) {
        nextElement.focus();
        break;
      }
    }
  }

  private isElementFocusable(element: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    return (
      !element.disabled && // Check if not disabled
      element.offsetParent !== null // Check if visible (part of the rendered layout)
    );
  }
}
