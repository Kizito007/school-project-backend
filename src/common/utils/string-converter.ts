export class StringConverter {
  static toTitleCase(str: string) {
    const data = str.toLocaleLowerCase().split(' ');
    for (let i = 0; i < data.length; i++) {
      data[i] = data[i].charAt(0).toUpperCase() + data[i].slice(1);
    }
    return data.join(' ');
  }

  static toSentenceCase(str: string) {
    const data = str.toLocaleLowerCase().split(' ');
    data[0] = data[0].charAt(0).toUpperCase() + data[0].slice(1);
    return data.join(' ');
  }
}
