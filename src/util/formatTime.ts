function appendLeadingZeroes(n: number) {
  if (n <= 9) {
    return "0" + n;
  }
  return n
}

export function stamp2Date(timestamp: number) {
  var date = new Date(timestamp * 1000)
  var day = date.getDate();
  var monthIndex = date.getMonth() + 1;
  var year = date.getFullYear();

  return day + '.' + appendLeadingZeroes(monthIndex) + '.' + year;
}

export function stamp2ISO8601(timestamp: number) {
  return new Date(timestamp * 1000).toString()
}

export function stamp2DateTime(timestamp: number) {
  var date = new Date(timestamp * 1000)
  var day = date.getDate();
  var monthIndex = date.getMonth() + 1;
  var year = date.getFullYear();
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  return hour + ':' + appendLeadingZeroes(minutes) + ':' + appendLeadingZeroes(seconds) + ', ' + day + '.' + appendLeadingZeroes(monthIndex) + '.' + year;
}

export function stamp2Time(timestamp: number) {
  var date = new Date(timestamp * 1000)
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var seconds = date.getSeconds();

  return hour + ':' + appendLeadingZeroes(minutes) + ':' + appendLeadingZeroes(seconds);
}