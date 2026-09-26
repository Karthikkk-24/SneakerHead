import { Injectable } from "@nestjs/common";

@Injectable()
export class SlugService {
  slugify(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80);
  }

  async unique(
    base: string,
    exists: (slug: string) => Promise<boolean>,
  ): Promise<string> {
    const root = this.slugify(base) || "item";
    let candidate = root;
    let i = 2;
    while (await exists(candidate)) {
      candidate = `${root}-${i}`;
      i += 1;
    }
    return candidate;
  }
}
