const SLASH_CHAR = '/';

class Utils {
  // Функция определяет присутствуют ли вложенные папки в указанном пути к файлу.
  static isNestedPath(path) {
    if (typeof(path) !== 'string') {
      return;
    }

    return path.includes(SLASH_CHAR);
  }
}

module.exports = Utils;
