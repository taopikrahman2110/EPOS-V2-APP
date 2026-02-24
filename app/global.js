/* eslint-disable prettier/prettier */
export function convertToRupiah(number) {
  if (number) {
    var rupiah = "";
    var numberrev = number.toString().split("").reverse().join("");

    for (var i = 0; i < numberrev.length; i++)
      if (i % 3 == 0) rupiah += numberrev.substr(i, 3) + ".";

    return (
      "Rp. " +
      rupiah
        .split("", rupiah.length - 1)
        .reverse()
        .join("")
    );
  } else {
    return number;
  }
}

export function AddMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

export function generateUUID() {
  var u = "",
    i = 0;
  while (i++ < 36) {
    var c = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"[i - 1],
      r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    u += c == "-" || c == "4" ? c : v.toString(16);
  }
  return u;
}
