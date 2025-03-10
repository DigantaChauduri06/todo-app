import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMention]',
})
export class MentionDirective {
  @Input() users: string[] = []; // List of users
  dropdown: HTMLUListElement | null = null;
  selectedIndex: number = 0;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent) {
    const textarea = this.el.nativeElement as HTMLTextAreaElement;
    const cursorPos = textarea.selectionStart || 0;
    const text = textarea.value.substring(0, cursorPos);
    const match = text.match(/@(\w*)$/); // Detect @mention

    if (match) {
      const search = match[1].toLowerCase();
      const suggestions = this.users.filter((user) => user.toLowerCase().includes(search));

      this.showDropdown(suggestions, cursorPos);
    } else {
      this.removeDropdown();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (!this.dropdown) return;

    if (event.key === 'ArrowDown') {
      this.selectedIndex = (this.selectedIndex + 1) % this.dropdown.children.length;
      this.highlightSelection();
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.selectedIndex = (this.selectedIndex - 1 + this.dropdown.children.length) % this.dropdown.children.length;
      this.highlightSelection();
      event.preventDefault();
    } else if (event.key === 'Enter' && this.dropdown) {
      event.preventDefault();
      this.selectUser();
    }
  }

  private showDropdown(suggestions: string[], position: number) {
    this.removeDropdown();
    if (suggestions.length === 0) return;

    this.dropdown = this.renderer.createElement('ul');
    this.renderer.addClass(this.dropdown, 'mention-dropdown');

    suggestions.forEach((user, index) => {
      const li = this.renderer.createElement('li');
      this.renderer.setProperty(li, 'textContent', user);
      this.renderer.listen(li, 'click', () => this.selectUser(user));
      this.renderer.appendChild(this.dropdown, li);

      if (index === this.selectedIndex) {
        this.renderer.addClass(li, 'selected');
      }
    });

    this.renderer.appendChild(document.body, this.dropdown);
    this.positionDropdown(position);
  }

  private positionDropdown(position: number) {
    if (!this.dropdown) return;
    const rect = this.el.nativeElement.getBoundingClientRect();
    this.renderer.setStyle(this.dropdown, 'position', 'absolute');
    this.renderer.setStyle(this.dropdown, 'top', `${rect.top + 30}px`);
    this.renderer.setStyle(this.dropdown, 'left', `${rect.left + position * 7}px`);
  }

  private highlightSelection() {
    if (!this.dropdown) return;
    Array.from(this.dropdown.children).forEach((child, index) => {
      this.renderer.removeClass(child, 'selected');
      if (index === this.selectedIndex) {
        this.renderer.addClass(child, 'selected');
      }
    });
  }

  private selectUser(user?: string) {
    if (!this.dropdown) return;
    const textarea = this.el.nativeElement as HTMLTextAreaElement;
    const text = textarea.value;
    const cursorPos = textarea.selectionStart || 0;
    const match = text.substring(0, cursorPos).match(/@(\w*)$/);

    if (match) {
      const newText = text.substring(0, match.index) + `@${user || this.dropdown.children[this.selectedIndex].textContent} ` + text.substring(cursorPos);
      textarea.value = newText;
      textarea.selectionStart = textarea.selectionEnd = (match.index || 0) + user!.length + 2;
      textarea.dispatchEvent(new Event('input'));
      this.removeDropdown();
    }
  }

  private removeDropdown() {
    if (this.dropdown) {
      this.dropdown.remove();
      this.dropdown = null;
      this.selectedIndex = 0;
    }
  }
}
