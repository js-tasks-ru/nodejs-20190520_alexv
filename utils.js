const SLASH_REGEXP = /\//g;

class Utils {
  // Функция определяет присутствуют ли вложенные папки в указанном пути к файлу
  static isNestedPath(path) {
    if (typeof(path) !== 'string') {
      return;
    }

    const nestings = path.match(SLASH_REGEXP); // массив со слешами "/", либо null
    return Boolean(nestings);
  }
}

module.exports = Utils;
