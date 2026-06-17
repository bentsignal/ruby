export function hasWhitespaceOrControlCharacter(value: string) {
  for (const character of value) {
    const codePoint = character.codePointAt(0);
    if (
      codePoint === undefined ||
      codePoint <= 0x1f ||
      codePoint === 0x7f ||
      /\s/.test(character)
    ) {
      return true;
    }
  }
  return false;
}
