import {
  Directive,
  HostListener,
  HostBinding,
  ElementRef,
} from "@angular/core";

@Directive({
  selector: "[appDropdown]",
})
export class DropdownDirective {
  @HostBinding("class.open") isOpen = false;

  @HostListener("document:click", ["$event"]) toggleOpen(event: Event) {
    // console.log({target: event.target, elRef: this.elRef.nativeElement})
    this.isOpen = this.elRef.nativeElement.contains(event.target)
      ? !this.isOpen
      : false;
  }

  constructor(private elRef: ElementRef) {}
}
