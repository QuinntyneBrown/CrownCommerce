import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'mentionHighlight', standalone: true })
export class MentionHighlightPipe implements PipeTransform {
  transform(content: string): string {
    if (!content) return content;
    const escaped = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return escaped.replace(
      /@([A-Z][a-z]+ [A-Z][a-z]+)/g,
      '<span class="mention">@$1</span>'
    );
  }
}
