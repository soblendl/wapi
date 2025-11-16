export class MessageBuilder {
  private parts: string[] = [];
  private center(text: string, width: number): string {
    if (text.length >= width) {
      return text;
    }
    return " ".repeat(Math.floor((width - text.length) / 2)) + text;
  }
  public addTitle(title: string, width?: number): MessageBuilder {
    if (!title.length) {
      return this;
    }
    this.parts.push(this.center(`*『* ${title} *』*`, width ?? 50));
    return this;
  }
  public addSubTitle(subtitle: string, width?: number): MessageBuilder {
    if (!subtitle.length) {
      return this;
    }
    this.parts.push(this.center(`*「* ${subtitle} *」*`, width ?? 25));
    return this;
  }
  public addDescription(description: string): MessageBuilder {
    if (!description.length) {
      return this;
    }
    this.parts.push(`*»* ${description}`);
    return this;
  }
  public addLine(line: string): MessageBuilder {
    if (!line.length) {
      return this;
    }
    this.parts.push(line);
    return this;
  }
  public addList(items: string[], prefix?: string): MessageBuilder {
    for (const item of items) {
      if (!item) {
        continue;
      }
      this.parts.push(`*${prefix ?? "•"}* ${item}`);
    }
    return this;
  }
  public addBlankLine(): MessageBuilder {
    this.parts.push("");
    return this;
  }
  public addFooter(footer: string, width?: number): MessageBuilder {
    if (!footer.length) {
      return this;
    }
    this.parts.push(this.center(`_${footer}_`, width ?? 50));
    return this;
  }
  public build(): string {
    return this.parts.join("\n");
  }
}
